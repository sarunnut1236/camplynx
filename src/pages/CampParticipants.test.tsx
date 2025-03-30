import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import CampParticipants from './CampParticipants';
import { UserRole } from '@/enums/User';
import { useAuth } from '@/contexts/AuthContext';
import { useCamp } from '@/contexts/CampContext';
import { Camp, Registration } from '@/models/Camp';

// Mock these modules
vi.mock('@/contexts/AuthContext');
vi.mock('@/contexts/CampContext');
vi.mock('@/providers/users');

// Mock useParams and useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: () => ({ id: '1' }),
    useNavigate: () => mockNavigate
  };
});

// Mock camp data
const mockCamp = {
  id: '1',
  name: 'Test Camp',
  description: 'Test Description',
  location: 'Test Location',
  startDate: new Date('2023-01-01'),
  endDate: new Date('2023-01-05'),
  imageUrl: '/camp.jpg',
  days: [
    {
      id: 'day1',
      dayNumber: 1,
      date: new Date('2023-01-01'),
      activities: ['Activity 1', 'Activity 2']
    },
    {
      id: 'day2',
      dayNumber: 2,
      date: new Date('2023-01-02'),
      activities: ['Activity 3']
    }
  ]
};

// Mock registration data
const mockRegistrations: Registration[] = [
  {
    id: 'reg1',
    userId: 'user1',
    campId: '1',
    dayAvailability: { day1: true, day2: false },
    registrationDate: new Date('2023-01-01')
  },
  {
    id: 'reg2',
    userId: 'user2',
    campId: '1',
    dayAvailability: { day1: true, day2: true },
    registrationDate: new Date('2023-01-02')
  }
];

// Mock users data
const mockUsers = [
  {
    id: 'user1',
    firstname: 'John',
    surname: 'Doe',
    email: 'john@example.com',
    role: UserRole.ADMIN
  },
  {
    id: 'user2',
    firstname: 'Jane',
    surname: 'Smith',
    email: 'jane@example.com',
    role: UserRole.JOINER
  }
];

// Mock getUserById function
vi.mock('@/providers/users', () => ({
  getUserById: (id: string) => {
    return Promise.resolve(mockUsers.find(user => user.id === id));
  }
}));

beforeEach(() => {
  // Default mock for useAuth
  vi.mocked(useAuth).mockReturnValue({
    user: {
      id: 'admin1',
      firstname: 'Admin',
      role: UserRole.ADMIN
    },
    hasPermission: (role: UserRole) => role === UserRole.ADMIN,
    isAuthenticated: true,
    login: vi.fn(),
    logout: vi.fn(),
    updateUser: vi.fn()
  });

  // Default mock for useCamp
  vi.mocked(useCamp).mockReturnValue({
      getCampById: (id: string) => id === '1' ? mockCamp : undefined,
      registrations: mockRegistrations,
      camps: [],
      createCamp: vi.fn(),
      updateCamp: vi.fn(),
      deleteCamp: vi.fn(),
      registerForCamp: vi.fn(),
      updateRegistration: vi.fn(),
      getUserRegistrations: vi.fn(),
      getRegistrationById: vi.fn(),
      getRegistrationByCampAndUser: vi.fn(),
      searchCamps: function (searchTerm: string): Camp[] {
          throw new Error('Function not implemented.');
      }
  });
});

// Mock Translations
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'camps.participants': 'Participants',
        'camps.totalParticipants': 'Total Participants',
        'camps.noParticipants': 'No Participants',
        'camps.noParticipantsDescription': 'This camp has no participants yet',
        'camps.registeredOn': 'Registered on',
        'camps.days': 'days',
        'camps.day': 'day',
        'camps.availability': 'availability',
        'camps.dayAvailability': 'Day Availability',
        'common.back': 'Back',
        'common.loading': 'Loading...'
      };
      return translations[key] || key;
    }
  })
}));

