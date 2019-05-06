from rest_framework import routers, serializers, viewsets, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from django.db import transaction
from certificatif.models import *
from certificatif.serializers import *
from rest_framework.status import (
	HTTP_401_UNAUTHORIZED,
	HTTP_400_BAD_REQUEST,
	HTTP_200_OK
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
		return Response({'error': 'Invalid Credentials'}, status=HTTP_401_UNAUTHORIZED)

	token, _ = Token.objects.get_or_create(user=user)
	return Response({'token': token.key}, status=HTTP_200_OK)

@api_view(["GET"])
def logout(request):
	request.user.auth_token.delete()
	return Response(status=status.HTTP_200_OK)

@api_view(["POST"])
def signup(request):

	email = request.data.get("email")
	username = request.data.get("username")
	password = request.data.get("password")
	given_names = request.data.get("given_names")
	last_name= request.data.get("last_name")

	try:
		User.objects.get(email=email)
		return Response({'action': False, 'erreur' : "L'adresse mail est déjà utilisée."}, status=HTTP_200_OK)
	except:
		pass

	try:
		User.objects.get(username=username)
		return Response({'action': False, 'erreur' : "Ce nom d'utilisateur est déjà utilisé."}, status=HTTP_200_OK)
	except:
		pass

	new_user = User (username=username, given_names=given_names, email=email, password=password, last_name=last_name  )
	new_user.save()

	return Response({'action': True}, status=HTTP_200_OK)

#This has not been tested neither
@api_view(["POST"])
def verify_certificate(request):
	diploma = request.data.get("diploma")

	if diploma is None:
		return Response({'error': 'Please provide a diploma'}, status=HTTP_400_BAD_REQUEST)

	univ_name = diploma["badge"]["issuer"]["name"] # FIXME as to work with public_key (Louis)

	univ = None
	try:
		univ = University.objects.get(name=univ_name)
	except Exception as error:
		return Response({'is_valid': False, 'error': "Invalid university: "+str(error)}, status=HTTP_200_OK)

	# Verify the diploma in the Blockchain
	is_valid = uav.verifyOnBlockChain_v2(diploma)
	return Response({'is_valid': is_valid, 'university': univ.short_name }, status=HTTP_200_OK)

@api_view(["POST"])
@permission_classes((IsAuthenticated, ))
def upload_diploma(request):
	my_diploma = request.data.get("diploma")

	if diploma is None:
		return Response({'error': 'Please provide a diploma'}, status=HTTP_400_BAD_REQUEST)

	diploma = Diploma(diploma_file = my_diploma, student = User.objects.get(pk=request.user.id))
	diploma.save()
