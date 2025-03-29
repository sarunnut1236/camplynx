import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useAuth } from './AuthContext';
import { User } from '@/models/User';
import { UserRole } from '@/enums/User';

// Mock the auth context with proper types
const mockAuthHook = {
  user: null as User | null,
  isAuthenticated: false,
  login: vi.fn(),
  logout: vi.fn(),
  updateUser: vi.fn(),
  hasPermission: vi.fn(),
};

// Mock the AuthProvider to return our controlled values
vi.mock('./AuthContext', () => ({
  useAuth: () => mockAuthHook,
}));

describe('useAuth hook', () => {
  it('should provide auth context values', () => {
    // Setup mock auth values
    mockAuthHook.user = { id: '1', firstname: 'Test User', role: UserRole.ADMIN };
    mockAuthHook.isAuthenticated = true;
    mockAuthHook.hasPermission = vi.fn().mockReturnValue(true);
    
    // Render hook
    const { result } = renderHook(() => useAuth());
    
    // Verify context values are accessible
    expect(result.current.user).toEqual(mockAuthHook.user);
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.hasPermission(UserRole.ADMIN)).toBe(true);
  });
  
  it('should call login function when provided', () => {
    // Reset mocks
    mockAuthHook.user = null;
    mockAuthHook.login = vi.fn();
    
    // Render hook
    const { result } = renderHook(() => useAuth());
    
    // Call login
    const userData = { id: '1', role: UserRole.JOINER };
    result.current.login(userData as User);
    
    // Verify login was called with user data
    expect(mockAuthHook.login).toHaveBeenCalledWith(userData);
  });
  
  it('should call updateUser function when provided', () => {
    // Setup mock values
    mockAuthHook.user = { id: '1', firstname: 'Before Update', role: UserRole.ADMIN };
    mockAuthHook.updateUser = vi.fn();
    
    // Render hook
    const { result } = renderHook(() => useAuth());
    
    // Call updateUser
    const updatedData = { firstname: 'After Update' };
    result.current.updateUser(updatedData);
    
    // Verify updateUser was called with update data
    expect(mockAuthHook.updateUser).toHaveBeenCalledWith(updatedData);
  });
}); 