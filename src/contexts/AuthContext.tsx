import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { UserRole } from '@/enums/User';
import { User } from '@/models/User';
import { getAllUsers, getUserByEmail, getUserById, updateUser as updateUserInProvider, createDefaultUser } from '@/providers/users';

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

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Load users data on mount
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const usersData = await getAllUsers();
        setUsers(usersData);
        
        // Set default user (first user in the list)
        if (usersData.length > 0) {
          setUser(usersData[0] ?? null);
        }
      } catch (error) {
        console.error("Error loading users:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadUsers();
  }, []);

  // Login function
  const login = async (userData: User) => {
    try {
      // Find the user by email if provided, otherwise by ID
      let foundUser: User | null = null;
      
      if (userData.email) {
        const userByEmail = await getUserByEmail(userData.email);
        if (userByEmail) foundUser = userByEmail;
      } else if (userData.id) {
        const userById = await getUserById(userData.id);
        if (userById) foundUser = userById;
      }
      
      // Default to the first user if not found
      const userToLogin = foundUser || (users.length > 0 ? users[0] : null);
      setUser(userToLogin ?? null);
      
      if (userToLogin) {
        toast({
          title: "Logged in successfully",
          description: `Welcome back, ${userToLogin.firstname || 'User'}!`,
        });
      }
      
      navigate('/home');
    } catch (error) {
      console.error("Error during login:", error);
      toast({
        title: "Login failed",
        description: "Could not log in. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Logout function
  const logout = () => {
    // Reset to default user (first in the list)
    const defaultUser = users.length > 0 ? users[0] : null;
    setUser(defaultUser as User | null);

    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    });

    navigate('/home');
  };

  // Update user function
  const updateUser = async (data: Partial<User>) => {
    if (user) {
      try {
        const updatedUser = await updateUserInProvider(user.id, data);
        
        if (updatedUser) {
          setUser(updatedUser);
          
          // Also update the user in the users array
          setUsers(prev => 
            prev.map(u => u.id === user.id ? updatedUser : u)
          );
          
          toast({
            title: "Profile updated",
            description: "Your profile has been updated successfully.",
          });
        }
      } catch (error) {
        console.error("Error updating user:", error);
        toast({
          title: "Update failed",
          description: "Could not update profile. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  // Permission check function - allow all permissions
  const hasPermission = (requiredRole: UserRole): boolean => {
    // Always return true to bypass permission checks
    return true;
  };

  if (loading) {
    return null; // Or a loading spinner
  }

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
