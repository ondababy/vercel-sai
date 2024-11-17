import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing'; // Import Landing
import Login from './pages/Login';
import Register from './pages/Register';
import Header from './components/Header';
import Admin from './pages/Admin';
import Home from './pages/Home';
import TotalNotes from './pages/TotalNotes';
import TotalUsers from './pages/TotalUsers';
import TotalUsersAllMonths from './pages/TotalUsersAllMonths';
import TotalNotesAllMonths from './pages/TotalNotesAllMonths';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';

function Logout() {
  localStorage.clear();
  return <Navigate to="/login" />;
}

function RegisterAndLogout() {
  localStorage.clear(); // Optionally log out the user before navigating to Register
  return <Register />;
}

function App() {
  return (
    <BrowserRouter>
      {/* The header will appear on all routes */}
      <Header />

      <Routes>
        {/* Default route: Landing */}
        <Route path="/" element={<Landing />} />

        {/* Protected routes */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/total-notes"
          element={
            <ProtectedRoute>
              <TotalNotes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/total-users"
          element={
            <ProtectedRoute>
              <TotalUsers />
            </ProtectedRoute>
          }
        />
 <Route 
          path="/notes-allmonths" 
          element={
            <ProtectedRoute>
              <TotalNotesAllMonths />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/users-allmonths" 
          element={
            <ProtectedRoute>
              <TotalUsersAllMonths />
            </ProtectedRoute>
          } 
        />
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/register" element={<RegisterAndLogout />} />
        <Route path="/admin" element={<Admin />} />
        
        {/* Catch-all route for 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
