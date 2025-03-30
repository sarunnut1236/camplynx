import { User } from '@/models/User';
import { UserRole, Region } from '@/enums/User';

// Mock users data
const mockUsers: User[] = [
  {
    id: '1',
    firstname: 'Jane',
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
    firstname: 'John',
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
  {
    id: '3',
    firstname: 'Emily',
    surname: 'Davis',
    email: 'emily@example.com',
    role: UserRole.JOINER,
  },
  {
    id: '4',
    firstname: 'Michael',
    surname: 'Brown',
    email: 'michael@example.com',
    role: UserRole.JOINER,
  },
  {
    id: '5',
    firstname: 'เขมิกา',
    surname: 'รัตน์แสง',
    nickname: 'เฟรม',
    email: 'frame@example.com',
    phone: '0641674440',
    role: UserRole.JOINER,
    region: Region.EAST,
    joinedAt: new Date(2023, 0, 1),
    profileImage: 'https://drive.google.com/open?id=1B6j7A4LFiTrWAudmmAo_fAvuEsu3xEdz',
    birthdate: new Date(2004, 10, 11),
    lineId: '0641674440',
    foodAllergy: '',
    personalMedicalCondition: '',
    title: 'Camp Participant',
    bio: 'Active camp member'
  },
];

// Get all users
export const getAllUsers = async (): Promise<User[]> => {
  // This is where you'd make an API call in the future
  // return await api.get('/users');
  return mockUsers;
};

// Get user by ID
export const getUserById = async (id: string): Promise<User | undefined> => {
  // This is where you'd make an API call in the future
  // return await api.get(`/users/${id}`);
  return mockUsers.find(user => user.id === id);
};

// Get user by email
export const getUserByEmail = async (email: string): Promise<User | undefined> => {
  // This is where you'd make an API call in the future
  // return await api.get(`/users?email=${email}`);
  return mockUsers.find(user => user.email === email);
};

// Update user
export const updateUser = async (id: string, userData: Partial<User>): Promise<User | undefined> => {
  // This is where you'd make an API call in the future
  // return await api.put(`/users/${id}`, userData);
  
  // For now, we'll just simulate the update in the mock data
  const userIndex = mockUsers.findIndex(user => user.id === id);
  if (userIndex === -1) {
    return undefined;
  }
  
  const updatedUser = { ...mockUsers[userIndex], ...userData } as User;
  mockUsers[userIndex] = updatedUser;
  
  return updatedUser;
};

// Create a default user (used for new registrations)
export const createDefaultUser = (firstname: string, email?: string): User => ({
  id: crypto.randomUUID(),
  firstname,
  ...(email ? { email } : {}),
  role: UserRole.GUEST,
}); 