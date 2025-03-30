import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '../test/test-utils';
import EditProfile from './EditProfile';
import { UserRole, Region } from '@/enums/User';

// Mock translations
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'editProfile.title': 'Edit Profile',
        'editProfile.personalInfo': 'Personal Information',
        'editProfile.firstname': 'First Name',
        'editProfile.surname': 'Last Name',
        'editProfile.nickname': 'Nickname',
        'editProfile.email': 'Email',
        'editProfile.phone': 'Phone',
        'editProfile.region': 'Region',
        'editProfile.clear': 'Clear',
        'editProfile.cancel': 'Cancel',
        'editProfile.save': 'Save Changes',
        'editProfile.saving': 'Saving...',
        'editProfile.loading': 'Loading...',
        'editProfile.healthInfo': 'Health Information',
        'editProfile.foodAllergy': 'Food Allergies',
        'editProfile.medicalCondition': 'Medical Conditions',
        'editProfile.additionalInfo': 'Additional Information',
        'editProfile.jobTitle': 'Title',
        'editProfile.bio': 'Bio',
        'editProfile.memberCode': 'Member Code'
      };
      return translations[key] || key;
    }
  })
}));

// Mock useAuth with updateUser function
const mockUpdateUser = vi.fn();
vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: {
      id: '1',
      firstname: 'John',
      surname: 'Doe',
      nickname: 'JD',
      email: 'john@example.com',
      phone: '123456789',
      role: UserRole.ADMIN,
      region: Region.BKK,
      joinedAt: new Date(2022, 0, 1),
      birthdate: new Date(1990, 0, 1),
      lineId: 'john_doe',
      foodAllergy: 'Nuts',
      personalMedicalCondition: 'None',
      bio: 'Test bio',
      title: 'Developer',
      memberCode: 'YNS001'
    },
    updateUser: mockUpdateUser
  })
}));

// Mock navigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate
  };
});

describe('EditProfile', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  it('renders form with user data', () => {
    render(<EditProfile />);
    
    // Check if form fields are populated with user data
    expect(screen.getByDisplayValue('John')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Doe')).toBeInTheDocument();
    expect(screen.getByDisplayValue('JD')).toBeInTheDocument();
    expect(screen.getByDisplayValue('john@example.com')).toBeInTheDocument();
    expect(screen.getByDisplayValue('YNS001')).toBeInTheDocument(); // Check memberCode
  });
  
  it('updates form data when input changes', () => {
    render(<EditProfile />);
    
    // Get the firstname input and change its value
    const firstnameInput = screen.getByLabelText('First Name *');
    fireEvent.change(firstnameInput, { target: { value: 'Updated Name' } });
    
    // Check if input value was updated
    expect(firstnameInput).toHaveValue('Updated Name');
  });
  
  it('clears optional fields when clicking clear button', () => {
    render(<EditProfile />);
    
    // Check initial email value
    const emailInput = screen.getByLabelText('Email');
    expect(emailInput).toHaveValue('john@example.com');
    
    // Find and click the clear button for email
    const clearButtons = screen.getAllByText('Clear');
    // Get the one next to Email label
    const emailClearButton = Array.from(clearButtons).find(button => {
      return button.closest('.form-group')?.contains(emailInput);
    });
    
    if (emailClearButton) {
      fireEvent.click(emailClearButton);
      // Check if the email field was cleared
      expect(emailInput).toHaveValue('');
    } else {
      throw new Error('Clear button for email not found');
    }
  });
  
  it('submits form and updates user', async () => {
    render(<EditProfile />);
    
    // Change a value
    const firstnameInput = screen.getByLabelText('First Name *');
    fireEvent.change(firstnameInput, { target: { value: 'Updated Name' } });
    
    // Submit the form
    const saveButton = screen.getByText('Save Changes');
    fireEvent.click(saveButton);
    
    // Wait for form submission
    await waitFor(() => {
      // Check if updateUser was called with form data
      expect(mockUpdateUser).toHaveBeenCalled();
      // Check if user was navigated back to profile
      expect(mockNavigate).toHaveBeenCalledWith('/profile');
    });
  });
  
  it('cancels edit and navigates back to profile', () => {
    render(<EditProfile />);
    
    // Click the cancel button
    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);
    
    // Check if navigation happened
    expect(mockNavigate).toHaveBeenCalledWith('/profile');
  });
  
  it('allows editing the member code', () => {
    render(<EditProfile />);
    
    // Find the memberCode input by its label
    const memberCodeInput = screen.getByLabelText('Member Code');
    
    // Change the value
    fireEvent.change(memberCodeInput, { target: { value: 'YNS002' } });
    
    // Check if the input value was updated
    expect(memberCodeInput).toHaveValue('YNS002');
  });
}); 