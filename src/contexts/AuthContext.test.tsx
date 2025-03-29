import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth, createDefaultUser } from './AuthContext';
import { MemoryRouter } from 'react-router-dom';
import { UserRole } from '@/enums/User';

// Mock toast
vi.mock('@/components/ui/toast', () => ({
  useToast: () => ({
    toast: vi.fn()
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

// Test component that uses the auth context
const TestComponent = () => {
  const { user, login, logout, updateUser } = useAuth();
  
  return (
    <div>
      <div data-testid="user-firstname">{user?.firstname}</div>
      <div data-testid="user-email">{user?.email}</div>
      <div data-testid="user-role">{user?.role}</div>
      <button 
        data-testid="login-button" 
        onClick={() => login(createDefaultUser('Test User', 'test@example.com'))}
      >
        Login
      </button>
      <button 
        data-testid="logout-button" 
        onClick={logout}
      >
        Logout
      </button>
      <button 
        data-testid="update-button" 
        onClick={() => updateUser({ firstname: 'Updated Name' })}
      >
        Update
      </button>
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should provide initial auth state', () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      </MemoryRouter>
    );

    // Initial state should have a default user
    expect(screen.getByTestId('user-firstname').textContent).toBeTruthy();
    expect(screen.getByTestId('user-role').textContent).toBeTruthy();
  });

  it('should handle login', async () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      </MemoryRouter>
    );

    fireEvent.click(screen.getByTestId('login-button'));
    
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/home');
    });
  });

  it('should handle logout', async () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      </MemoryRouter>
    );

    fireEvent.click(screen.getByTestId('logout-button'));
    
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/home');
    });
  });

  it('should handle update user', () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      </MemoryRouter>
    );

    const initialName = screen.getByTestId('user-firstname').textContent;
    
    fireEvent.click(screen.getByTestId('update-button'));
    
    expect(screen.getByTestId('user-firstname').textContent).toBe('Updated Name');
    expect(screen.getByTestId('user-firstname').textContent).not.toBe(initialName);
  });

  it('should create a default user with firstname and optional email', () => {
    const user = createDefaultUser('Test User', 'test@example.com');
    
    expect(user.firstname).toBe('Test User');
    expect(user.email).toBe('test@example.com');
    expect(user.role).toBe(UserRole.GUEST);
    expect(user.id).toBeTruthy();
    
    const userWithoutEmail = createDefaultUser('Another User');
    
    expect(userWithoutEmail.firstname).toBe('Another User');
    expect(userWithoutEmail.email).toBeUndefined();
  });
}); 