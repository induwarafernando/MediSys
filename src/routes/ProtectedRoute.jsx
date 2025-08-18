import React from 'react';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const hasToken = !!localStorage.getItem('idToken');
  return hasToken ? children : <Navigate to="/login" replace />;
}
