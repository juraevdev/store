from rest_framework import generics, status, permissions
from rest_framework.response import Response
from products.models import Category, Product
from products.serializers import CategorySerializer, ProductSerializer


class CategoryCreateApiView(generics.GenericAPIView):
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response({'message': 'Category created!'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    
class CategoryListApiView(generics.GenericAPIView):
    serializer_class = CategorySerializer


    def get(self, request, *args, **kwargs):
        category = Category.objects.all()
        serializer = self.get_serializer(category, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    

class CategoryDeleteApiView(generics.GenericAPIView):
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, id):
        category = Category.objects.get(id=id)
        category.delete()
        return Response({'Category deleted!'}, status=status.HTTP_200_OK)
    

class ProductCreateApiView(generics.GenericAPIView):
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response({'message': 'Product created'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class ProductListApiView(generics.GenericAPIView):
    serializer_class = ProductSerializer

    def get(self, request, *args, **kwargs):
        product = Product.objects.all()
        serializer = self.get_serializer(product, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    

class ProductDeleteApiView(generics.GenericAPIView):
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, id):
        product = Product.objects.get(id=id)
        product.delete()
        return Response({'message': 'Product deleted!'}, status=status.HTTP_200_OK)
    

class ProductUpdateApiView(generics.GenericAPIView):
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticated]

    def put(self, request, id):
        product = Product.objects.get(id=id)
        serializer = self.get_serializer(product, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Product updated'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)