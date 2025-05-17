from django.urls import path
from products.views import (
    CategoryCreateApiView, CategoryListApiView, CategoryDeleteApiView,
    ProductCreateApiView, ProductListApiView, ProductDeleteApiView, ProductUpdateApiView
)

urlpatterns = [
    path('category/create/', CategoryCreateApiView.as_view()),
    path('category/all/', CategoryListApiView.as_view()),
    path('category/delete/<int:id>/', CategoryDeleteApiView.as_view()),
    path('products/create/', ProductCreateApiView.as_view()),
    path('products/all/', ProductListApiView.as_view()),
    path('products/delete/<int:id>/', ProductDeleteApiView.as_view()),
    path('product/update/<int:id>/', ProductUpdateApiView.as_view()),
]