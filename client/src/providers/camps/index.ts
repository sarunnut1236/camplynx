import { Camp, Registration } from '@/models';

// Mock camps data
const mockCamps: Camp[] = [
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

// Mock registrations data (initially empty)
const mockRegistrations: Registration[] = [];

// Get all camps
export const getAllCamps = async (): Promise<Camp[]> => {
  // This is where you'd make an API call in the future
  // return await api.get('/camps');
  
  // Try to get from localStorage first
  try {
    const savedCamps = localStorage.getItem('yns_camps');
    if (savedCamps) {
      return JSON.parse(savedCamps);
    }
  } catch (error) {
    console.error("Error loading camps from localStorage:", error);
  }
  
  // If not in localStorage, return mock data
  return mockCamps;
};

// Get camp by ID
export const getCampById = async (id: string): Promise<Camp | undefined> => {
  // This is where you'd make an API call in the future
  // return await api.get(`/camps/${id}`);
  
  const camps = await getAllCamps();
  return camps.find(camp => camp.id === id);
};

// Create a new camp
export const createCamp = async (campData: Omit<Camp, 'id'>): Promise<Camp> => {
  // This is where you'd make an API call in the future
  // return await api.post('/camps', campData);
  
  const newCamp: Camp = {
    ...campData,
    id: `camp-${Date.now()}`
  };
  
  const camps = await getAllCamps();
  const updatedCamps = [...camps, newCamp];
  
  // Save to localStorage
  try {
    localStorage.setItem('yns_camps', JSON.stringify(updatedCamps));
  } catch (error) {
    console.error("Error saving camps to localStorage:", error);
  }
  
  return newCamp;
};

// Update an existing camp
export const updateCamp = async (id: string, campData: Partial<Camp>): Promise<Camp | undefined> => {
  // This is where you'd make an API call in the future
  // return await api.put(`/camps/${id}`, campData);
  
  const camps = await getAllCamps();
  const campIndex = camps.findIndex(camp => camp.id === id);
  
  if (campIndex === -1) {
    return undefined;
  }
  
  const updatedCamp = { ...camps[campIndex], ...campData } as Camp;
  camps[campIndex] = updatedCamp;
  
  // Save to localStorage
  try {
    localStorage.setItem('yns_camps', JSON.stringify(camps));
  } catch (error) {
    console.error("Error saving camps to localStorage:", error);
  }
  
  return updatedCamp;
};

// Delete a camp
export const deleteCamp = async (id: string): Promise<boolean> => {
  // This is where you'd make an API call in the future
  // return await api.delete(`/camps/${id}`);
  
  const camps = await getAllCamps();
  const updatedCamps = camps.filter(camp => camp.id !== id);
  
  // Save to localStorage
  try {
    localStorage.setItem('yns_camps', JSON.stringify(updatedCamps));
  } catch (error) {
    console.error("Error saving camps to localStorage:", error);
    return false;
  }
  
  // Also delete any registrations for this camp
  const registrations = await getAllRegistrations();
  const updatedRegistrations = registrations.filter(reg => reg.campId !== id);
  
  try {
    localStorage.setItem('yns_registrations', JSON.stringify(updatedRegistrations));
  } catch (error) {
    console.error("Error saving registrations to localStorage:", error);
  }
  
  return true;
};

// Get all registrations
export const getAllRegistrations = async (): Promise<Registration[]> => {
  // This is where you'd make an API call in the future
  // return await api.get('/registrations');
  
  // Try to get from localStorage first
  try {
    const savedRegistrations = localStorage.getItem('yns_registrations');
    if (savedRegistrations) {
      return JSON.parse(savedRegistrations);
    }
  } catch (error) {
    console.error("Error loading registrations from localStorage:", error);
  }
  
  return mockRegistrations;
};

// Get registrations by user ID
export const getUserRegistrations = async (userId: string): Promise<Registration[]> => {
  // This is where you'd make an API call in the future
  // return await api.get(`/registrations?userId=${userId}`);
  
  const registrations = await getAllRegistrations();
  return registrations.filter(reg => reg.userId === userId);
};

// Get registration by ID
export const getRegistrationById = async (id: string): Promise<Registration | undefined> => {
  // This is where you'd make an API call in the future
  // return await api.get(`/registrations/${id}`);
  
  const registrations = await getAllRegistrations();
  return registrations.find(reg => reg.id === id);
};

// Get registration by camp and user
export const getRegistrationByCampAndUser = async (campId: string, userId: string): Promise<Registration | undefined> => {
  // This is where you'd make an API call in the future
  // return await api.get(`/registrations?campId=${campId}&userId=${userId}`);
  
  const registrations = await getAllRegistrations();
  return registrations.find(reg => reg.campId === campId && reg.userId === userId);
};

// Register for a camp
export const registerForCamp = async (
  userId: string, 
  campId: string, 
  dayAvailability: { [dayId: string]: boolean }
): Promise<Registration | undefined> => {
  // This is where you'd make an API call in the future
  // return await api.post('/registrations', { userId, campId, dayAvailability });
  
  // Check if already registered
  const existingReg = await getRegistrationByCampAndUser(campId, userId);
  
  if (existingReg) {
    return undefined; // Already registered
  }
  
  const newRegistration: Registration = {
    id: `reg-${Date.now()}`,
    userId,
    campId,
    dayAvailability,
    registrationDate: new Date().toISOString(),
  };
  
  const registrations = await getAllRegistrations();
  const updatedRegistrations = [...registrations, newRegistration];
  
  // Save to localStorage
  try {
    localStorage.setItem('yns_registrations', JSON.stringify(updatedRegistrations));
  } catch (error) {
    console.error("Error saving registrations to localStorage:", error);
    return undefined;
  }
  
  return newRegistration;
};

// Update registration
export const updateRegistration = async (
  id: string, 
  dayAvailability: { [dayId: string]: boolean }
): Promise<Registration | undefined> => {
  // This is where you'd make an API call in the future
  // return await api.put(`/registrations/${id}`, { dayAvailability });
  
  const registrations = await getAllRegistrations();
  const regIndex = registrations.findIndex(reg => reg.id === id);
  
  if (regIndex === -1) {
    return undefined;
  }
  
  const updatedReg = { ...registrations[regIndex], dayAvailability } as Registration;
  registrations[regIndex] = updatedReg;
  
  // Save to localStorage
  try {
    localStorage.setItem('yns_registrations', JSON.stringify(registrations));
  } catch (error) {
    console.error("Error saving registrations to localStorage:", error);
    return undefined;
  }
  
  return updatedReg;
}; 