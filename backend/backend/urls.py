from django.contrib import admin
from django.conf.urls.static import static
from django.conf import settings
from django.urls import include, path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView, TokenVerifyView,
)
from accounts.views import UserViewSet
from restaraunts.views import (
    RestaurantViewSet, MenuViewSet, MenuListViewSet,
    TagViewSet, TagGroupViewSet, RestaurantTagsViewSet,
    DishItemViewSet, PhotoViewSet, PhotoListViewSet, CategoryViewSet, DishListViewSet,
    RestaurantListViewSet, RestaurantTagsListViewSet, RestaurantTagsPUTViewSet,
    RestaurantTagsPATCHViewSet, UserBookingViewSet, BookingStatusViewSet, BookingViewSet, EmployeeViewSet,
    BookingAcceptViewSet, BookingRejectViewSet, UserRestaurantViewSet, BookingRetrieveDeleteViewSet, ReviewsViewSet,
    ReviewsRetrieveDeleteViewSet, FavoriteRestaurantViewSet
)
from rest_framework_nested import routers


router = routers.DefaultRouter()
router.register(r'user', UserViewSet, basename='user')
router.register(r'restaurant', RestaurantViewSet)
router.register(r'menu', MenuViewSet, basename='menu')
router.register(r'tag', TagViewSet, basename='tag')
router.register(r'tag-group', TagGroupViewSet, basename='tagGroup')
router.register(r'restaurant-tags', RestaurantTagsViewSet, basename='restaurantTags')
router.register(r'category', CategoryViewSet, basename='category')
router.register(r'dish-item', DishItemViewSet, basename='dishItem')
router.register(r'photo', PhotoViewSet, basename='photo')


restaurant_router = routers.NestedSimpleRouter(router, r'restaurant', lookup='restaurant')
restaurant_router.register(r'menu', MenuListViewSet, basename='menu')
restaurant_router.register(r'photo', PhotoListViewSet, basename='photo')
restaurant_router.register(r'tag', RestaurantTagsListViewSet, basename='tag')
restaurant_router.register(r'tag-put', RestaurantTagsPUTViewSet, basename='tagPUT')
restaurant_router.register(r'tag-patch', RestaurantTagsPATCHViewSet, basename='tagPATCH')
restaurant_router.register(r'booking', BookingViewSet, basename='booking')
restaurant_router.register(r'employee', EmployeeViewSet, basename='employee')
restaurant_router.register(r'reviews', ReviewsViewSet, basename='reviews')

dishes_router = routers.NestedSimpleRouter(router, r'category', lookup='category')
dishes_router.register(r'dishes', DishListViewSet, basename='dishes')

restaurant_user_router = routers.NestedSimpleRouter(router, r'user', lookup='user')
restaurant_user_router.register(r'restaurant', RestaurantListViewSet, basename='restaurant')
restaurant_user_router.register(r'booking', UserBookingViewSet, basename='booking')
restaurant_user_router.register(r'favorite', FavoriteRestaurantViewSet, basename='favorite')

urlpatterns = [
                  path(r'', include(router.urls)),
                  path(r'', include(restaurant_router.urls)),
                  path(r'', include(dishes_router.urls)),
                  path(r'', include(restaurant_user_router.urls)),
                  path('restaurant/<int:pk>/reviews/', ReviewsViewSet.as_view({'get': 'list', 'post': 'create'})),
                  path('reviews/<int:pk>/', ReviewsRetrieveDeleteViewSet.as_view({'get': 'retrieve',
                                                                                 'delete': 'destroy'})),
                  path('booking/<int:pk>/', BookingRetrieveDeleteViewSet.as_view({'get': 'retrieve',
                                                                                 'delete': 'destroy'})),
                  path('booking/<int:pk>/status/', BookingStatusViewSet.as_view({'patch': 'partial_update',
                                                                                 'get': 'retrieve',
                                                                                 'put': 'update'})),
                  path('booking/<int:pk>/accept/', BookingAcceptViewSet.as_view({'patch': 'partial_update'})),
                  path('booking/<int:pk>/reject/', BookingRejectViewSet.as_view({'patch': 'partial_update'})),
                  path('user/<int:pk>/user-restaurant/', UserRestaurantViewSet.as_view({'get': 'retrieve'})),
                  path('admin/', admin.site.urls),
                  path('api/token/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
                  path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
                  path('api/token/verify/', TokenVerifyView.as_view(), name='token_verify'),
                  path('api-auth/', include('rest_framework.urls', namespace='rest_framework'))
              ] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
