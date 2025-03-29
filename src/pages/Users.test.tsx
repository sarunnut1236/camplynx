import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '../test/test-utils';
import Users from './Users';
import { UserRole } from '@/enums/User';

// Create the mock function at the top level
const mockUpdateUser = vi.fn().mockImplementation((id, data) => {
  return Promise.resolve({
    id,
    ...data
  });
});

// Mock providers before variable declarations to avoid hoisting issues
vi.mock('@/providers/users', () => ({
  getAllUsers: () => Promise.resolve([
    {
      id: '1',
      firstname: 'Admin User',
      email: 'admin@example.com',
      role: UserRole.ADMIN
    },
    {
      id: '2',
      firstname: 'Jane',
      email: 'jane@example.com',
      role: UserRole.JOINER
    },
    {
      id: '3',
      firstname: 'Bob',
      email: 'bob@example.com',
      role: UserRole.JOINER
    },
    {
      id: '4',
      firstname: 'Guest',
      email: 'guest@example.com',
      role: UserRole.GUEST
    }
  ]),
  updateUser: () => mockUpdateUser
}));

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

// Mock translation
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: any) => {
      const translations: Record<string, string> = {
        'users.manageUsers': 'Manage Users',
        'users.adminDescription': 'As an admin, you can manage user roles and permissions.',
        'users.changeRole': 'Change Role',
        'users.changeRoleTitle': 'Change User Role',
        'users.changeRoleDescription': `Change role for ${options?.name || 'user'}`,
        'users.selectRole': 'Select Role',
        'users.selectRolePlaceholder': 'Select a role',
        'common.cancel': 'Cancel',
        'common.saveChanges': 'Save Changes',
        'roles.admin': 'Admin',
        'roles.joiner': 'Joiner',
        'roles.guest': 'Guest'
      };
      return translations[key] || key;
    }
  })
}));

// Mock the dropdown menu components
vi.mock('@/components/ui/dropdown-menu', () => ({
  DropdownMenu: ({ children }: { children: React.ReactNode }) => <div data-testid="dropdown-menu">{children}</div>,
  DropdownMenuTrigger: ({ children }: { children: React.ReactNode }) => <div data-testid="dropdown-trigger">{children}</div>,
  DropdownMenuContent: ({ children }: { children: React.ReactNode }) => <div data-testid="dropdown-content">{children}</div>,
  DropdownMenuItem: ({ onClick, children }: { onClick: () => void, children: React.ReactNode }) => 
    <button data-testid="dropdown-item" onClick={onClick}>{children}</button>
}));

// Mock the dialog components
vi.mock('@/components/ui/dialog', () => ({
  Dialog: ({ children, open }: { children: React.ReactNode, open: boolean }) => 
    open ? <div data-testid="dialog">{children}</div> : null,
  DialogContent: ({ children }: { children: React.ReactNode }) => <div data-testid="dialog-content">{children}</div>,
  DialogHeader: ({ children }: { children: React.ReactNode }) => <div data-testid="dialog-header">{children}</div>,
  DialogTitle: ({ children }: { children: React.ReactNode }) => <h2 data-testid="dialog-title">{children}</h2>,
  DialogDescription: ({ children }: { children: React.ReactNode }) => <p data-testid="dialog-description">{children}</p>,
  DialogFooter: ({ children }: { children: React.ReactNode }) => <div data-testid="dialog-footer">{children}</div>
}));

// Mock the select components
vi.mock('@/components/ui/select', () => ({
  Select: ({ children, onValueChange }: { children: React.ReactNode, onValueChange: (value: string) => void }) => {
    // Add a way to trigger the onValueChange directly
    return (
      <div 
        data-testid="select"
        onClick={() => onValueChange(UserRole.ADMIN)}
      >
        {children}
      </div>
    );
  },
  SelectTrigger: ({ children }: { children: React.ReactNode }) => <div data-testid="select-trigger">{children}</div>,
  SelectValue: ({ children }: { children: React.ReactNode }) => <div data-testid="select-value">{children}</div>,
  SelectContent: ({ children }: { children: React.ReactNode }) => <div data-testid="select-content">{children}</div>,
  SelectItem: ({ value, children }: { value: string, children: React.ReactNode }) => 
    <option data-testid="select-item" value={value}>{children}</option>
}));

// Create a custom render for our component
const customRender = () => {
  return render(<Users />);
};

describe('Users', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the users list', async () => {
    customRender();
    await waitFor(() => {
      expect(screen.getByText('Manage Users')).toBeInTheDocument();
      expect(screen.getByText('As an admin, you can manage user roles and permissions.')).toBeInTheDocument();
    });
  });

  it('displays user information correctly', async () => {
    customRender();
    await waitFor(() => {
      // Check for user names and emails
      expect(screen.getByText('Jane')).toBeInTheDocument();
      expect(screen.getByText('jane@example.com')).toBeInTheDocument();
      expect(screen.getByText('Bob')).toBeInTheDocument();
      expect(screen.getByText('bob@example.com')).toBeInTheDocument();
    });
  });

  it('opens role dialog when clicking Change Role', async () => {
    customRender();
    
    await waitFor(() => {
      // Should have dropdown triggers for each user except the current user
      const dropdownTriggers = screen.getAllByTestId('dropdown-trigger');
      expect(dropdownTriggers.length).toBe(3); // 4 users - 1 current user
    });
    
    // Click the first dropdown
    const dropdownTriggers = screen.getAllByTestId('dropdown-trigger');
    fireEvent.click(dropdownTriggers[0]!);
    
    // Click on "Change Role" option - Use getAllByTestId since there may be multiple dropdown items
    const dropdownItems = screen.getAllByTestId('dropdown-item');
    expect(dropdownItems.length).toBeGreaterThan(0);
    fireEvent.click(dropdownItems[0]!);
    
    // Check if dialog appears
    await waitFor(() => {
      expect(screen.getByTestId('dialog')).toBeInTheDocument();
      expect(screen.getByText('Change User Role')).toBeInTheDocument();
    });
  });

  it('updates user role when selecting a new role', async () => {
    customRender();
    
    await waitFor(() => {
      const dropdownTriggers = screen.getAllByTestId('dropdown-trigger');
      expect(dropdownTriggers.length).toBe(3);
    });
    
    // Click the first dropdown
    const dropdownTriggers = screen.getAllByTestId('dropdown-trigger');
    fireEvent.click(dropdownTriggers[0]!);
    
    // Click on "Change Role" option
    const dropdownItems = screen.getAllByTestId('dropdown-item');
    expect(dropdownItems.length).toBeGreaterThan(0);
    fireEvent.click(dropdownItems[0]!);
    
    // Wait for dialog to appear
    await waitFor(() => {
      expect(screen.getByTestId('dialog')).toBeInTheDocument();
    });
    
    // Just click the select element to trigger the onValueChange directly
    const select = screen.getByTestId('select');
    fireEvent.click(select);
    
    // Click Save Changes
    const saveButton = screen.getByText('Save Changes');
    fireEvent.click(saveButton);
    
    // Wait for the dialog to close (update completed)
    await waitFor(() => {
      expect(screen.queryByTestId('dialog')).not.toBeInTheDocument();
    });
  });
}); 