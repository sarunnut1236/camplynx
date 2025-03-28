
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

// Define user roles
export type UserRole = 'admin' | 'joiner' | 'guest';

// Define user interface
export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  profileImage?: string;
  bio?: string;
  title?: string;
}

// Define auth context interface
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
  hasPermission: (requiredRole: UserRole) => boolean;
}

// Create context
const AuthContext = createContext<AuthContextType | null>(null);

// Initial user data (for demo purposes)
const initialUsers: User[] = [
  {
    id: '1',
    name: 'Jane Cooper',
    email: 'jane@example.com',
    phone: '+1-202-555-0156',
    role: 'admin',
    profileImage: '/lovable-uploads/439db2b7-c4d3-4bd9-ab25-68e85d686991.png',
    title: 'Regional Paradigm Technician',
    bio: 'Strategic regional paradigm'
  },
  {
    id: '2',
    name: 'John Smith',
    email: 'john@example.com',
    phone: '+1-303-555-0187',
    role: 'joiner',
    title: 'Outdoor Enthusiast',
    bio: 'Love camping and hiking'
  }
];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check for saved user on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('camplynx_user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      setIsAuthenticated(true);
    }
  }, []);

  // Login function
  const login = (userData: User) => {
    // For demo purposes, we'll use the mock data
    const foundUser = initialUsers.find(u => u.email === userData.email);
    
    if (foundUser) {
      setUser(foundUser);
      setIsAuthenticated(true);
      localStorage.setItem('camplynx_user', JSON.stringify(foundUser));
      
      toast({
        title: "Logged in successfully",
        description: `Welcome back, ${foundUser.name}!`,
      });
      
      navigate('/home');
    } else {
      toast({
        title: "Login failed",
        description: "Invalid credentials. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('camplynx_user');
    navigate('/');
    
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    });
  };

  // Update user function
  const updateUser = (data: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      localStorage.setItem('camplynx_user', JSON.stringify(updatedUser));
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    }
  };

  // Permission check function
  const hasPermission = (requiredRole: UserRole): boolean => {
    if (!user) return false;
    
    // Role hierarchy: admin > joiner > guest
    if (user.role === 'admin') return true;
    if (user.role === 'joiner' && requiredRole !== 'admin') return true;
    if (user.role === 'guest' && requiredRole === 'guest') return true;
    
    return false;
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      login,
      logout,
      updateUser,
      hasPermission
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
