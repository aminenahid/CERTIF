from django.conf import settings
from django.db import models
from django.contrib.auth.models import UserManager, AbstractBaseUser, PermissionsMixin
import datetime 
from django.core import validators
from django.core.validators import MaxValueValidator, MinValueValidator
from django.contrib.postgres.fields import JSONField
from django.utils.translation import ugettext_lazy as _


class User(AbstractBaseUser, PermissionsMixin):
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


class University (models.Model):
    name = models.CharField(max_length=100)
    short_name = models.CharField(max_length=100)
    public_key = models.CharField(max_length=128, unique=True)

    def get_full_name(self):
        return "%s" % (self.name)

    def get_short_name(self):
        return "%s" % (self.short_name)

    def is_authorised (self, year, my_diploma_type):
        univ_authorisations = self.authorisation_set.all()
        authorised = False
        for ua in univ_authorisations:
            if year>=ua.authorisation_year and year<=ua.expiry_year and my_diploma_type==ua.diploma_type:
                authorised = True
                break
        return authorised

class Diploma (models.Model):
    student = models.ForeignKey(User, on_delete=models.CASCADE)
    diploma_file = JSONField()

    def get_diploma(self):
        return self.diploma_file

class Authorisation (models.Model):
    university = models.ForeignKey(University, on_delete=models.CASCADE)
    law = models.CharField(max_length=200, null=True)
    authorisation_year = models.IntegerField(validators=[MaxValueValidator(datetime.date.today().year)])
    expiry_year = models.IntegerField(validators=[MinValueValidator(datetime.date.today().year)])
    diploma_type = models.CharField(max_length=200)
    REQUIRED_FIELDS = ['authorisation_year','expiry_year']