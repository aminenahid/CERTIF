from rest_framework import routers, serializers, viewsets, permissions
from rest_framework.decorators import api_view, permission_classes
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
	HTTP_200_OK
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

@api_view(["POST"])
def signup(request):
	email = request.data.get("email")
	username = request.data.get("username")
	password = request.data.get("password")
	surname = request.data.get("surname")
	last_name= request.data.get("last_name")
	public_key= request.data.get("public_key")

	try:
		Student.objects.get(email=email)
	except:
		return Response({'action': False, 'Reason' : "A user is already registred with this email."}, status=HTTP_200_OK)

	try:
		User.objects.get(public_key=public_key)
	except:
		return Response({'action': False, 'Reason' : "A user has already this public key."}, status=HTTP_200_OK)


	student = Student (username=username, given_names=surname, email=email, password=password, last_name=last_name , public_key=public_key )
	student.save()
	return Response({'action': True}, status=HTTP_200_OK)
