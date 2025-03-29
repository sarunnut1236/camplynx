import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import CampDetail from './CampDetail';
import userEvent from '@testing-library/user-event';

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
  startDate: '2023-01-01',
  endDate: '2023-01-05',
  location: 'Test Location',
  theme: 'Test Theme',
  capacity: 50,
  imageUrl: '/camp.jpg',
  days: [
    {
      id: 'day1',
      dayNumber: 1,
      date: '2023-01-01',
      activities: ['Activity 1', 'Activity 2']
    },
    {
      id: 'day2',
      dayNumber: 2,
      date: '2023-01-02',
      activities: ['Activity 3']
    }
  ]
};

// Mock registration data
const mockRegistration = {
  id: 'reg1',
  userId: 'user1',
  campId: '1',
  dayAvailability: { day1: true, day2: false },
  registrationDate: '2023-01-01'
};

// Mock useCamp hook
const mockUpdateRegistration = vi.fn().mockImplementation(() => ({ success: true }));
const mockRegisterForCamp = vi.fn().mockImplementation(() => ({ success: true }));

vi.mock('@/contexts/CampContext', () => ({
  useCamp: () => ({
    getCampById: (id: string) => id === '1' ? mockCamp : undefined,
    getRegistrationByCampAndUser: (campId: string, userId: string) => 
      campId === '1' && userId === 'user1' ? mockRegistration : undefined,
    registerForCamp: mockRegisterForCamp,
    updateRegistration: mockUpdateRegistration
  })
}));

// Mock useAuth hook
vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: {
      id: 'user1',
      firstname: 'John',
      surname: 'Doe',
      role: 'admin'
    }
  })
}));

// Mock toast
vi.mock('@/components/ui/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn()
  })
}));

// Mock Translations
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'camps.schedule': 'Schedule',
        'camps.registration': 'Registration',
        'camps.selectDays': 'Select Days',
        'camps.importantInfo': 'Important Information',
        'camps.attendanceNote': 'Please ensure you can attend the days you select',
        'camps.updateAvailability': 'Update Availability',
        'camps.registerForCamp': 'Register for Camp',
        'camps.registeredMessage': 'You are registered for this camp'
      };
      return translations[key] || key;
    },
    i18n: {
      language: 'en'
    }
  })
}));

describe('CampDetail Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders camp information correctly', async () => {
    render(
      <MemoryRouter>
        <CampDetail />
      </MemoryRouter>
    );
    
    await waitFor(() => {
      expect(screen.getByText('Test Description')).toBeInTheDocument();
      expect(screen.getByText('Test Location')).toBeInTheDocument();
    });
  });

  it('shows schedule tab with camp days', async () => {
    render(
      <MemoryRouter>
        <CampDetail />
      </MemoryRouter>
    );
    
    // Find and click the Schedule tab
    await waitFor(() => {
      const scheduleTab = screen.getByRole('tab', { name: /schedule/i });
      fireEvent.click(scheduleTab);
    });
    
    // Check day names and activities are displayed
    await waitFor(() => {
      expect(screen.getByText(/Day 1:/i)).toBeInTheDocument();
      expect(screen.getByText(/Day 2:/i)).toBeInTheDocument();
      expect(screen.getByText('Activity 1')).toBeInTheDocument();
      expect(screen.getByText('Activity 2')).toBeInTheDocument();
      expect(screen.getByText('Activity 3')).toBeInTheDocument();
    });
  });

  it('shows registration tab with day selection', async () => {
    const user = userEvent.setup();
    
    render(
      <MemoryRouter>
        <CampDetail />
      </MemoryRouter>
    );
    
    // Wait for the component to be fully rendered
    await waitFor(() => {
      expect(screen.getByText('Test Description')).toBeInTheDocument();
    });
    
    // Find and click the Registration tab
    const regTab = screen.getByRole('tab', { name: /registration/i });
    await user.click(regTab);
    
    // Check for the Day 1 and Day 2 labels in the registration tab
    await waitFor(() => {
      expect(screen.getAllByText(/Day \d:/i).length).toBeGreaterThan(1);
      // Look for checkboxes which should be in the registration tab
      const checkboxes = screen.getAllByRole('checkbox');
      expect(checkboxes.length).toBeGreaterThan(0);
    });
  });

  it('shows update button for registered users', async () => {
    const user = userEvent.setup();
    
    render(
      <MemoryRouter>
        <CampDetail />
      </MemoryRouter>
    );
    
    // Wait for the component to be fully rendered
    await waitFor(() => {
      expect(screen.getByText('Test Description')).toBeInTheDocument();
    });
    
    // Find and click the Registration tab
    const regTab = screen.getByRole('tab', { name: /registration/i });
    await user.click(regTab);
    
    // Wait for the registration tab content to load - look for checkboxes
    await waitFor(() => {
      const checkboxes = screen.getAllByRole('checkbox');
      expect(checkboxes.length).toBeGreaterThan(0);
    });
    
    // Now check for the update button and registered message
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /update availability/i })).toBeInTheDocument();
      expect(screen.getByText('You are registered for this camp')).toBeInTheDocument();
    });
  });

  it('calls updateRegistration when clicking update button', async () => {
    const user = userEvent.setup();
    
    render(
      <MemoryRouter>
        <CampDetail />
      </MemoryRouter>
    );
    
    // Wait for the component to be fully rendered
    await waitFor(() => {
      expect(screen.getByText('Test Description')).toBeInTheDocument();
    });
    
    // Find and click the Registration tab
    const regTab = screen.getByRole('tab', { name: /registration/i });
    await user.click(regTab);
    
    // Wait for the registration tab content to load - look for checkboxes
    await waitFor(() => {
      const checkboxes = screen.getAllByRole('checkbox');
      expect(checkboxes.length).toBeGreaterThan(0);
    });
    
    // Find and click the update button
    const updateButton = await screen.findByRole('button', { name: /update availability/i });
    await user.click(updateButton);
    
    // Verify the updateRegistration function was called
    await waitFor(() => {
      expect(mockUpdateRegistration).toHaveBeenCalledWith('reg1', { day1: true, day2: false });
    });
  });
}); 