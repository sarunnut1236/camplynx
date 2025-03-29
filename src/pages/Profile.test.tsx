import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '../test/test-utils';
import Profile from './Profile';
import { UserRole, Region } from '@/enums/User';

// Mock useAuth
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
      title: 'Developer'
    }
  })
}));

describe('Profile', () => {
  it('renders user information correctly', () => {
    render(<Profile />);
    
    // Check for basic user info
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('"JD"')).toBeInTheDocument();
    expect(screen.getByText('Developer')).toBeInTheDocument();
    expect(screen.getByText('Test bio')).toBeInTheDocument();
  });
  
  it('displays contact information', () => {
    render(<Profile />);
    
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
    expect(screen.getByText('123456789')).toBeInTheDocument();
    expect(screen.getByText('BKK')).toBeInTheDocument();
    expect(screen.getByText('john_doe')).toBeInTheDocument();
  });
  
  it('shows health information', () => {
    render(<Profile />);
    
    expect(screen.getByText('Health Information')).toBeInTheDocument();
    expect(screen.getByText('Nuts')).toBeInTheDocument();
    expect(screen.getByText('None')).toBeInTheDocument();
  });
  
  it('displays role information', () => {
    render(<Profile />);
    
    expect(screen.getByText('Role & Permissions')).toBeInTheDocument();
    expect(screen.getByText('Current Role')).toBeInTheDocument();
    expect(screen.getByText('Admin')).toBeInTheDocument();
  });
  
  it('shows admin actions for admin users', () => {
    render(<Profile />);
    
    expect(screen.getByText('Manage Users & Roles')).toBeInTheDocument();
  });
  
  it('has edit profile and delete buttons', () => {
    render(<Profile />);
    
    expect(screen.getByText('Edit')).toBeInTheDocument();
    expect(screen.getByText('Delete Optional Fields')).toBeInTheDocument();
  });
}); 