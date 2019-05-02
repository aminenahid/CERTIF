from rest_framework import routers, serializers, viewsets, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.http import JsonResponse
from django.contrib.auth import authenticate
from django.db import transaction
from certificatif.models import *
from certificatif.serializers import *
from rest_framework.status import (
	HTTP_401_UNAUTHORIZED,
	HTTP_404_NOT_FOUND,
	HTTP_400_BAD_REQUEST,
	HTTP_200_OK,
	HTTP_403_FORBIDDEN
)
import json
import random

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
	'''
	email = request.data.get("email")
	username = request.data.get("username")
	password = request.data.get("password")
	surname = request.data.get("surname")
	last_name= request.data.get("last_name")
	public_key= request.data.get("public_key")

	try:
		Student.objects.get(email=email)
		return Response({'action': False, 'Reason' : "A user is already registred with this email."}, status=HTTP_200_OK)
	except:
		pass


	try:
		User.objects.get(public_key=public_key)
		return Response({'action': False, 'Reason' : "A user has already this public key."}, status=HTTP_200_OK)
	except:
		pass



	student = Student (username=username, given_names=surname, email=email, password=password, last_name=last_name , public_key=public_key )
	student.save()
	'''
	return Response({'action': True}, status=HTTP_200_OK)

#This has not been tested
@api_view(['POST'])
@permission_classes((IsAuthenticated, ))
@transaction.atomic
def issue_diploma(request):
	issuer_university = University.objects.get(pk=request.user.id)

	if not issuer_university.authorisation_manage():
		return Response({'error': 'Your institution is not authorised to issue diplomas'}, status=HTTP_403_FORBIDDEN)

	#Storage of temporary diploma (VERIFY REQUEST ATTRIBUTES !!!)
	group = DiplomaGroup(university=issuer_university, title=request.diploma__badge__name)
	group.save()
	temp_diploma = Diploma(group=group, student=Student.objects.get(email=request.diploma__recipient__identity), diploma_file=request.diploma)
	temp_diploma.save()

	#Blockcert issue and database update
	#check the name of the private_key attribute
	is_validated, transaction_id, uploaded_diploma = issueToBlockChain(request.user.public_key, private_key, str(temp_diploma.diploma_file))
	if is_validated:
		group.transaction = transaction_id
		temp_diploma.diploma_file = json.loads(uploaded_diploma)
		group.save()
		temp_diploma.save()
		return Response({'action': True, 'diploma':json.loads(uploaded_diploma)}, status=HTTP_200_OK)

	else:
		#Rollback the transaction if Blockcerts issue has failed
		transaction.rollback()
		return Response({'error': 'Uploading your diploma to the blockchain has failed'}, status=HTTP_401_UNAUTHORIZED)

#This has not been tested neither
@api_view(["POST"])
def verify_certificate(request):
	diploma = request.data.get("diploma")

	if diploma is None:
		return Response({'error': 'Please provide a diploma'}, status=HTTP_400_BAD_REQUEST)

	public_key = diploma["public_key"] # To modify, Louis knew it, will know it and will tell us

	univ = None
	try:
		univ = University.objects.get(public_key=public_key)
	except:
		return Response({'is_valid': False, 'error': "Invalid university"}, status=HTTP_404_NOT_FOUND)

	# Call Louis' function and check return value

	return Response({'is_valid': True, 'university': univ.short_name }, status=HTTP_200_OK)
