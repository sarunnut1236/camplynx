import React, { ReactElement } from 'react';
import { render, RenderOptions, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

// Mock providers to avoid dependency on the real ones
const MockToastProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  return <div data-testid="toast-provider">{children}</div>;
};

const MockAuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  return <div data-testid="auth-provider">{children}</div>;
};

const MockCampProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  return <div data-testid="camp-provider">{children}</div>;
};

// Create a wrapper with all providers needed for testing
const AllProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <MemoryRouter>
      <MockToastProvider>
        <MockAuthProvider>
          <MockCampProvider>
            {children}
          </MockCampProvider>
        </MockAuthProvider>
      </MockToastProvider>
    </MemoryRouter>
  );
};

// Custom render method that includes providers
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllProviders, ...options });

// Re-export everything from testing-library
export * from '@testing-library/react';
export { screen, fireEvent, waitFor };

// Override render method
export { customRender as render }; 