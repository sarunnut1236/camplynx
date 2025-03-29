import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '../test/test-utils';
import Camps from './Camps';
import { UserRole } from '@/enums/User';

// Mock data
const mockCamps = [
  {
    id: 'camp-1',
    name: 'Test Camp 1',
    description: 'Camp description 1',
    location: 'Bangkok',
    startDate: '2023-07-01',
    endDate: '2023-07-03',
    imageUrl: '/image1.jpg',
    days: [{ id: 'day-1', dayNumber: 1, date: '2023-07-01', activities: [] }]
  },
  {
    id: 'camp-2',
    name: 'Test Camp 2',
    description: 'Camp description 2',
    location: 'Chiang Mai',
    startDate: '2023-08-10',
    endDate: '2023-08-15',
    imageUrl: '/image2.jpg',
    days: [
      { id: 'day-1', dayNumber: 1, date: '2023-08-10', activities: [] },
      { id: 'day-2', dayNumber: 2, date: '2023-08-11', activities: [] }
    ]
  }
];

// Mock useCamp
vi.mock('@/contexts/CampContext', () => ({
  useCamp: () => ({
    camps: mockCamps
  })
}));

// Create mock function for useAuth
const useAuthMock = vi.fn().mockReturnValue({
  user: { id: '1', firstname: 'Test User', role: UserRole.JOINER },
  hasPermission: (role: UserRole) => role === UserRole.JOINER
});

// Mock useAuth
vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => useAuthMock()
}));

// Mock translation
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'camps.title': 'Camps',
        'camps.createNew': 'Create New Camp',
        'camps.noCamps': 'No camps available',
        'camps.checkLater': 'Check back later',
        'camps.day': 'Day',
        'camps.days': 'Days',
        'camps.viewDetails': 'View Details'
      };
      return translations[key] || key;
    },
    i18n: {
      language: 'en'
    }
  })
}));

describe('Camps Page', () => {
  it('renders the camps page title', () => {
    render(<Camps />);
    expect(screen.getByText('Camps')).toBeInTheDocument();
  });

  it('displays the list of camps', () => {
    render(<Camps />);
    expect(screen.getByText('Test Camp 1')).toBeInTheDocument();
    expect(screen.getByText('Test Camp 2')).toBeInTheDocument();
    expect(screen.getByText('Camp description 1')).toBeInTheDocument();
    expect(screen.getByText('Camp description 2')).toBeInTheDocument();
  });

  it('shows locations for each camp', () => {
    render(<Camps />);
    expect(screen.getByText('Bangkok')).toBeInTheDocument();
    expect(screen.getByText('Chiang Mai')).toBeInTheDocument();
  });

  it('displays the number of days for each camp', () => {
    render(<Camps />);
    const dayElements = screen.getAllByText(/Day|Days/);
    expect(dayElements.length).toBe(2);
    expect(dayElements[0]).toHaveTextContent('1 Day');
    expect(dayElements[1]).toHaveTextContent('2 Days');
  });

  it('does not show Create New Camp button for non-admin users', () => {
    render(<Camps />);
    expect(screen.queryByText('Create New Camp')).not.toBeInTheDocument();
  });
  
  it('shows Create New Camp button for admin users', () => {
    // Mock admin permissions
    useAuthMock.mockReturnValueOnce({
      user: { id: '1', firstname: 'Admin', role: UserRole.ADMIN },
      hasPermission: () => true
    });
    
    render(<Camps />);
    expect(screen.getByText('Create New Camp')).toBeInTheDocument();
  });
}); 