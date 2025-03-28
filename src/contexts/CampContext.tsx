
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';

// Define camp day interface
export interface CampDay {
  id: string;
  dayNumber: number;
  date: string;
  activities: string[];
}

// Define camp interface
export interface Camp {
  id: string;
  name: string;
  description: string;
  location: string;
  startDate: string;
  endDate: string;
  imageUrl: string;
  days: CampDay[];
}

// Define registration interface
export interface Registration {
  id: string;
  userId: string;
  campId: string;
  dayAvailability: { [dayId: string]: boolean };
  registrationDate: string;
}

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

// Mock data for camps
const initialCamps: Camp[] = [
  {
    id: '1',
    name: 'Camp Happy New Year 2024',
    description: 'Celebrate the new year with outdoor activities and fun!',
    location: 'Pine Forest Retreat',
    startDate: '2024-01-01',
    endDate: '2024-01-03',
    imageUrl: 'https://images.unsplash.com/photo-1496080174650-637e3f22fa03?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    days: [
      {
        id: 'd1',
        dayNumber: 1,
        date: '2024-01-01',
        activities: ['Welcome Breakfast', 'Campfire Games']
      },
      {
        id: 'd2',
        dayNumber: 2,
        date: '2024-01-02',
        activities: ['Sunrise Hike', 'Swimming']
      },
      {
        id: 'd3',
        dayNumber: 3,
        date: '2024-01-03',
        activities: ['Nature Walk', 'Farewell Lunch']
      }
    ]
  },
  {
    id: '2',
    name: 'Summer Adventure Camp',
    description: 'Explore nature and learn outdoor survival skills',
    location: 'Mountain Valley',
    startDate: '2024-06-15',
    endDate: '2024-06-17',
    imageUrl: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    days: [
      {
        id: 'd4',
        dayNumber: 1,
        date: '2024-06-15',
        activities: ['Campfire Games', 'Night Sky Observation']
      },
      {
        id: 'd5',
        dayNumber: 2,
        date: '2024-06-16',
        activities: ['Arts and Crafts', 'Swimming']
      },
      {
        id: 'd6',
        dayNumber: 3,
        date: '2024-06-17',
        activities: ['Nature Hike', 'Survival Skills Workshop']
      }
    ]
  }
];

// Initial registrations (empty)
const initialRegistrations: Registration[] = [];

// Create context
const CampContext = createContext<CampContextType | null>(null);

export const CampProvider = ({ children }: { children: ReactNode }) => {
  const [camps, setCamps] = useState<Camp[]>(initialCamps);
  const [registrations, setRegistrations] = useState<Registration[]>(initialRegistrations);
  const { toast } = useToast();

  // Load saved data on mount
  useEffect(() => {
    const savedCamps = localStorage.getItem('camplynx_camps');
    const savedRegistrations = localStorage.getItem('camplynx_registrations');

    if (savedCamps) {
      setCamps(JSON.parse(savedCamps));
    } else {
      localStorage.setItem('camplynx_camps', JSON.stringify(initialCamps));
    }

    if (savedRegistrations) {
      setRegistrations(JSON.parse(savedRegistrations));
    }
  }, []);

  // Save data on change
  useEffect(() => {
    localStorage.setItem('camplynx_camps', JSON.stringify(camps));
  }, [camps]);

  useEffect(() => {
    localStorage.setItem('camplynx_registrations', JSON.stringify(registrations));
  }, [registrations]);

  // Create a new camp
  const createCamp = (campData: Omit<Camp, 'id'>) => {
    const newCamp = {
      ...campData,
      id: `camp-${Date.now()}`
    };
    
    setCamps([...camps, newCamp]);
    
    toast({
      title: "Camp created",
      description: `${newCamp.name} has been created successfully.`,
    });
  };

  // Update an existing camp
  const updateCamp = (id: string, campData: Partial<Camp>) => {
    setCamps(camps.map(camp => 
      camp.id === id ? { ...camp, ...campData } : camp
    ));
    
    toast({
      title: "Camp updated",
      description: "The camp has been updated successfully.",
    });
  };

  // Delete a camp
  const deleteCamp = (id: string) => {
    setCamps(camps.filter(camp => camp.id !== id));
    // Also delete any registrations for this camp
    setRegistrations(registrations.filter(reg => reg.campId !== id));
    
    toast({
      title: "Camp deleted",
      description: "The camp has been deleted successfully.",
    });
  };

  // Register for a camp
  const registerForCamp = (userId: string, campId: string, dayAvailability: { [dayId: string]: boolean }) => {
    // Check if already registered
    const existingReg = registrations.find(r => r.userId === userId && r.campId === campId);
    
    if (existingReg) {
      toast({
        title: "Already registered",
        description: "You are already registered for this camp.",
        variant: "destructive",
      });
      return;
    }
    
    const newRegistration: Registration = {
      id: `reg-${Date.now()}`,
      userId,
      campId,
      dayAvailability,
      registrationDate: new Date().toISOString(),
    };
    
    setRegistrations([...registrations, newRegistration]);
    
    toast({
      title: "Registration successful",
      description: "You have been registered for the camp.",
    });
  };

  // Update registration
  const updateRegistration = (id: string, dayAvailability: { [dayId: string]: boolean }) => {
    setRegistrations(registrations.map(reg => 
      reg.id === id ? { ...reg, dayAvailability } : reg
    ));
    
    toast({
      title: "Registration updated",
      description: "Your availability has been updated successfully.",
    });
  };

  // Get user registrations
  const getUserRegistrations = (userId: string) => {
    return registrations.filter(reg => reg.userId === userId);
  };

  // Get camp by ID
  const getCampById = (id: string) => {
    return camps.find(camp => camp.id === id);
  };

  // Get registration by ID
  const getRegistrationById = (id: string) => {
    return registrations.find(reg => reg.id === id);
  };

  // Get registration by camp and user
  const getRegistrationByCampAndUser = (campId: string, userId: string) => {
    return registrations.find(reg => reg.campId === campId && reg.userId === userId);
  };

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
