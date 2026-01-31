import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import GroceryList from './pages/GroceryList';
import Pantry from './pages/Pantry';
import MealPlanner from './pages/MealPlanner';
import FamilySharing from './pages/FamilySharing';
import Insights from './pages/Insights';
import './index.css';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <div className="loading-screen">Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/login" />;

  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-center" toastOptions={{
          style: {
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(10px)',
            color: '#333',
          },
        }} />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/grocery-list" element={
            <ProtectedRoute>
              <GroceryList />
            </ProtectedRoute>
          } />
          <Route path="/pantry" element={
            <ProtectedRoute>
              <Pantry />
            </ProtectedRoute>
          } />
          <Route path="/meal-planner" element={
            <ProtectedRoute>
              <MealPlanner />
            </ProtectedRoute>
          } />
          <Route path="/family" element={
            <ProtectedRoute>
              <FamilySharing />
            </ProtectedRoute>
          } />
          <Route path="/insights" element={
            <ProtectedRoute>
              <Insights />
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
