import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Home from './Home';
import { UserRole } from '@/enums/User';
import { MemoryRouter } from 'react-router-dom';

// Mock camps data
const mockCamps = [
  {
    id: '1',
    name: 'Test Camp 1',
    description: 'Camp description 1',
    location: 'Location 1',
    startDate: '2023-07-01',
    endDate: '2023-07-05',
    imageUrl: '/test1.jpg',
    days: []
  },
  {
    id: '2',
    name: 'Test Camp 2',
    description: 'Camp description 2',
    location: 'Location 2',
    startDate: '2023-08-01',
    endDate: '2023-08-05',
    imageUrl: '/test2.jpg',
    days: []
  },
  {
    id: '3',
    name: 'Test Camp 3',
    description: 'Camp description 3',
    location: 'Location 3',
    startDate: '2023-09-01',
    endDate: '2023-09-05',
    imageUrl: '/test3.jpg',
    days: []
  },
  {
    id: '4',
    name: 'Summer Camp',
    description: 'Summer activities and fun',
    location: 'Beach Resort',
    startDate: '2023-06-01',
    endDate: '2023-06-05',
    imageUrl: '/summer.jpg',
    days: []
  }
];

// Mock useCamp
const mockSearchCamps = vi.fn().mockImplementation((searchTerm) => {
  if (!searchTerm) return mockCamps.slice(0, 3);
  return mockCamps.filter(camp => 
    camp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    camp.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    camp.location.toLowerCase().includes(searchTerm.toLowerCase())
  );
});

vi.mock('@/contexts/CampContext', () => ({
  useCamp: () => ({
    camps: mockCamps,
    searchCamps: mockSearchCamps
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
        'home.viewCamps': 'View Camps',
        'home.searchResults': 'Search Results',
        'home.noResultsFound': 'No camps found matching your search'
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
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  it('renders the home page with user greeting', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Hello, John')).toBeInTheDocument();
    expect(screen.getByText('Welcome to YNS Camp')).toBeInTheDocument();
  });
  
  it('displays a search input', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    
    const searchInput = screen.getByPlaceholderText('Search camps...');
    expect(searchInput).toBeInTheDocument();
  });
  
  it('shows upcoming activities section with camps', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    
    expect(screen.getByText('Upcoming Activities')).toBeInTheDocument();
    
    // Should only show the first 3 camps
    expect(screen.getByText('Test Camp 1')).toBeInTheDocument();
    expect(screen.getByText('Test Camp 2')).toBeInTheDocument();
    expect(screen.getByText('Test Camp 3')).toBeInTheDocument();
  });
  
  it('shows camp details in the upcoming activities section', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    
    expect(screen.getByText('Camp description 1')).toBeInTheDocument();
    expect(screen.getByText('Camp description 2')).toBeInTheDocument();
    expect(screen.getByText('Camp description 3')).toBeInTheDocument();
  });
  
  it('displays Register Now buttons for each camp', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    
    const registerButtons = screen.getAllByText('Register Now');
    expect(registerButtons.length).toBe(3);
  });
  
  it('shows a link to see all camps', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    
    expect(screen.getByText('See all camps')).toBeInTheDocument();
  });
  
  it('displays quick actions section', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    
    expect(screen.getByText('Quick Actions')).toBeInTheDocument();
    expect(screen.getByText('Manage Profile')).toBeInTheDocument();
    expect(screen.getByText('View Camps')).toBeInTheDocument();
  });
  
  it('searches for camps when typing in the search input', async () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    
    const searchInput = screen.getByPlaceholderText('Search camps...');
    fireEvent.change(searchInput, { target: { value: 'summer' } });
    
    await waitFor(() => {
      expect(mockSearchCamps).toHaveBeenCalledWith('summer');
      expect(screen.getByText('Search Results')).toBeInTheDocument();
      expect(screen.getByText('Summer Camp')).toBeInTheDocument();
      expect(screen.queryByText('Test Camp 1')).not.toBeInTheDocument();
    });
  });
  
  it('shows message when no search results are found', async () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    
    const searchInput = screen.getByPlaceholderText('Search camps...');
    fireEvent.change(searchInput, { target: { value: 'nonexistent' } });
    
    await waitFor(() => {
      expect(mockSearchCamps).toHaveBeenCalledWith('nonexistent');
      expect(screen.getByText('Search Results')).toBeInTheDocument();
      expect(screen.getByText('No camps found matching your search')).toBeInTheDocument();
    });
  });
  
  it('hides the "See all camps" link when searching', async () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    
    // Initial state should show the link
    expect(screen.getByText('See all camps')).toBeInTheDocument();
    
    // Type in search box
    const searchInput = screen.getByPlaceholderText('Search camps...');
    fireEvent.change(searchInput, { target: { value: 'summer' } });
    
    // Link should be hidden
    await waitFor(() => {
      expect(screen.queryByText('See all camps')).not.toBeInTheDocument();
    });
  });
  
  it('resets to showing upcoming camps when search is cleared', async () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    
    const searchInput = screen.getByPlaceholderText('Search camps...');
    
    // Search for camps
    fireEvent.change(searchInput, { target: { value: 'summer' } });
    
    // Verify search results are shown
    await waitFor(() => {
      expect(screen.getByText('Search Results')).toBeInTheDocument();
    });
    
    // Clear search
    fireEvent.change(searchInput, { target: { value: '' } });
    
    // Verify upcoming activities are shown again
    await waitFor(() => {
      expect(screen.getByText('Upcoming Activities')).toBeInTheDocument();
      expect(screen.getByText('Test Camp 1')).toBeInTheDocument();
      expect(screen.getByText('Test Camp 2')).toBeInTheDocument();
      expect(screen.getByText('Test Camp 3')).toBeInTheDocument();
      expect(screen.getByText('See all camps')).toBeInTheDocument();
    });
  });
}); 