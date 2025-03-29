import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import CreateCamp from './CreateCamp';
import { UserRole } from '@/enums/User';
import { useAuth } from '@/contexts/AuthContext';

// Mock the entire module
vi.mock('@/contexts/AuthContext');

// Mock navigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate
  };
});

// Mock createCamp function
const mockCreateCamp = vi.fn();
vi.mock('@/contexts/CampContext', () => ({
  useCamp: () => ({
    createCamp: mockCreateCamp
  })
}));

// Setup default mocks
beforeEach(() => {
  // Default mock for useAuth
  vi.mocked(useAuth).mockReturnValue({
    hasPermission: (role: UserRole) => role === UserRole.ADMIN,
    user: null,
    isAuthenticated: true,
    login: vi.fn(),
    logout: vi.fn(),
    updateUser: vi.fn()
  });
});

// Mock useTranslation
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'camps.createNew': 'Create New Camp',
        'camps.name': 'Camp Name',
        'camps.description': 'Description',
        'camps.location': 'Location',
        'camps.startDate': 'Start Date',
        'camps.endDate': 'End Date',
        'camps.schedule': 'Schedule',
        'camps.date': 'Date',
        'camps.activities': 'Activities',
        'camps.activity': 'Activity',
        'camps.addActivity': 'Add Activity',
        'camps.addDay': 'Add Day',
        'common.cancel': 'Cancel',
        'common.create': 'Create',
        'common.creating': 'Creating...'
      };
      return translations[key] || key;
    }
  })
}));

describe('CreateCamp Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the form with basic fields', () => {
    render(
      <MemoryRouter>
        <CreateCamp />
      </MemoryRouter>
    );
    
    // Check for form fields
    expect(screen.getByLabelText(/Camp Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Location/i)).toBeInTheDocument();
    expect(screen.getAllByLabelText(/Date/i).length).toBeGreaterThan(0); 
    
    // Check for buttons
    expect(screen.getByText('Create')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  it('redirects to unauthorized page if user is not admin', () => {
    // Override the mock to simulate non-admin user
    vi.mocked(useAuth).mockReturnValueOnce({
      hasPermission: () => false,
      user: null,
      isAuthenticated: true,
      login: vi.fn(),
      logout: vi.fn(),
      updateUser: vi.fn()
    });
    
    render(
      <MemoryRouter>
        <CreateCamp />
      </MemoryRouter>
    );
    
    expect(mockNavigate).toHaveBeenCalledWith('/unauthorized');
  });

  it('allows entering camp information', async () => {
    const user = userEvent.setup();
    
    render(
      <MemoryRouter>
        <CreateCamp />
      </MemoryRouter>
    );
    
    // Fill in the form
    await user.type(screen.getByLabelText(/Camp Name/i), 'Test Camp');
    await user.type(screen.getByLabelText(/Description/i), 'Test Description');
    await user.type(screen.getByLabelText(/Location/i), 'Test Location');
    
    // Set dates
    const startDateInput = screen.getByLabelText(/Start Date/i);
    const endDateInput = screen.getByLabelText(/End Date/i);
    
    await user.clear(startDateInput);
    await user.type(startDateInput, '2023-07-01');
    await user.clear(endDateInput);
    await user.type(endDateInput, '2023-07-05');
    
    // Verify values were set
    expect(startDateInput).toHaveValue('2023-07-01');
    expect(endDateInput).toHaveValue('2023-07-05');
  });

  it('allows adding days and activities', async () => {
    const user = userEvent.setup();
    
    render(
      <MemoryRouter>
        <CreateCamp />
      </MemoryRouter>
    );
    
    // There should be 1 day initially
    expect(screen.getByText('Day 1')).toBeInTheDocument();
    
    // Add a day
    await user.click(screen.getByText('Add Day'));
    
    // Now there should be 2 days
    expect(screen.getByText('Day 1')).toBeInTheDocument();
    expect(screen.getByText('Day 2')).toBeInTheDocument();
    
    // Add an activity to day 1
    const addActivityButtons = screen.getAllByText('Add Activity');
    await user.click(addActivityButtons[0]!);
  });

  it('calls createCamp when form is submitted', async () => {
    // Directly mock the form submission behavior
    const { container } = render(
      <MemoryRouter>
        <CreateCamp />
      </MemoryRouter>
    );
    
    // Get the form element
    const form = container.querySelector('form');
    expect(form).toBeInTheDocument();
    
    // Set values in the component's state directly by simulating change events
    // Camp basic info
    fireEvent.change(screen.getByLabelText(/Camp Name/i), { target: { value: 'Test Camp' } });
    fireEvent.change(screen.getByLabelText(/Description/i), { target: { value: 'Test Description' } });
    fireEvent.change(screen.getByLabelText(/Location/i), { target: { value: 'Test Location' } });
    
    // Dates
    fireEvent.change(screen.getByLabelText(/Start Date/i), { target: { value: '2023-07-01' } });
    fireEvent.change(screen.getByLabelText(/End Date/i), { target: { value: '2023-07-05' } });
    
    // Get all date inputs within the form
    const allDateInputs = Array.from(form!.querySelectorAll('input[type="date"]'));
    // The last date input should be for the camp day
    if (allDateInputs.length >= 3) {
      fireEvent.change(allDateInputs[2]!, { target: { value: '2023-07-01' } });
    }
    
    // Find all activity inputs
    const activityInputs = Array.from(form!.querySelectorAll('input:not([type="date"])'))
      .filter(input => !(input as HTMLInputElement).name.includes('name') 
                     && !(input as HTMLInputElement).name.includes('location')
                     && !(input as HTMLInputElement).name.includes('imageUrl'));
    
    // The first one that's not a date input should be our activity input
    if (activityInputs.length > 0) {
      fireEvent.change(activityInputs[0]!, { target: { value: 'Morning Hike' } });
    }
    
    // Submit the form
    if (form) {
      fireEvent.submit(form);
    }
    
    // Check if createCamp was called
    await waitFor(() => {
      expect(mockCreateCamp).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('/camps');
    });
  });
}); 