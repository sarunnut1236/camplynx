import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '../test/test-utils';
import Home from './Home';
import { UserRole } from '@/enums/User';

// Mock camp data
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
  },
  {
    id: 'camp-3',
    name: 'Test Camp 3',
    description: 'Camp description 3',
    location: 'Phuket',
    startDate: '2023-09-01',
    endDate: '2023-09-03',
    imageUrl: '/image3.jpg',
    days: []
  }
];

// Mock useCamp
vi.mock('@/contexts/CampContext', () => ({
  useCamp: () => ({
    camps: mockCamps
  })
}));

// Mock useAuth
vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { id: '1', firstname: 'John', role: UserRole.JOINER }
  })
}));

// Mock translation
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'navigation.home': 'Home',
        'app.logoAlt': 'YNS Logo',
        'home.searchPlaceholder': 'Search camps...',
        'home.hello': 'Hello, {{name}}',
        'home.welcome': 'Welcome to YNS Camp',
        'home.upcomingActivities': 'Upcoming Activities',
        'home.registerNow': 'Register Now',
        'home.seeAllCamps': 'See all camps',
        'home.quickActions': 'Quick Actions',
        'home.manageProfile': 'Manage Profile',
        'home.viewCamps': 'View Camps'
      };
      // Handle variable substitution for 'hello'
      if (key === 'home.hello') {
        return 'Hello, John';
      }
      return translations[key] || key;
    },
    i18n: {
      language: 'en'
    }
  })
}));

describe('Home Page', () => {
  it('renders the home page with user greeting', () => {
    render(<Home />);
    
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Hello, John')).toBeInTheDocument();
    expect(screen.getByText('Welcome to YNS Camp')).toBeInTheDocument();
  });
  
  it('displays a search input', () => {
    render(<Home />);
    
    const searchInput = screen.getByPlaceholderText('Search camps...');
    expect(searchInput).toBeInTheDocument();
  });
  
  it('shows upcoming activities section with camps', () => {
    render(<Home />);
    
    expect(screen.getByText('Upcoming Activities')).toBeInTheDocument();
    
    // Should only show the first 3 camps
    expect(screen.getByText('Test Camp 1')).toBeInTheDocument();
    expect(screen.getByText('Test Camp 2')).toBeInTheDocument();
    expect(screen.getByText('Test Camp 3')).toBeInTheDocument();
  });
  
  it('shows camp details in the upcoming activities section', () => {
    render(<Home />);
    
    expect(screen.getByText('Camp description 1')).toBeInTheDocument();
    expect(screen.getByText('Camp description 2')).toBeInTheDocument();
    expect(screen.getByText('Camp description 3')).toBeInTheDocument();
  });
  
  it('displays Register Now buttons for each camp', () => {
    render(<Home />);
    
    const registerButtons = screen.getAllByText('Register Now');
    expect(registerButtons.length).toBe(3);
  });
  
  it('shows a link to see all camps', () => {
    render(<Home />);
    
    expect(screen.getByText('See all camps')).toBeInTheDocument();
  });
  
  it('displays quick actions section', () => {
    render(<Home />);
    
    expect(screen.getByText('Quick Actions')).toBeInTheDocument();
    expect(screen.getByText('Manage Profile')).toBeInTheDocument();
    expect(screen.getByText('View Camps')).toBeInTheDocument();
  });
}); 