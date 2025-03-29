import { describe, it, expect, vi, afterAll } from 'vitest';
import { render, screen } from '@testing-library/react';
import NotFound from './NotFound';

// Mock react-router-dom
vi.mock('react-router-dom', () => ({
  useLocation: () => ({
    pathname: '/non-existent-path'
  }),
  Link: ({ children, to }: { children: React.ReactNode; to: string }) => (
    <a href={to} data-testid="link">{children}</a>
  )
}));

// Mock console.error to prevent test output noise
const originalConsoleError = console.error;
console.error = vi.fn();

// Mock translation
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'notFound.title': 'Page Not Found',
        'notFound.message': 'The page you are looking for does not exist.',
        'notFound.goHome': 'Go Home'
      };
      return translations[key] || key;
    }
  })
}));

describe('NotFound Page', () => {
  afterAll(() => {
    // Restore console.error after tests
    console.error = originalConsoleError;
  });

  it('renders not found message', () => {
    render(<NotFound />);
    
    expect(screen.getByText('Page Not Found')).toBeInTheDocument();
    expect(screen.getByText('The page you are looking for does not exist.')).toBeInTheDocument();
  });
  
  it('shows a link to return home', () => {
    render(<NotFound />);
    
    const homeLink = screen.getByText('Go Home');
    expect(homeLink).toBeInTheDocument();
    expect(homeLink.closest('a')).toHaveAttribute('href', '/');
  });
  
  it('logs error message to console', () => {
    render(<NotFound />);
    
    expect(console.error).toHaveBeenCalledWith(
      '404 Error: User attempted to access non-existent route:',
      '/non-existent-path'
    );
  });
}); 