import React, { createContext, useContext, useState, ReactNode } from 'react';
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

// Initial user data
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
  // Use a default user instead of null
  const defaultUser = initialUsers[0];
  const [user, setUser] = useState<User | null>(defaultUser);
  // Always authenticated
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Login function - still keeping this for functionality
  const login = (userData: User) => {
    const foundUser = initialUsers.find(u => u.email === userData.email) || defaultUser;
    setUser(foundUser);
    
    toast({
      title: "Logged in successfully",
      description: `Welcome back, ${foundUser.name}!`,
    });
    
    navigate('/home');
  };

  // Logout function - still keeping this for functionality
  const logout = () => {
    // Instead of nullifying the user, set it back to default
    setUser(defaultUser);
    
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    });
    
    navigate('/home');
  };

  // Update user function
  const updateUser = (data: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    }
  };

  // Permission check function - allow all permissions
  const hasPermission = (requiredRole: UserRole): boolean => {
    // Always return true to bypass permission checks
    return true;
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
