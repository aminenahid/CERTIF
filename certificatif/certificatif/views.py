from rest_framework import routers, serializers, viewsets, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.http import JsonResponse
from django.contrib.auth import authenticate
from certificatif.models import *
from certificatif.serializers import *
from rest_framework.status import (
	HTTP_404_NOT_FOUND,
	HTTP_400_BAD_REQUEST,
	HTTP_200_OK,
	HTTP_403_FORBIDDEN
)

@api_view(["POST"])
def login(request):
	username = request.data.get("username")
	password = request.data.get("password")

	if username is None or password is None:
		return Response({'error': 'Please provide both username and password'}, status=HTTP_400_BAD_REQUEST)

	user = authenticate(username=username, password=password)
	if not user:
		return Response({'error': 'Invalid Credentials'}, status=HTTP_404_NOT_FOUND)
	
	is_univ=True
	try:
		University.objects.get(pk=user.id)
	except:
		is_univ=False

	token, _ = Token.objects.get_or_create(user=user)
	return Response({'token': token.key, 'is_univ': is_univ}, status=HTTP_200_OK)

@api_view(["GET"])
def logout(request):
	request.user.auth_token.delete()
	return Response(status=status.HTTP_200_OK)

@api_view(["GET"])
@permission_classes((permissions.IsAuthenticated, ))
def get_university_short_name(request):
	university = University.objects.get(pk=request.user.id)
	serializedUniversity = UniversitySerializer(university)
	return Response(serializedUniversity.data)

@api_view(['POST'])
@permission_classes((IsAuthenticated, ))
def issue_diploma(request):
	issuer_university = University.objects.get(pk=request.user.id)
	if not issuer_university.authorisation_manage():
		return Response({'error': 'Your institution is not authorised to issue diplomas'}, status=HTTP_403_FORBIDDEN)
	#Storage of temporary diploma (VERIFY REQUEST ATTRIBUTES !!!)
	group = DiplomaGroup(university=issuer_university, transaction='none', title=request.schema.badge.name)
	group.save()
	temp_diploma = Diploma(group=group, student=Student.objects.get(email=request.schema.recipient.identity), diploma_file=request.schema)
	temp_diploma.save()
	#Blockcert issue (+ UPDATE TRANSACTION ID)
	
	#Delete diploma from DB if refused