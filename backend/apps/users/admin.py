from django.contrib import admin
from .models import User


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ['username', 'email', 'first_name', 'last_name', 'role', 'department', 'is_active']
    list_filter = ['role', 'is_active', 'is_dispatcher', 'is_engineer']
    search_fields = ['username', 'email', 'first_name', 'last_name', 'phone']
    ordering = ['username']
