
import React from 'react';
import { useAuth, UserRole } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole = 'guest' 
}) => {
  // No authentication check, simply render children
  return <>{children}</>;
};

export default ProtectedRoute;
