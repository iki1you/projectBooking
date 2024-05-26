from django.contrib.auth.hashers import make_password
from rest_framework.response import Response

from accounts.models import User
from accounts.serializers import UserSerializer
from restaraunts.models import (
    Restaurant, Photo, Menu, TagGroup, Tag, Category, DishItem, Booking, Employee, Reviews, ReviewPhotos,
    FavoriteRestaurant)
from rest_framework import serializers, renderers

from restaraunts.models import RestaurantTags
import rest_framework
from drf_writable_nested.serializers import WritableNestedModelSerializer


class RestaurantSerializer(serializers.ModelSerializer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if 'context' in kwargs:
            a = kwargs['context']['request']
            print(a)
            fields = kwargs['context']['request'].query_params.get('select')
            if fields is not None:
                fields = fields.split(';')
                allowed = set(fields)
                existing = set(self.fields)
                for field_name in existing - allowed:
                    self.fields.pop(field_name)

    class Meta:
        model = Restaurant
        fields = ['id', 'name', 'rating', 'reviews_count', 'address', 'owner', 'description', 'phone', 'site',
                  'schedule', 'capacityOnTable', 'logo', 'preview']


class PhotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Photo
        fields = ['id', 'image', 'title', 'restaurant']


class DishItemSerializer(serializers.ModelSerializer):

    class Meta:
        model = DishItem
        fields = ['id', 'name', 'price', 'weight', 'compound', 'category', 'photo']


class NestedCategorySerializer(WritableNestedModelSerializer):
    dish_item = DishItemSerializer(many=True)

    class Meta:
        model = Category
        fields = ['id', 'name', 'photo', 'menu', 'dish_item']


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'photo', 'menu']


class MenuListSerializer(WritableNestedModelSerializer):
    category = NestedCategorySerializer(many=True)

    class Meta:
        model = Menu
        fields = ['id', 'name', 'category']


class MenuSerializer(serializers.ModelSerializer):
    class Meta:
        model = Menu
        fields = ['id', 'name', 'restaurant']


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id', 'name', 'group']


class TagGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = TagGroup
        fields = ['id', 'name']


class RestaurantTagsSerializer(serializers.ModelSerializer):
    class Meta:
        model = RestaurantTags
        fields = ['id', 'restaurant', 'tag']


class NestedTagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id', 'name']


class BookingSerializer(serializers.ModelSerializer):
    user_phone = serializers.SerializerMethodField(method_name='get_user_phone')
    user_email = serializers.SerializerMethodField(method_name='get_user_email')
    user_fullname = serializers.SerializerMethodField(method_name='get_user_fullname')
    date = serializers.DateTimeField(format='%Y-%m-%dT%H:%M')
    booking_time = serializers.TimeField(format='%H:%M')

    def create(self, validated_data):
        restaurant_pk = self.context['restaurant_pk']
        status = self.context['status']
        restaurant = Restaurant.objects.get(pk=restaurant_pk)
        validated_data['restaurant'] = restaurant
        validated_data['status'] = status
        post = Booking.objects.create(**validated_data)
        return post

    def get_user_phone(self, obj):
        user_pk = obj.user.id
        user = User.objects.get(pk=user_pk)
        phone_number = user.phone_number
        return phone_number

    def get_user_email(self, obj):
        user_pk = obj.user.id
        user = User.objects.get(pk=user_pk)
        user_email = user.email
        return user_email

    def get_user_fullname(self, obj):
        user_pk = obj.user.id
        user = User.objects.get(pk=user_pk)
        user_full_name = user.full_name
        return user_full_name

    class Meta:
        model = Booking
        fields = ['id', 'date', 'count_people', 'status', 'wishes', 'restaurant', 'booking_date', 'booking_time', 'user',
                  'user_phone', 'user_email', 'user_fullname']
        read_only_fields = ['restaurant', 'status']
        write_only_fields = ['user']


