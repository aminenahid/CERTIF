from rest_framework import serializers
from certificatif.models import *

class StudentSerializer(serializers.Serializer):
    pass

class UniversitySerializer(serializers.ModelSerializer):
    class Meta:
        model= University
        fields = ('short_name', )
    