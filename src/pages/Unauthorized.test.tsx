import { describe, it, expect, vi, beforeEach, afterAll } from 'vitest';
import { render, screen } from '@testing-library/react';
import Unauthorized from './Unauthorized';

// Mock the useNavigate hook
const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate
}));

// Mock setTimeout and clearTimeout
const originalSetTimeout = global.setTimeout;
const originalClearTimeout = global.clearTimeout;

// Create a callback that we'll capture
let capturedCallback: Function | null = null;
const mockSetTimeout = vi.fn().mockImplementation((callback: Function, delay: number) => {
  capturedCallback = callback;
  return 123; // Return timer ID
});

global.setTimeout = mockSetTimeout as any;
global.clearTimeout = vi.fn() as any;

// Mock translation
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'unauthorized.title': 'Unauthorized Access',
        'unauthorized.message': 'You do not have permission to access this page.'
      };
      return translations[key] || key;
    }
  })
}));

describe('Unauthorized Page', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    mockSetTimeout.mockClear();
    (global.clearTimeout as any).mockClear();
    capturedCallback = null;
  });
  
  afterAll(() => {
    // Restore original functions
    global.setTimeout = originalSetTimeout;
    global.clearTimeout = originalClearTimeout;
  });
  
  it('renders unauthorized message', () => {
    render(<Unauthorized />);
    
    expect(screen.getByText('Unauthorized Access')).toBeInTheDocument();
    expect(screen.getByText('You do not have permission to access this page.')).toBeInTheDocument();
  });
  
  it('sets a timeout to navigate to home', () => {
    render(<Unauthorized />);
    
    // Should call setTimeout with a delay of 1500ms
    expect(mockSetTimeout).toHaveBeenCalledWith(expect.any(Function), 1500);
    
    // Call the captured callback
    expect(capturedCallback).not.toBeNull();
    if (capturedCallback) {
      capturedCallback();
    }
    
    // Should navigate to home
    expect(mockNavigate).toHaveBeenCalledWith('/home');
  });
  
  it('clears the timeout when unmounting', () => {
    const { unmount } = render(<Unauthorized />);
    
    // Unmount the component
    unmount();
    
    // Should clear the timeout
    expect(global.clearTimeout).toHaveBeenCalledWith(123); // The mocked timer ID
  });
}); 