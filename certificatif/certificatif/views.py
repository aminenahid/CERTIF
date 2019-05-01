from rest_framework import routers, serializers, viewsets
from certificatif.models import *
from certificatif.serializers import *

# ViewSets define the view behavior.
class UniversityViewSet(viewsets.ModelViewSet):
    #queryset = University.objects.all()
    #serializer_class = UniversitySerializer
    pass