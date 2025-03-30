import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import EditCamp from './EditCamp';
import { UserRole } from '@/enums/User';
import { useAuth } from '@/contexts/AuthContext';
import { useCamp } from '@/contexts/CampContext';
import { Camp } from '@/models';

// Mock these modules
vi.mock('@/contexts/AuthContext');
vi.mock('@/contexts/CampContext');

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
  startDate: '2023-01-01',
  endDate: '2023-01-05',
  imageUrl: '/camp.jpg',
  ownerId: 'user1',
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

// Mock useCamp hook
const mockUpdateCamp = vi.fn().mockImplementation((id, campData) => {
  // Mock a successful update
  return Promise.resolve({ ...mockCamp, ...campData });
});

// Set default mocks
beforeEach(() => {
  // Default mock for useAuth
  vi.mocked(useAuth).mockReturnValue({
    user: {
      id: 'user1',
      firstname: 'John',
      surname: 'Doe',
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
      updateCamp: mockUpdateCamp,
      camps: [],
      registrations: [],
      createCamp: vi.fn(),
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
        'camps.editCamp': 'Edit Camp',
        'camps.name': 'Camp Name',
        'camps.description': 'Description',
        'camps.location': 'Location',
        'camps.startDate': 'Start Date',
        'camps.endDate': 'End Date',
        'camps.imageUrl': 'Image URL',
        'camps.defaultImage': 'If left empty, a default image will be used',
        'camps.schedule': 'Schedule',
        'camps.date': 'Date',
        'camps.activities': 'Activities',
        'camps.addActivity': 'Add Activity',
        'camps.addDay': 'Add Day',
        'common.cancel': 'Cancel',
        'common.saveChanges': 'Save Changes',
        'common.saving': 'Saving...'
      };
      return translations[key] || key;
    }
  })
}));

