from rest_framework import serializers
from certificatif.models import *

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model= User
        fields = ('last_name', 'given_names', 'username', )

class UniversitySerializer(serializers.ModelSerializer):
    class Meta:
        model= University
        fields = ('short_name', )
