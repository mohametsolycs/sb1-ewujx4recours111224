import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginForm } from './components/auth/LoginForm';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { Dashboard } from './features/dashboard/Dashboard';
import { AdminDashboard } from './features/admin/AdminDashboard';
import { SettingsPage } from './features/settings/SettingsPage';
import { ClaimsPage } from './features/claims/ClaimsPage';
import { ClaimDetailsPage } from './features/claims/ClaimDetailsPage';
import { PaymentsPage } from './features/payments/PaymentsPage';
import { useAuthStore } from './store/authStore';

function App() {
  const { user } = useAuthStore();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/claims"
          element={
            <ProtectedRoute requiredRole="insurer">
              <ClaimsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/claims/:id"
          element={
            <ProtectedRoute requiredRole="insurer">
              <ClaimDetailsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payments"
          element={
            <ProtectedRoute requiredRole="insurer">
              <PaymentsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          }
        />
        <Route 
          path="/" 
          element={
            <Navigate 
              to={user?.role === 'admin' ? '/admin' : '/dashboard'} 
              replace 
            />
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;