describe('EditCamp Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders camp information correctly', async () => {
    render(
      <MemoryRouter>
        <EditCamp />
      </MemoryRouter>
    );
    
    await waitFor(() => {
      expect(screen.getByLabelText(/Camp Name/i)).toHaveValue('Test Camp');
      expect(screen.getByLabelText(/Description/i)).toHaveValue('Test Description');
      expect(screen.getByLabelText(/Location/i)).toHaveValue('Test Location');
      expect(screen.getByLabelText(/Start Date/i)).toHaveValue('2023-01-01');
      expect(screen.getByLabelText(/End Date/i)).toHaveValue('2023-01-05');
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
        <EditCamp />
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
        updateCamp: mockUpdateCamp,
        camps: [],
        registrations: [],
        createCamp: vi.fn(),
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
        <EditCamp />
      </MemoryRouter>
    );
    
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/camps');
    });
  });

  it('redirects when user is not the camp owner', async () => {
    // Override the mock for this test to make user not the owner
    vi.mocked(useAuth).mockReturnValueOnce({
      user: {
        id: 'user2', // Different from the camp ownerId
        firstname: 'John',
        role: UserRole.ADMIN
      },
      hasPermission: () => true,
      isAuthenticated: true,
      login: vi.fn(),
      logout: vi.fn(),
      updateUser: vi.fn()
    });
    
    render(
      <MemoryRouter>
        <EditCamp />
      </MemoryRouter>
    );
    
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/unauthorized');
    });
  });

  it('allows editing camp information', async () => {
    const user = userEvent.setup();
    
    render(
      <MemoryRouter>
        <EditCamp />
      </MemoryRouter>
    );
    
    // Edit the camp name
    const nameInput = screen.getByLabelText(/Camp Name/i);
    await user.clear(nameInput);
    await user.type(nameInput, 'Updated Camp Name');
    
    // Edit description
    const descriptionInput = screen.getByLabelText(/Description/i);
    await user.clear(descriptionInput);
    await user.type(descriptionInput, 'Updated Description');
    
    // Check if the fields were updated
    expect(nameInput).toHaveValue('Updated Camp Name');
    expect(descriptionInput).toHaveValue('Updated Description');
  });

  it('allows adding a day to the schedule', async () => {
    const user = userEvent.setup();
    
    render(
      <MemoryRouter>
        <EditCamp />
      </MemoryRouter>
    );
    
    // Get the initial count of days
    const initialDays = screen.getAllByText(/Day \d/);
    
    // Click the "Add Day" button
    await user.click(screen.getByText('Add Day'));
    
    // Check if a new day was added
    const updatedDays = screen.getAllByText(/Day \d/);
    expect(updatedDays.length).toBe(initialDays.length + 1);
  });

  it('allows removing a day from the schedule', async () => {
    const user = userEvent.setup();
    
    render(
      <MemoryRouter>
        <EditCamp />
      </MemoryRouter>
    );
    
    // Get the initial count of days
    const initialDays = screen.getAllByText(/Day \d/);
    
    // Find remove buttons and click the first one
    const removeButtons = screen.getAllByRole('button', { name: /Remove Day/i });
    expect(removeButtons.length).toBeGreaterThan(0);
    // Non-null assertion to tell TypeScript this won't be undefined
    await user.click(removeButtons[0]!);
    
    // Check if a day was removed
    const updatedDays = screen.getAllByText(/Day \d/);
    expect(updatedDays.length).toBe(initialDays.length - 1);
  });

  it('allows adding and removing activities', async () => {
    const user = userEvent.setup();
    
    render(
      <MemoryRouter>
        <EditCamp />
      </MemoryRouter>
    );
    
    // Find all "Add Activity" buttons
    const addActivityButtons = screen.getAllByText('Add Activity');
    expect(addActivityButtons.length).toBeGreaterThan(0);
    
    // Click the first "Add Activity" button to add an activity to day 1
    await user.click(addActivityButtons[0]!);
    
    // Now there should be more activity inputs
    const activityInputsAfterAdding = screen.getAllByPlaceholderText(/Activity \d/);
    
    // Find remove buttons and click the first one
    const removeButtons = screen.getAllByRole('button', { name: /Remove Activity/i });
    expect(removeButtons.length).toBeGreaterThan(0);
    await user.click(removeButtons[0]!);
    
    // Now there should be fewer activity inputs
    const activityInputsAfterRemoving = screen.getAllByPlaceholderText(/Activity \d/);
    expect(activityInputsAfterRemoving.length).toBeLessThan(activityInputsAfterAdding.length);
  });

  it('submits form data and calls updateCamp', async () => {
    // Use render instead of mount
    const { container } = render(
      <MemoryRouter>
        <EditCamp />
      </MemoryRouter>
    );
    
    // Edit some fields
    const nameInput = screen.getByLabelText(/Camp Name/i);
    fireEvent.change(nameInput, { target: { value: 'Updated Camp Name' } });
    
    const locationInput = screen.getByLabelText(/Location/i);
    fireEvent.change(locationInput, { target: { value: 'Updated Location' } });
    
    // Get the form element
    const form = container.querySelector('form');
    expect(form).toBeInTheDocument();
    
    // Submit the form directly
    if (form) {
      fireEvent.submit(form);
    }
    
    // Check if updateCamp was called with the right arguments
    await waitFor(() => {
      expect(mockUpdateCamp).toHaveBeenCalledWith('1', expect.objectContaining({
        name: 'Updated Camp Name',
        location: 'Updated Location',
        ownerId: 'user1',
      }));
      
      // Check if navigation happened after successful update
      expect(mockNavigate).toHaveBeenCalledWith('/camps/1');
    });
  });

  it('navigates back to camp details when cancel is clicked', async () => {
    const user = userEvent.setup();
    
    render(
      <MemoryRouter>
        <EditCamp />
      </MemoryRouter>
    );
    
    // Click the Cancel button
    await user.click(screen.getByRole('button', { name: /Cancel/i }));
    
    // Check if navigation happened
    expect(mockNavigate).toHaveBeenCalledWith('/camps/1');
  });
}); 