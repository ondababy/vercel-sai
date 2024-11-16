from django.shortcuts import render
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, AllowAny
from .serializers import UserSerializer, NoteSerializer
from .models import CustomUser, Note
import hashlib
from rest_framework import serializers
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.views import APIView
from diffprivlib.mechanisms import Laplace


class NoteListCreate(generics.ListCreateAPIView):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Note.objects.filter(author=user)

    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save(author=self.request.user)
        else:
            print(serializer.errors)

class NoteDelete(generics.DestroyAPIView):
    queryset = Note.objects.all()
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Note.objects.filter(author=user)
    
class CreateUserView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()  
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['role'] = user.role
        return token
    def validate(self, attrs):
        username = attrs.get(self.username_field)

        hashed_username = hashlib.sha256(username.encode()).hexdigest()
        attrs[self.username_field] = hashed_username

        return super().validate(attrs)

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


# class TotalUsersView(APIView):
#     permission_classes = [IsAuthenticated]

#     def get(self, request):
#         total_users = User.objects.count()
        
#         epsilon = 1.0
#         laplace_mechanism = Laplace(epsilon=epsilon, sensitivity=1)
#         dp_total_users = laplace_mechanism.randomise(total_users)
        
#         return Response({"total_users": dp_total_users})
    
# class TotalNotesView(APIView):
#     permission_classes = [AllowAny]

#     def get(self, request):
#         total_notes = Note.objects.count()
        
#         epsilon = 1.0
#         laplace_mechanism = Laplace(epsilon=epsilon, sensitivity=1)
#         dp_total_notes = laplace_mechanism.randomise(total_notes)
        
#         return Response({"total_notes": dp_total_notes})