class UserBookingSerializer(serializers.ModelSerializer):
    date = serializers.DateTimeField(format='%Y-%m-%dT%H:%M')
    booking_time = serializers.TimeField(format='%H:%M')
    restaurant_name = serializers.SerializerMethodField(method_name='get_restaurant_name')
    restaurant_address = serializers.SerializerMethodField(method_name='get_restaurant_address')

    def create(self, validated_data):
        restaurant_pk = self.context['restaurant_pk']
        status = self.context['status']
        restaurant = Restaurant.objects.get(pk=restaurant_pk)
        validated_data['restaurant'] = restaurant
        validated_data['status'] = status
        post = Booking.objects.create(**validated_data)
        return post

    def get_restaurant_name(self, obj):
        restaurant_pk = obj.restaurant.id
        restaurant = Restaurant.objects.get(pk=restaurant_pk)
        restaurant_name = restaurant.name
        return restaurant_name

    def get_restaurant_address(self, obj):
        restaurant_pk = obj.restaurant.id
        restaurant = Restaurant.objects.get(pk=restaurant_pk)
        restaurant_name = restaurant.address
        return restaurant_name

    class Meta:
        model = Booking
        fields = ['id', 'date', 'count_people', 'status', 'wishes', 'user', 'restaurant', 'restaurant_name',
                  'restaurant_address', 'booking_date', 'booking_time']
        read_only_fields = ['restaurant', 'status', 'restaurant_name', 'restaurant_address']


class BookingStatusSerializer(serializers.ModelSerializer):
    date = serializers.DateTimeField(format='%Y-%m-%dT%H:%M')
    booking_time = serializers.TimeField(format='%H:%M')
    class Meta:
        model = Booking
        fields = ['id', 'date', 'count_people', 'status', 'wishes', 'user', 'restaurant', 'booking_date', 'booking_time']
        read_only_fields = ['id', 'date', 'count_people', 'wishes', 'user', 'restaurant', 'booking_date', 'booking_time']


class EmployeeSerializer(serializers.ModelSerializer):
    user = UserSerializer(fields=['email', 'full_name', 'password'])

    def create(self, validated_data):
        user_data = validated_data.pop('user')
        user_data['role'] = 'employee'
        user_data['password'] = make_password(user_data['password'])
        user_serializer = UserSerializer(data=user_data)
        user_serializer.is_valid(raise_exception=True)

        user = User.objects.create(**user_serializer.validated_data)
        employee = Employee.objects.create(user=user, restaurant=self.context['restaurant'], is_active=validated_data.pop('is_active', True))
        return employee

    def update(self, instance, validated_data):
        instance.is_active = validated_data.get('is_active', instance.is_active)
        instance.save()
        return instance

    class Meta:
        model = Employee
        fields = ['id', 'user', 'restaurant', 'is_active']
        read_only_fields = ['restaurant']


class ReviewPhotosSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReviewPhotos
        fields = ['id', 'review', 'photo']


class ReviewsSerializer(serializers.ModelSerializer):
    images = serializers.SerializerMethodField(method_name='get_image_list')
    uploaded_images = serializers.ListField(
        child=serializers.ImageField(max_length=1000000, allow_empty_file=False, use_url=False),
        write_only=True, required=False)
    user_name = serializers.SerializerMethodField(method_name='get_user_name', read_only=True)
    user_reviews = serializers.SerializerMethodField(method_name='get_user_reviews', read_only=True)

    def create(self, validated_data):
        restaurant = self.context['restaurant']
        validated_data['restaurant'] = restaurant
        uploaded_images = validated_data.pop("uploaded_images", [])
        review = Reviews.objects.create(**validated_data)
        for image in uploaded_images:
            ReviewPhotos.objects.create(review=review, photo=image)

        return review

    def get_image_list(self, obj):
        images = ['http://' + self.context['request'].META['HTTP_HOST'] + '/media/' + str(i) for i in ReviewPhotos.objects.filter(review=obj.id)]
        return images

    def get_user_name(self, obj):
        return obj.user.full_name

    def get_user_reviews(self, obj):
        user = User.objects.get(pk=obj.user.id)
        return user.reviews_count

    class Meta:
        model = Reviews
        fields = ['id', 'user', 'user_name', 'user_reviews', 'restaurant', 'rating', 'text', 'time', 'images', 'uploaded_images']
        read_only_fields = ['restaurant', 'user_reviews']


class FavoriteRestaurantSerializer(serializers.ModelSerializer):
    def create(self, validated_data):
        user = self.context['user']
        validated_data['user'] = user
        favorite = FavoriteRestaurant.objects.create(**validated_data)

        return favorite


    class Meta:
        model = FavoriteRestaurant
        fields = ['id', 'user', 'restaurant']
        read_only_fields = ['user']


