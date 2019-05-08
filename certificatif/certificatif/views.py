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
from certificatif.pdfdiploma import pdf_diploma_from_mem_to_mem
from django.http import HttpResponse
from binascii import b2a_base64

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
@permission_classes((permissions.IsAuthenticated, ))
def get_user_name(request):
	user = User.objects.get(pk=request.user.id)
	serializedUser = UserSerializer(user)
	return Response(serializedUser.data)

@api_view(["GET"])
def logout(request):
	request.user.auth_token.delete()
	return Response(status=status.HTTP_200_OK)

@api_view(["POST"])
def signup(request):

	email = request.data.get("email").lower()
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

	new_user = User (username=username, given_names=given_names, email=email, last_name=last_name  )
	new_user.set_password(password)
	new_user.save()

	return Response({'action': True}, status=HTTP_200_OK)

#TODO This has not been tested neither
@api_view(["POST"])
def verify_certificate(request):
	diploma = request.data.get("diploma")

	if diploma is None:
		return Response({'error': 'Please provide a diploma'}, status=HTTP_400_BAD_REQUEST)

	try:
		univ_name = diploma["badge"]["issuer"]["name"]
		univ = University.objects.get(name=univ_name)
		year = diploma["issuedOn"][0:4]
		diploma_type = diploma['badge']['name']

		if not univ.is_authorised(year, diploma_type):
			return Response({'error': 'The issuing university was not allowed to issue such a diploma on the issue date'}, status=HTTP_200_OK)

		# Verify the diploma in the Blockchain
		is_valid = uav.verifyOnBlockChain_v2(diploma)
		return Response({'is_valid': is_valid, 'university': univ.short_name }, status=HTTP_200_OK)
	except Exception as error:
		return Response({'is_valid': False, 'error': "Invalid university: "+str(error)}, status=HTTP_200_OK)


#TODO This has not been tested neither
@api_view(["POST"])
@permission_classes((IsAuthenticated, ))
def upload_diploma(request):
	my_diploma = request.data.get("diploma")
	student = User.objects.get(pk=request.user.id)

	if my_diploma is None:
		return Response({'error': 'Please provide a diploma'}, status=HTTP_400_BAD_REQUEST)

	diploma = Diploma(diploma_file = my_diploma, student = student)
	diploma.save()
	return Response({'upload_status': 'ok'}, status=HTTP_200_OK)

#TODO This has not been tested neither
@api_view(["GET"])
@permission_classes((IsAuthenticated, ))
def look_for_my_diplomas(request):
	student = User.objects.get(pk=request.user.id)
	portfolio = Diploma.objects.filter(student=student).values_list('id','diploma_file')
	return Response({'diplomas': portfolio}, status=HTTP_200_OK)

@api_view(["POST"])
def certificate_file_pdf(request):
	diploma = request.data.get("diploma")

	if diploma is None:
		return Response({'error': 'Please provide a diploma'}, status=HTTP_400_BAD_REQUEST)

	pdf = pdf_diploma_from_mem_to_mem(diploma)

	response = HttpResponse(b2a_base64(pdf), content_type='application/pdf')
	response['Content-Disposition'] = 'inline;filename=diploma.pdf'
	return response
