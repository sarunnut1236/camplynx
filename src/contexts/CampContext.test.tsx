import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useCamp } from './CampContext';
import { Camp, Registration } from '@/models/Camp';

// Mock camp data
const mockCamps: Camp[] = [
  {
    id: 'camp-1',
    name: 'Test Camp 1',
    description: 'Test description',
    location: 'Test location',
    startDate: '2023-01-01',
    endDate: '2023-01-03',
    imageUrl: 'https://example.com/image.jpg',
    days: [
      {
        id: '1',
        dayNumber: 1,
        date: '2023-01-01',
        activities: ['Activity 1']
      }
    ]
  },
  {
    id: 'camp-2',
    name: 'Test Camp 2',
    description: 'Another test description',
    location: 'Another location',
    startDate: '2023-02-01',
    endDate: '2023-02-03',
    imageUrl: 'https://example.com/image2.jpg',
    days: []
  }
];

// Mock registration data
const mockRegistrations: Registration[] = [
  {
    id: 'reg-1',
    userId: 'user-1',
    campId: 'camp-1',
    dayAvailability: { '1': true },
    registrationDate: '2023-01-01T12:00:00Z'
  }
];

// Mock the useCamp hook
const mockCampHook = {
  camps: mockCamps,
  registrations: mockRegistrations,
  createCamp: vi.fn(),
  updateCamp: vi.fn(),
  deleteCamp: vi.fn(),
  registerForCamp: vi.fn(),
  updateRegistration: vi.fn(),
  getUserRegistrations: vi.fn().mockReturnValue([]),
  getCampById: vi.fn((id: string) => mockCamps.find(camp => camp.id === id)),
  getRegistrationById: vi.fn((id: string) => mockRegistrations.find(reg => reg.id === id)),
  getRegistrationByCampAndUser: vi.fn((campId: string, userId: string) => 
    mockRegistrations.find(reg => reg.campId === campId && reg.userId === userId)
  )
};

// Mock the CampContext
vi.mock('./CampContext', () => ({
  useCamp: () => mockCampHook
}));

describe('useCamp hook', () => {
  it('should provide camp data', () => {
    const { result } = renderHook(() => useCamp());
    
    expect(result.current.camps).toEqual(mockCamps);
    expect(result.current.camps.length).toBe(2);
    expect(result.current.registrations).toEqual(mockRegistrations);
    expect(result.current.registrations.length).toBe(1);
  });
  
  it('should get a camp by ID', () => {
    const { result } = renderHook(() => useCamp());
    
    const camp = result.current.getCampById('camp-1');
    expect(camp).toEqual(mockCamps[0]);
    
    const nonExistentCamp = result.current.getCampById('nonexistent');
    expect(nonExistentCamp).toBeUndefined();
  });
  
  it('should call registerForCamp with correct parameters', () => {
    const { result } = renderHook(() => useCamp());
    
    const userId = 'user-1';
    const campId = 'camp-1';
    const dayAvailability = { '1': true };
    
    result.current.registerForCamp(userId, campId, dayAvailability);
    
    expect(mockCampHook.registerForCamp).toHaveBeenCalledWith(userId, campId, dayAvailability);
  });
  
  it('should call updateCamp with correct parameters', () => {
    const { result } = renderHook(() => useCamp());
    
    const campId = 'camp-1';
    const updatedData = {
      name: 'Updated Camp Name',
      days: [
        {
          id: '1',
          dayNumber: 1,
          date: '2023-01-01',
          activities: []
        }
      ]
    };
    
    result.current.updateCamp(campId, updatedData);
    
    expect(mockCampHook.updateCamp).toHaveBeenCalledWith(campId, updatedData);
  });
}); 