import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Camp, Registration } from '@/models';
import { useTranslation } from 'react-i18next';
import {
  getAllCamps,
  createCamp as createCampProvider,
  updateCamp as updateCampProvider,
  deleteCamp as deleteCampProvider,
  getAllRegistrations,
  getRegistrationByCampAndUser as getRegistrationByCampAndUserProvider,
  registerForCamp as registerForCampProvider,
  updateRegistration as updateRegistrationProvider} from '@/providers/camps';

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
  searchCamps: (searchTerm: string) => Camp[];
}

// Create context
const CampContext = createContext<CampContextType | null>(null);

export const CampProvider = ({ children }: { children: ReactNode }) => {
  const [camps, setCamps] = useState<Camp[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { t } = useTranslation();

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
        title: t('toast.campCreated'),
        description: t('toast.campCreatedDescription', { name: newCamp.name }),
      });
    } catch (error) {
      console.error("Error creating camp:", error);
      toast({
        title: t('toast.error'),
        description: t('toast.createCampError'),
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
          title: t('toast.campUpdated'),
          description: t('toast.campUpdatedDescription'),
        });
      }
    } catch (error) {
      console.error("Error updating camp:", error);
      toast({
        title: t('toast.error'),
        description: t('toast.updateCampError'),
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
          title: t('toast.campDeleted'),
          description: t('toast.campDeletedDescription'),
        });
      }
    } catch (error) {
      console.error("Error deleting camp:", error);
      toast({
        title: t('toast.error'),
        description: t('toast.deleteCampError'),
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
          title: t('toast.alreadyRegistered'),
          description: t('toast.alreadyRegisteredDescription'),
          variant: "destructive",
        });
        return;
      }
      
      const newRegistration = await registerForCampProvider(userId, campId, dayAvailability);
      
      if (newRegistration) {
        setRegistrations(prev => [...prev, newRegistration]);
        
        toast({
          title: t('toast.registrationSuccessful'),
          description: t('toast.registrationSuccessfulDescription'),
        });
      }
    } catch (error) {
      console.error("Error registering for camp:", error);
      toast({
        title: t('toast.error'),
        description: t('toast.registerCampError'),
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
          title: t('toast.registrationUpdated'),
          description: t('toast.registrationUpdatedDescription'),
        });
      }
    } catch (error) {
      console.error("Error updating registration:", error);
      toast({
        title: t('toast.error'),
        description: t('toast.updateRegistrationError'),
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

  // Search camps by name, description, or location
  const searchCamps = (searchTerm: string): Camp[] => {
    if (!searchTerm.trim()) {
      return camps; // Return all camps if search term is empty
    }
    
    const term = searchTerm.toLowerCase().trim();
    return camps.filter(camp => 
      camp.name.toLowerCase().includes(term) || 
      camp.description.toLowerCase().includes(term) || 
      camp.location.toLowerCase().includes(term)
    );
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
      getRegistrationByCampAndUser,
      searchCamps
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
