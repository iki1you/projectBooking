from rest_framework import serializers
from accounts.models import User
from restaraunts.models import Restaurant


class UserSerializer(serializers.ModelSerializer):

    def __init__(self, *args, **kwargs):
        # Don't pass the 'fields' arg up to the superclass
        fields = kwargs.pop('fields', None)

        # Instantiate the superclass normally
        super(UserSerializer, self).__init__(*args, **kwargs)

        if fields is not None:
            # Drop any fields that are not specified in the `fields` argument.
            allowed = set(fields)
            existing = set(self.fields.keys())
            for field_name in existing - allowed:
                self.fields.pop(field_name)


    def create(self, validated_data):
        user = User.objects.create(**validated_data)
        user.set_password(user.password)
        user.save()
        return user

    def update(self, instance, validated_data):
        instance.email = validated_data.get('email', instance.email)
        if validated_data.get('password'):
            instance.set_password(validated_data.get('password'))
        instance.full_name = validated_data.get('full_name', instance.full_name)
        instance.phone_number = validated_data.get('phone_number', instance.phone_number)
        instance.avatar = validated_data.get('avatar', instance.avatar)
        instance.birth_date = validated_data.get('birth_date', instance.birth_date)
        instance.is_active = validated_data.get('is_active', instance.is_active)
        instance.role = validated_data.get('role', instance.role)
        instance.save()
        return instance

    class Meta:

        model = User
        fields = ['id', 'email', 'password', 'role', 'avatar', 'full_name', 'birth_date', 'phone_number']
        write_only_fields = ('password',)
