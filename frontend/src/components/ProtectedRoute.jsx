import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import { StudentVoiceXLoader } from './common/StudentVoiceXLoader';

export function ProtectedRoute({ children, requiredRole }) {
  const { user, role, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <StudentVoiceXLoader mode="fullscreen" label="Authenticating Institutional Session..." sublabel="Verifying cryptographic token & role access..." />;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole) {
    const allowed = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    // CEO has super-executive clearance for both CEO and ADMIN views
    // ADMIN has clearance for ADMIN and EVM views
    if (!allowed.includes(role) && !(role === 'CEO' && allowed.includes('ADMIN')) && !(role === 'ADMIN' && allowed.includes('EVM'))) {
      if (role === 'CEO') return <Navigate to="/ceo/dashboard" replace />;
      if (role === 'ADMIN') return <Navigate to="/admin/dashboard" replace />;
      if (role === 'EVM') return <Navigate to="/evm/dashboard" replace />;
      return <Navigate to="/student/dashboard" replace />;
    }
  }

  return children;
}
