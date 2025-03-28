import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { UserRole, Region } from '@/enums/User';
import { User } from '@/models/User';

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
    id: '3',
    name: 'เขมิกา',
    surname: 'รัตน์แสง',
    nickname: 'เฟรม',
    email: 'frame@example.com',
    phone: '0641674440',
    role: UserRole.JOINER,
    region: Region.EAST, // Using EAST for Eastern
    joinedAt: new Date(2023, 0, 1), // Assuming joined in 2023
    profileImage: 'https://drive.google.com/open?id=1B6j7A4LFiTrWAudmmAo_fAvuEsu3xEdz',
    birthdate: new Date(2004, 10, 11), // Converting from BE date 11/11/2547 to CE (2547-543=2004)
    lineId: '0641674440',
    foodAllergy: '',
    personalMedicalCondition: '',
    title: 'Camp Participant',
    bio: 'Active camp member'
  },
  {
    id: '1',
    name: 'Jane',
    surname: 'Cooper',
    nickname: 'J',
    email: 'jane@example.com',
    phone: '+1-202-555-0156',
    role: UserRole.ADMIN,
    region: Region.BKK,
    joinedAt: new Date(2022, 0, 1), // January 1, 2022
    profileImage: '/lovable-uploads/439db2b7-c4d3-4bd9-ab25-68e85d686991.png',
    birthdate: new Date(1990, 0, 1), // January 1, 1990
    lineId: 'jane_cooper',
    title: 'Regional Paradigm Technician',
    bio: 'Strategic regional paradigm'
  },
  {
    id: '2',
    name: 'John',
    surname: 'Smith',
    nickname: 'Johnny',
    email: 'john@example.com',
    phone: '+1-303-555-0187',
    role: UserRole.JOINER,
    region: Region.EAST,
    joinedAt: new Date(2023, 5, 15), // June 15, 2023
    birthdate: new Date(1992, 4, 15), // May 15, 1992
    lineId: 'johnny_s',
    title: 'Outdoor Enthusiast',
    bio: 'Love camping and hiking'
  },
];

// Default user for new registrations
export const createDefaultUser = (email: string, name: string): User => ({
  id: crypto.randomUUID(),
  name,
  email,
  role: UserRole.GUEST, // Default to lowest permission level
});

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
