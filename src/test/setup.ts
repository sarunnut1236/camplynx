import '@testing-library/jest-dom';
import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';
import { vi } from 'vitest';
import React from 'react';

// Extend Vitest's expect method with methods from react-testing-library
expect.extend(matchers as any);

// Clean up after each test case (e.g. clearing jsdom)
afterEach(() => {
  cleanup();
});

// Mock react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    useLocation: () => ({ pathname: '/test' }),
  };
});

// Mock AuthContext
vi.mock('@/contexts/AuthContext', async () => {
  const actual = await vi.importActual('@/contexts/AuthContext');
  return {
    ...actual,
    useAuth: () => ({
      user: {
        id: '1',
        firstname: 'John',
        surname: 'Doe',
        email: 'john@example.com',
        role: 1,
      },
      isAuthenticated: true,
      hasPermission: () => true,
      login: vi.fn(),
      logout: vi.fn(),
      updateUser: vi.fn(),
    }),
  };
});

// Mock toast components
vi.mock('@/components/ui/toast', async () => {
  const actual = await vi.importActual('@/components/ui/toast');
  return {
    ...actual,
    useToast: () => ({ toast: vi.fn() }),
  };
});

// Mock CampContext
vi.mock('@/contexts/CampContext', async () => {
  const actual = await vi.importActual('@/contexts/CampContext');
  return {
    ...actual,
    useCamp: () => ({
      camps: [],
      registrations: [],
      selectedCamp: null,
      createCamp: vi.fn(),
      updateCamp: vi.fn(),
      deleteCamp: vi.fn(),
      registerForCamp: vi.fn(),
      updateRegistration: vi.fn(),
      getUserRegistrations: () => [],
      getCampById: () => undefined,
      getRegistrationById: () => undefined,
      getRegistrationByCampAndUser: () => undefined,
    }),
  };
});

// Mock translation
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: any) => {
      // Simple mock implementation that returns the key
      if (options?.name) {
        return `Hello, ${options.name}`;
      }
      return key;
    },
    i18n: {
      language: 'en',
      changeLanguage: vi.fn(),
    },
  }),
  Trans: ({ children }: { children: React.ReactNode }) => children,
}));

// Make sure resizeObserver mock is available
class ResizeObserverMock {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}

window.ResizeObserver = ResizeObserverMock;

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
}); 