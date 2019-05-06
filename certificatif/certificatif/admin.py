from django.contrib import admin

from certificatif.models import *


class UserAdmin(admin.ModelAdmin):
    pass


admin.site.register(User, UserAdmin)
admin.site.register(University, UserAdmin)
admin.site.register(Authorisation, UserAdmin)
admin.site.register(Diploma, UserAdmin)
