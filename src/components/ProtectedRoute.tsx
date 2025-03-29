import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../enums/User';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole = UserRole.GUEST 
}) => {
  try {
    // Use auth context
    const { hasPermission, isAuthenticated } = useAuth();
    
    // If not authenticated, redirect to login
    if (!isAuthenticated) {
      return <Navigate to="/" />;
    }
    
    // Check permissions
    if (!hasPermission(requiredRole)) {
      return <Navigate to="/unauthorized" />;
    }
    
    // If authenticated and has permission, show the protected content
    return <>{children}</>;
  } catch (error) {
    // If AuthContext is not available or there's an error, redirect to unauthorized
    console.error("Auth context error:", error);
    return <Navigate to="/unauthorized" />;
  }
};

export default ProtectedRoute;
