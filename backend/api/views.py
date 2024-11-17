from django.shortcuts import render
from .models import Note, CustomUser
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, AllowAny
from .serializers import UserSerializer, NoteSerializer
import hashlib
from django.db.models import Count
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.views import APIView
from diffprivlib.mechanisms import Laplace


from datetime import datetime
from django.db.models.functions import TruncMonth


class NotesCreatedInAllMonthsView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        notes = Note.objects.annotate(month=TruncMonth('created_at')).values('month').annotate(count=Count('id')).order_by('month')
        notes_by_month = {month: 0 for month in range(1, 13)}

        for entry in notes:
            notes_by_month[entry['month'].month] = entry['count'] 

        epsilon = 1.0
        laplace_mechanism = Laplace(epsilon=epsilon, sensitivity=1)
        
        dp_notes_by_month = [
            {
                'month': month,
                'count': laplace_mechanism.randomise(count)
            }
            for month, count in notes_by_month.items()
        ]

        return Response(dp_notes_by_month)

class UsersCreatedInAllMonthsView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        # Get users for all months, truncating to month level
        users = CustomUser.objects.annotate(month=TruncMonth('date_joined')).values('month').annotate(count=Count('id')).order_by('month')

        # Prepare the data for all 12 months, padding months with no users
        users_by_month = {month: 0 for month in range(1, 13)}  # Initialize a dictionary for all months (1 to 12)

        # Fill the dictionary with actual user counts from the query
        for entry in users:
            users_by_month[entry['month'].month] = entry['count']  # Use the 'month' field from the TruncMonth function

        # Apply differential privacy (Laplace mechanism) to the count
        epsilon = 1.0
        laplace_mechanism = Laplace(epsilon=epsilon, sensitivity=1)
        
        dp_users_by_month = [
            {
                'month': month,
                'count': laplace_mechanism.randomise(count)
            }
            for month, count in users_by_month.items()
        ]

        return Response(dp_users_by_month)

class TotalUsersView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        total_users = CustomUser.objects.count()
        
        epsilon = 1.0
        laplace_mechanism = Laplace(epsilon=epsilon, sensitivity=1)
        dp_total_users = laplace_mechanism.randomise(total_users)
        
        return Response({"total_users": dp_total_users})
    
class TotalNotesView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        total_notes = Note.objects.count()
        
        epsilon = 1.0
        laplace_mechanism = Laplace(epsilon=epsilon, sensitivity=1)
        dp_total_notes = laplace_mechanism.randomise(total_notes)
        
        return Response({"total_notes": dp_total_notes})

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
    
class NoteUpdate(generics.UpdateAPIView):
    queryset = Note.objects.all()
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Note.objects.filter(author=user)


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

class CreateUserView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()  
    serializer_class = UserSerializer
    permission_classes = [AllowAny]