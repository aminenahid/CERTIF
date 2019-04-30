from django.db import models
from django.contrib.auth.models import AbstractUser
import datetime 
from django.contrib.postgres.fields import JSONField

class User(AbstractUser):
    public_key = models.CharField(max_length=64, unique=True)
    is_student = models.BooleanField(default=False)
    is_university = models.BooleanField(default=False)

    USERNAME_FIELD = 'username'

class Student (models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    given_names = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)

class University (models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    is_autorised = models.BooleanField(default=False)
    autorisation_expiry_date = models.DateField()

class DiplomaGroup (models.Model):
    university = models.ForeignKey(University, on_delete=models.CASCADE)
    transaction = models.CharField(max_length=64)
    title = models.CharField(max_length=100)
    issue_date = models.DateField(default=datetime.date.today)

class Diploma (models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    group = models.ForeignKey(DiplomaGroup, on_delete=models.CASCADE)
    diploma_file = JSONField()