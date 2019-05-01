from django.conf import settings
from django.db import models
from django.contrib.auth.models import AbstractBaseUser
import datetime 
from django.core import validators
from django.contrib.postgres.fields import JSONField
from django.utils.translation import ugettext_lazy as _


class User(AbstractBaseUser):
    email = models.EmailField(max_length=255, unique=True)
    username = models.CharField(max_length=30, unique=True,
        validators=[
            validators.RegexValidator(r'^[\w.@+-]+$',
                _('Enter a valid username. '
                'This value may contain only letters, numbers '
                'and @/./+/-/_ characters.'), 'invalid'),
        ],
        error_messages={
            'unique': _("A user with that username already exists."),
        })
    public_key = models.CharField(max_length=64, unique=True)
    date_joined = models.DateField(default=datetime.date.today)

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email','public_key']


class Student (User):
    given_names = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)

    def get_full_name(self):
        return "%s %s" % (self.given_names, self.last_name)
    
    def get_short_name(self):
        return "%s" % (self.given_names[:self.given_names.find(' ')])


class University (User):
    name = models.CharField(max_length=100)
    short_name = models.CharField(max_length=100)
    is_authorised = models.BooleanField(default=False)
    autorisation_expiry_date = models.DateField()

    def get_full_name(self):
        return "%s" % (self.name)

    def get_short_name(self):
        return "%s" % (self.short_name)


class DiplomaGroup (models.Model):
    university = models.ForeignKey(University, on_delete=models.CASCADE)
    transaction = models.CharField(max_length=64)
    title = models.CharField(max_length=100)
    issue_date = models.DateField(default=datetime.date.today)


class Diploma (models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    group = models.ForeignKey(DiplomaGroup, on_delete=models.CASCADE)
    diploma_file = JSONField()

    def get_diploma(self):
        return self.diploma_file