describe('CampParticipants Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the participants list', async () => {
    render(
      <MemoryRouter>
        <CampParticipants />
      </MemoryRouter>
    );
    
    await waitFor(() => {
      expect(screen.getByText('Participants')).toBeInTheDocument();
      expect(screen.getByText('Test Camp')).toBeInTheDocument();
      
      // Check for total participants
      expect(screen.getByText('Total Participants: 2')).toBeInTheDocument();
      
      // Check for participant names
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      
      // Check for participant emails
      expect(screen.getByText('john@example.com')).toBeInTheDocument();
      expect(screen.getByText('jane@example.com')).toBeInTheDocument();
    });
  });

  it('redirects when user does not have admin permission', async () => {
    // Override the mock for this test
    vi.mocked(useAuth).mockReturnValueOnce({
      user: {
        id: 'user1',
        firstname: 'John',
        role: UserRole.JOINER
      },
      hasPermission: () => false,
      isAuthenticated: true,
      login: vi.fn(),
      logout: vi.fn(),
      updateUser: vi.fn()
    });
    
    render(
      <MemoryRouter>
        <CampParticipants />
      </MemoryRouter>
    );
    
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/unauthorized');
    });
  });

  it('redirects when camp does not exist', async () => {
    // Override the mock for this test
    vi.mocked(useCamp).mockReturnValueOnce({
        getCampById: () => undefined,
        registrations: mockRegistrations,
        camps: [],
        createCamp: vi.fn(),
        updateCamp: vi.fn(),
        deleteCamp: vi.fn(),
        registerForCamp: vi.fn(),
        updateRegistration: vi.fn(),
        getUserRegistrations: vi.fn(),
        getRegistrationById: vi.fn(),
        getRegistrationByCampAndUser: vi.fn(),
        searchCamps: function (searchTerm: string): Camp[] {
            throw new Error('Function not implemented.');
        }
    });
    
    render(
      <MemoryRouter>
        <CampParticipants />
      </MemoryRouter>
    );
    
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/camps');
    });
  });

  it('displays availability percentages correctly', async () => {
    render(
      <MemoryRouter>
        <CampParticipants />
      </MemoryRouter>
    );
    
    await waitFor(() => {
      // Jane has 100% availability (2/2 days)
      expect(screen.getByText('100% availability')).toBeInTheDocument();
      expect(screen.getByText('2 / 2 days')).toBeInTheDocument();
      
      // John has 50% availability (1/2 days)
      expect(screen.getByText('50% availability')).toBeInTheDocument();
      expect(screen.getByText('1 / 2 days')).toBeInTheDocument();
    });
  });

  it('displays day availability correctly', async () => {
    render(
      <MemoryRouter>
        <CampParticipants />
      </MemoryRouter>
    );
    
    await waitFor(() => {
      // There should be several "Day 1" and "Day 2" elements 
      // (once in the schedule summary and once for each participant)
      const day1Elements = screen.getAllByText('Day 1');
      const day2Elements = screen.getAllByText('Day 2');
      
      expect(day1Elements.length).toBeGreaterThan(0);
      expect(day2Elements.length).toBeGreaterThan(0);
    });
  });

  it('navigates back to camp details when back button is clicked', async () => {
    const user = userEvent.setup();
    
    render(
      <MemoryRouter>
        <CampParticipants />
      </MemoryRouter>
    );
    
    await waitFor(() => {
      expect(screen.getByText('Participants')).toBeInTheDocument();
    });
    
    // Get all buttons and find the one in the footer
    const buttons = screen.getAllByRole('button');
    const backButton = buttons.find(button => 
      button.textContent === 'Back' && !button.hasAttribute('aria-label')
    );
    
    // Check if we found the button
    expect(backButton).toBeInTheDocument();
    
    // Click the back button
    if (backButton) {
      await user.click(backButton);
    }
    
    // Check if navigation happened
    expect(mockNavigate).toHaveBeenCalledWith('/camps/1');
  });

  it('displays "No Participants" message when there are no registrations', async () => {
    // Override the mock for this test
    vi.mocked(useCamp).mockReturnValueOnce({
        getCampById: () => mockCamp,
        registrations: [], // Empty registrations
        camps: [],
        createCamp: vi.fn(),
        updateCamp: vi.fn(),
        deleteCamp: vi.fn(),
        registerForCamp: vi.fn(),
        updateRegistration: vi.fn(),
        getUserRegistrations: vi.fn(),
        getRegistrationById: vi.fn(),
        getRegistrationByCampAndUser: vi.fn(),
        searchCamps: function (searchTerm: string): Camp[] {
            throw new Error('Function not implemented.');
        }
    });
    
    render(
      <MemoryRouter>
        <CampParticipants />
      </MemoryRouter>
    );
    
    await waitFor(() => {
      expect(screen.getByText('No Participants')).toBeInTheDocument();
      expect(screen.getByText('This camp has no participants yet')).toBeInTheDocument();
    });
  });
}); 