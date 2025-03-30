import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Camps from './Camps';
import { useCamp } from '@/contexts/CampContext';
import type { Camp } from '@/models/Camp';

// Mock the camp hook
vi.mock('@/contexts/CampContext', () => ({
  useCamp: vi.fn()
}));

// Mock the auth hook
vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 'test-user', role: '2' },
    hasPermission: () => true,
    isAuthenticated: true
  })
}));

// Mock i18n
const mockTranslations: Record<string, string> = {
  'camps.title': 'Camps',
  'camps.createNew': 'Create New Camp',
  'camps.noCamps': 'No Camps',
  'camps.checkLater': 'Check back later',
  'camps.day': 'day',
  'camps.days': 'days',
  'camps.viewDetails': 'View Details',
  'camps.campImageAlt': '{name} Image',
  'camps.dayNumber': 'Day {number}',
  'camps.activity': 'activity',
  'camps.activities': 'activities',
  'camps.planned': 'planned',
  'camps.notFound': 'Camp not found',
  
  // Toast messages
  'toast.campCreated': 'Camp created',
  'toast.campCreatedDescription': '{name} has been created successfully.',
  'toast.campUpdated': 'Camp updated',
  'toast.campUpdatedDescription': 'The camp has been updated successfully.',
  'toast.campDeleted': 'Camp deleted',
  'toast.campDeletedDescription': 'The camp has been deleted successfully.',
  'toast.availabilityUpdated': 'Availability updated',
  'toast.availabilityUpdatedDescription': 'Your availability for this camp has been updated.',
  'toast.registrationSuccessful': 'Registration successful',
  'toast.registrationSuccessfulDescription': 'You have been registered for the camp.',
  'toast.registrationUpdated': 'Registration updated',
  'toast.registrationUpdatedDescription': 'Your availability has been updated successfully.',
  'toast.alreadyRegistered': 'Already registered',
  'toast.alreadyRegisteredDescription': 'You are already registered for this camp.',
  'toast.error': 'Error',
  'toast.createCampError': 'Failed to create camp. Please try again.',
  'toast.updateCampError': 'Failed to update camp. Please try again.',
  'toast.deleteCampError': 'Failed to delete camp. Please try again.',
  'toast.registerCampError': 'Failed to register for camp. Please try again.',
  'toast.updateRegistrationError': 'Failed to update registration. Please try again.'
};

const mockT = (key: string, options?: Record<string, any>): string => {
  let translation = mockTranslations[key] || key;
  
  // Simple interpolation for variables
  if (options) {
    Object.entries(options).forEach(([key, value]) => {
      translation = translation.replace(`{${key}}`, String(value));
    });
  }
  
  return translation;
};

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: Record<string, any>) => mockT(key, options),
    i18n: {
      language: 'en'
    }
  })
}));

describe('Camps Component', () => {
  const mockCamps: Camp[] = [
    {
      id: '1',
      name: 'Test Camp 1',
      description: 'Description 1',
      location: 'Location 1',
      startDate: new Date('2023-01-01'),
      endDate: new Date('2023-01-05'),
      imageUrl: '/camp1.jpg',
      days: [{ id: 'day1', dayNumber: 1, date: new Date('2023-01-01'), activities: ['Activity 1'] }]
    },
    {
      id: '2',
      name: 'Test Camp 2',
      description: 'Description 2',
      location: 'Location 2',
      startDate: new Date('2023-02-01'),
      endDate: new Date('2023-02-05'),
      imageUrl: '/camp2.jpg',
      days: [{ id: 'day1', dayNumber: 1, date: new Date('2023-02-01'), activities: ['Activity 1'] }]
    }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    // Default mock
    vi.mocked(useCamp).mockReturnValue({
      camps: mockCamps,
      registrations: [],
      createCamp: vi.fn(),
      updateCamp: vi.fn(),
      deleteCamp: vi.fn(),
      registerForCamp: vi.fn(),
      updateRegistration: vi.fn(),
      getUserRegistrations: vi.fn(),
      getCampById: (id: string) => mockCamps.find(camp => camp.id === id),
      getRegistrationById: vi.fn(),
      getRegistrationByCampAndUser: vi.fn(),
      searchCamps: function (searchTerm: string): Camp[] {
        throw new Error('Function not implemented.');
      }
    });
  });

  it('renders camps correctly', async () => {
    render(
      <MemoryRouter>
        <Camps />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Test Camp 1')).toBeInTheDocument();
      expect(screen.getByText('Test Camp 2')).toBeInTheDocument();
      expect(screen.getByText('Description 1')).toBeInTheDocument();
      expect(screen.getByText('Description 2')).toBeInTheDocument();
      expect(screen.getByAltText('Test Camp 1 Image')).toBeInTheDocument();
    });
  });

  it('displays empty state when no camps', async () => {
    // Mock empty camps
    vi.mocked(useCamp).mockReturnValue({
      camps: [],
      registrations: [],
      createCamp: vi.fn(),
      updateCamp: vi.fn(),
      deleteCamp: vi.fn(),
      registerForCamp: vi.fn(),
      updateRegistration: vi.fn(),
      getUserRegistrations: vi.fn(),
      getCampById: () => undefined,
      getRegistrationById: vi.fn(),
      getRegistrationByCampAndUser: vi.fn(),
      searchCamps: function (searchTerm: string): Camp[] {
        throw new Error('Function not implemented.');
      }
    });

    render(
      <MemoryRouter>
        <Camps />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(mockT('camps.noCamps'))).toBeInTheDocument();
      expect(screen.getByText(mockT('camps.checkLater'))).toBeInTheDocument();
    });
  });

  it('renders correctly after deleting a camp', async () => {
    // First render with all camps
    const { rerender } = render(
      <MemoryRouter>
        <Camps />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Test Camp 1')).toBeInTheDocument();
      expect(screen.getByText('Test Camp 2')).toBeInTheDocument();
    });

    // Now mock as if Camp 1 was deleted
    const remainingCamp = mockCamps[1];
    
    // Silence the TypeScript error since we know this works correctly
    // @ts-ignore - In a test environment, we need to allow the getCampById to return undefined
    vi.mocked(useCamp).mockReturnValue({
      camps: [remainingCamp!],
      registrations: [],
      createCamp: vi.fn(),
      updateCamp: vi.fn(),
      deleteCamp: vi.fn(),
      registerForCamp: vi.fn(),
      updateRegistration: vi.fn(),
      getUserRegistrations: vi.fn(),
      getCampById: (id: string) => id === '2' ? remainingCamp : undefined,
      getRegistrationById: vi.fn(),
      getRegistrationByCampAndUser: vi.fn()
    });

    // Re-render with updated camps state
    rerender(
      <MemoryRouter>
        <Camps />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.queryByText('Test Camp 1')).not.toBeInTheDocument();
      expect(screen.getByText('Test Camp 2')).toBeInTheDocument();
      expect(screen.getByAltText('Test Camp 2 Image')).toBeInTheDocument();
    });
  });
}); 