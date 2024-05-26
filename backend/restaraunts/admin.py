from django.contrib import admin
from restaraunts.models import Restaurant


@admin.register(Restaurant)
class RestaurantAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'address', 'schedule', 'owner']