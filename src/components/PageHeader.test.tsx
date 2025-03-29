import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '../test/test-utils';
import PageHeader from './PageHeader';
import { User } from '@/models/User';
import { UserRole } from '@/enums/User';

// Mock useAuth
vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: {
      id: '1',
      firstname: 'Test User',
      role: UserRole.ADMIN,
      profileImage: '/test-image.jpg'
    } as User
  })
}));

// Mock useLocation
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useLocation: () => ({ pathname: '/test' }),
    useNavigate: () => vi.fn()
  };
});

describe('PageHeader', () => {
  it('renders the title correctly', () => {
    render(<PageHeader title="Test Title" />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('renders profile button with image when user has profile image', () => {
    render(<PageHeader title="Test Title" />);
    const profileImage = screen.getByAltText('Test User');
    expect(profileImage).toBeInTheDocument();
    expect(profileImage).toHaveAttribute('src', '/test-image.jpg');
  });

  it('shows back button on non-main screens', () => {
    render(<PageHeader title="Test Title" showBackButton={true} />);
    const backButton = screen.getByLabelText('Go back');
    expect(backButton).toBeInTheDocument();
  });

  it('does not show back button when showBackButton is false', () => {
    render(<PageHeader title="Test Title" showBackButton={false} />);
    expect(screen.queryByLabelText('Go back')).not.toBeInTheDocument();
  });

  it('does not show profile button when showProfileButton is false', () => {
    render(<PageHeader title="Test Title" showProfileButton={false} />);
    expect(screen.queryByAltText('Test User')).not.toBeInTheDocument();
  });
}); 