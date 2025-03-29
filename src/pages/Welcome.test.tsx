import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import Welcome from './Welcome';

// Mock useNavigate hook
const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate
}));

// Mock useAuth
vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: {
      id: '1',
      firstname: 'John'
    }
  })
}));

// Mock translation
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'app.title': 'Camp Lynx',
        'app.subtitle': 'Your Nature Sanctuary',
        'app.logoAlt': 'Logo',
        'app.redirecting': 'Redirecting...'
      };
      return translations[key] || key;
    }
  })
}));

describe('Welcome Page', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('renders app title and logo', () => {
    render(<Welcome />);
    
    expect(screen.getByText('Camp Lynx')).toBeInTheDocument();
    expect(screen.getByText('Your Nature Sanctuary')).toBeInTheDocument();
    expect(screen.getByAltText('Logo')).toBeInTheDocument();
  });
  
  it('shows redirecting message', () => {
    render(<Welcome />);
    
    expect(screen.getByText('Redirecting...')).toBeInTheDocument();
  });
  
  it('navigates to home page immediately', () => {
    render(<Welcome />);
    
    // Should immediately navigate to home page
    expect(mockNavigate).toHaveBeenCalledWith('/home');
  });
}); 