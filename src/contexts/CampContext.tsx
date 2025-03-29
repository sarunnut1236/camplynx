import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Camp, CampDay, Registration } from '@/models';
import {
  getAllCamps,
  getCampById as getCampByIdProvider,
  createCamp as createCampProvider,
  updateCamp as updateCampProvider,
  deleteCamp as deleteCampProvider,
  getAllRegistrations,
  getRegistrationById as getRegistrationByIdProvider,
  getRegistrationByCampAndUser as getRegistrationByCampAndUserProvider,
  registerForCamp as registerForCampProvider,
  updateRegistration as updateRegistrationProvider,
  getUserRegistrations as getUserRegistrationsProvider
} from '@/providers/camps';

// Define context interface
interface CampContextType {
  camps: Camp[];
  registrations: Registration[];
  createCamp: (camp: Omit<Camp, 'id'>) => void;
  updateCamp: (id: string, camp: Partial<Camp>) => void;
  deleteCamp: (id: string) => void;
  registerForCamp: (userId: string, campId: string, dayAvailability: { [dayId: string]: boolean }) => void;
  updateRegistration: (id: string, dayAvailability: { [dayId: string]: boolean }) => void;
  getUserRegistrations: (userId: string) => Registration[];
  getCampById: (id: string) => Camp | undefined;
  getRegistrationById: (id: string) => Registration | undefined;
  getRegistrationByCampAndUser: (campId: string, userId: string) => Registration | undefined;
}

// Create context
const CampContext = createContext<CampContextType | null>(null);

export const CampProvider = ({ children }: { children: ReactNode }) => {
  const [camps, setCamps] = useState<Camp[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Load saved data
  useEffect(() => {
    const loadData = async () => {
      try {
        const [campsData, registrationsData] = await Promise.all([
          getAllCamps(),
          getAllRegistrations()
        ]);
        
        setCamps(campsData);
        setRegistrations(registrationsData);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  // Create a new camp
  const createCamp = async (campData: Omit<Camp, 'id'>) => {
    try {
      const newCamp = await createCampProvider(campData);
      setCamps(prev => [...prev, newCamp]);
      
      toast({
        title: "Camp created",
        description: `${newCamp.name} has been created successfully.`,
      });
    } catch (error) {
      console.error("Error creating camp:", error);
      toast({
        title: "Error",
        description: "Failed to create camp. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Update an existing camp
  const updateCamp = async (id: string, campData: Partial<Camp>) => {
    try {
      const updatedCamp = await updateCampProvider(id, campData);
      
      if (updatedCamp) {
        setCamps(prev => prev.map(camp => 
          camp.id === id ? updatedCamp : camp
        ));
        
        toast({
          title: "Camp updated",
          description: "The camp has been updated successfully.",
        });
      }
    } catch (error) {
      console.error("Error updating camp:", error);
      toast({
        title: "Error",
        description: "Failed to update camp. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Delete a camp
  const deleteCamp = async (id: string) => {
    try {
      const success = await deleteCampProvider(id);
      
      if (success) {
        setCamps(prev => prev.filter(camp => camp.id !== id));
        setRegistrations(prev => prev.filter(reg => reg.campId !== id));
        
        toast({
          title: "Camp deleted",
          description: "The camp has been deleted successfully.",
        });
      }
    } catch (error) {
      console.error("Error deleting camp:", error);
      toast({
        title: "Error",
        description: "Failed to delete camp. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Register for a camp
  const registerForCamp = async (userId: string, campId: string, dayAvailability: { [dayId: string]: boolean }) => {
    try {
      // Check if already registered
      const existingReg = await getRegistrationByCampAndUserProvider(campId, userId);
      
      if (existingReg) {
        toast({
          title: "Already registered",
          description: "You are already registered for this camp.",
          variant: "destructive",
        });
        return;
      }
      
      const newRegistration = await registerForCampProvider(userId, campId, dayAvailability);
      
      if (newRegistration) {
        setRegistrations(prev => [...prev, newRegistration]);
        
        toast({
          title: "Registration successful",
          description: "You have been registered for the camp.",
        });
      }
    } catch (error) {
      console.error("Error registering for camp:", error);
      toast({
        title: "Error",
        description: "Failed to register for camp. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Update registration
  const updateRegistration = async (id: string, dayAvailability: { [dayId: string]: boolean }) => {
    try {
      const updatedReg = await updateRegistrationProvider(id, dayAvailability);
      
      if (updatedReg) {
        setRegistrations(prev => prev.map(reg => 
          reg.id === id ? updatedReg : reg
        ));
        
        toast({
          title: "Registration updated",
          description: "Your availability has been updated successfully.",
        });
      }
    } catch (error) {
      console.error("Error updating registration:", error);
      toast({
        title: "Error",
        description: "Failed to update registration. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Get user registrations - synchronous wrapper around async provider
  const getUserRegistrations = (userId: string) => {
    return registrations.filter(reg => reg.userId === userId);
  };

  // Get camp by ID - synchronous wrapper around async provider
  const getCampById = (id: string) => {
    return camps.find(camp => camp.id === id);
  };

  // Get registration by ID - synchronous wrapper around async provider
  const getRegistrationById = (id: string) => {
    return registrations.find(reg => reg.id === id);
  };

  // Get registration by camp and user - synchronous wrapper around async provider
  const getRegistrationByCampAndUser = (campId: string, userId: string) => {
    return registrations.find(reg => reg.campId === campId && reg.userId === userId);
  };

  if (loading) {
    return null; // Or a loading spinner
  }

  return (
    <CampContext.Provider value={{
      camps,
      registrations,
      createCamp,
      updateCamp,
      deleteCamp,
      registerForCamp,
      updateRegistration,
      getUserRegistrations,
      getCampById,
      getRegistrationById,
      getRegistrationByCampAndUser
    }}>
      {children}
    </CampContext.Provider>
  );
};

// Custom hook to use camp context
export const useCamp = () => {
  const context = useContext(CampContext);
  if (!context) {
    throw new Error('useCamp must be used within a CampProvider');
  }
  return context;
};
