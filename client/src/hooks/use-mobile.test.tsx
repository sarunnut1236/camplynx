import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useIsMobile } from './use-mobile';

describe('useIsMobile hook', () => {
  const originalMatchMedia = window.matchMedia;
  
  beforeEach(() => {
    // Reset matchMedia before each test
    window.matchMedia = originalMatchMedia;
  });

  it('should return false for desktop viewport', () => {
    // Mock matchMedia for desktop viewport
    window.matchMedia = vi.fn().mockImplementation((query) => {
      return {
        matches: false,
        media: query,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      };
    });
    
    // Mock window.innerWidth
    Object.defineProperty(window, 'innerWidth', { value: 1024, writable: true });
    
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);
  });

  it('should return true for mobile viewport', () => {
    // Mock matchMedia for mobile viewport
    window.matchMedia = vi.fn().mockImplementation((query) => {
      return {
        matches: true,
        media: query,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      };
    });
    
    // Mock window.innerWidth
    Object.defineProperty(window, 'innerWidth', { value: 320, writable: true });
    
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(true);
  });

  it('should update value when window size changes', () => {
    // Setup event listeners and callbacks
    let listener: Function | null = null;
    
    window.matchMedia = vi.fn().mockImplementation((query) => {
      return {
        matches: false,
        media: query,
        onchange: null,
        addEventListener: vi.fn((event, cb) => {
          listener = cb;
        }),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      };
    });
    
    // Start with desktop viewport
    Object.defineProperty(window, 'innerWidth', { value: 1024, writable: true });
    
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);
    
    // Change to mobile viewport
    act(() => {
      Object.defineProperty(window, 'innerWidth', { value: 320, writable: true });
      if (listener) listener();
    });
    
    expect(result.current).toBe(true);
  });
}); 