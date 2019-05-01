from rest_framework import serializers
from certificatif.models import *

class StudentSerializer(serializers.Serializer):
    pass

class UniversitySerializer(serializers.Serializer):
    short_name = serializers.CharField(max_length=100)
    