from .models import CustomUser, Note
from rest_framework import serializers
from .models import Note
from cryptography.fernet import Fernet
import hashlib

key = Fernet.generate_key()
cipher_suite = Fernet(key)

def encrypt(text):
    return cipher_suite.encrypt(text.encode()).decode()

def decrypt(text):
    return cipher_suite.decrypt(text.encode()).decode()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ["id", "username", "password", "email", "role"]
        extra_kwargs = {
            "password": {"write_only": True},
            "email": {"required": True},
        }

    def create(self, validated_data):
        username = validated_data['username']
        email = validated_data['email']
        hashed_email = hashlib.sha256(email.encode()).hexdigest()
        hashed_username = hashlib.sha256(username.encode()).hexdigest()

        user = CustomUser.objects.create_user(
            username=hashed_username,
            password=validated_data['password'],
            email=hashed_email
        )
        return user

class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = ['id', 'title', 'content', 'created_at', 'updated_at']

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['title'] = decrypt(instance.title)
        representation['content'] = decrypt(instance.content)
        return representation

    def create(self, validated_data):
        validated_data['title'] = encrypt(validated_data['title'])
        validated_data['content'] = encrypt(validated_data['content'])
        return super().create(validated_data)

    def update(self, instance, validated_data):
        if 'title' in validated_data:
            instance.title = encrypt(validated_data['title'])
        if 'content' in validated_data:
            instance.content = encrypt(validated_data['content'])
        instance.save()
        return instance