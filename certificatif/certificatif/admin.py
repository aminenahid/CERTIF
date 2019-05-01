from django.contrib import admin

from certificatif.models import User, Student, University, DiplomaGroup, Diploma


class UserAdmin(admin.ModelAdmin):
    pass


admin.site.register(User, UserAdmin)
admin.site.register(Student, UserAdmin)
admin.site.register(University, UserAdmin)
admin.site.register(DiplomaGroup, UserAdmin)
admin.site.register(Diploma, UserAdmin)
