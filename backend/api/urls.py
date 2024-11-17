from django.urls import path
from . import views

urlpatterns = [
    path("notes/", views.NoteListCreate.as_view(), name="note-list"),
    path("notes/delete/<int:pk>/", views.NoteDelete.as_view(), name="delete-note"),
    path("notes/", views.NoteListCreate.as_view(), name="note-list"),
    path("notes/delete/<int:pk>/", views.NoteDelete.as_view(), name="delete-note"),
    path("notes/update/<int:pk>/", views.NoteUpdate.as_view(), name="update-note"),
    path('notes/total/', views.TotalNotesView.as_view(), name='total_notes'),
    path('users/total/', views.TotalUsersView.as_view(), name='total_users'),
    path('users/all-months/', views.UsersCreatedInAllMonthsView.as_view(), name='users-allmonts'),
    path('notes/all-months/', views.NotesCreatedInAllMonthsView.as_view(), name='notes-allmonths'),
]