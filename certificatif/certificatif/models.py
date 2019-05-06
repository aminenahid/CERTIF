from django.conf import settings
from django.db import models
from django.contrib.auth.models import UserManager, AbstractBaseUser, PermissionsMixin
import datetime 
from django.core import validators
from django.contrib.postgres.fields import JSONField
from django.utils.translation import ugettext_lazy as _


class Student(AbstractBaseUser, PermissionsMixin):
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
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True) #To be changed
    given_names = models.CharField(max_length=100,
        help_text=_('Please use a comma as separator between your given names'))
    last_name = models.CharField(max_length=100)

    def get_full_name(self):
        return "%s %s" % (self.given_names, self.last_name)
    
    def get_short_name(self):
        return "%s" % (self.given_names[:self.given_names.find(',')])

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email']
    objects = UserManager()


class University (User):
    name = models.CharField(max_length=100)
    short_name = models.CharField(max_length=100)
    public_key = models.CharField(max_length=128, unique=True)

    def get_full_name(self):
        return "%s" % (self.name)

    def get_short_name(self):
        return "%s" % (self.short_name)

class Diploma (models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    diploma_file = JSONField()

    def get_diploma(self):
        return self.diploma_file