from rest_framework import routers, serializers, viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
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