from typing import Dict, Any

from django.contrib.auth import authenticate
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer, TokenObtainSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import exceptions
from typing import Any, Dict
from accounts.models import User
from django.conf import settings
from rest_framework.settings import api_settings


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = User.USERNAME_FIELD

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['id'] = user.id
        token['full_name'] = user.full_name
        token['email'] = user.email
        token['role'] = user.role
        token['birth_date'] = user.birth_date
        token['avatar'] = str(user.avatar)
        token['phone_number'] = user.phone_number
        # ...

        return token

    #def validate(self, attrs):
    #    data = super().validate(attrs)
    #    user_data = dict()
    #    user_data['id'] = self.user.id
    #    user_data['full_name'] = self.user.full_name
    #    user_data['email'] = self.user.email
    #    user_data['role'] = self.user.role
    #    user_data['birth_date'] = self.user.birth_date
    #    user_data['avatar'] = str(self.user.avatar)
    #    user_data['phone_number'] = self.user.phone_number
    #    data['user'] = user_data
    #    return data





