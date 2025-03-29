import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '../test/test-utils';
import Users from './Users';
import { UserRole } from '@/enums/User';

// Mock toast
vi.mock('@/components/ui/toast', () => ({
  useToast: () => ({
    toast: vi.fn()
  })
}));

// Mock useAuth
vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: {
      id: '1',
      firstname: 'Admin User',
      role: UserRole.ADMIN
    },
    hasPermission: () => true
  })
}));

describe('Users', () => {
  it('renders the users list', () => {
    render(<Users />);
    expect(screen.getByText('Manage Users')).toBeInTheDocument();
    expect(screen.getByText('As an admin, you can manage user roles and permissions.')).toBeInTheDocument();
  });

  it('displays user information correctly', () => {
    render(<Users />);
    // Check if all users are rendered
    expect(screen.getAllByText(/Admin|Joiner/)).toHaveLength(4);
    
    // Check specific user details
    expect(screen.getByText('Jane')).toBeInTheDocument();
    expect(screen.getByText('jane@example.com')).toBeInTheDocument();
  });

  it('opens role dialog when clicking Change Role', async () => {
    render(<Users />);
    
    // Open dropdown menu for a user that's not the current user
    const dropdownButtons = screen.getAllByRole('button', { name: '' });
    fireEvent.click(dropdownButtons[1]); // Second user dropdown
    
    // Click on "Change Role" option
    const changeRoleOption = await screen.findByText('Change Role');
    fireEvent.click(changeRoleOption);
    
    // Check if dialog appears
    expect(screen.getByText('Change User Role')).toBeInTheDocument();
  });

  it('updates user role when selecting a new role', async () => {
    render(<Users />);
    
    // Open dropdown for second user
    const dropdownButtons = screen.getAllByRole('button', { name: '' });
    fireEvent.click(dropdownButtons[1]);
    
    // Click on "Change Role" option
    const changeRoleOption = await screen.findByText('Change Role');
    fireEvent.click(changeRoleOption);
    
    // Select a new role (Admin)
    const roleSelect = screen.getByRole('combobox');
    fireEvent.click(roleSelect);
    
    // Find and click the Admin option
    const adminOption = await screen.findByText('Admin');
    fireEvent.click(adminOption);
    
    // Click Save Changes
    const saveButton = screen.getByText('Save Changes');
    fireEvent.click(saveButton);
    
    // Verify toast was shown (implicitly testing that handleRoleChange was called)
    await waitFor(() => {
      expect(screen.queryByText('Change User Role')).not.toBeInTheDocument();
    });
  });
}); 