import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Index from './Index';

describe('Index Page', () => {
  it('renders the welcome message', () => {
    render(<Index />);
    
    expect(screen.getByText('Welcome to Your Blank App')).toBeInTheDocument();
    expect(screen.getByText('Start building your amazing project here!')).toBeInTheDocument();
  });
  
  it('has the correct styling', () => {
    const { container } = render(<Index />);
    
    // Check that the container has min-h-screen class
    const mainDiv = container.firstChild as HTMLElement;
    expect(mainDiv).toHaveClass('min-h-screen');
    expect(mainDiv).toHaveClass('flex');
    expect(mainDiv).toHaveClass('items-center');
    expect(mainDiv).toHaveClass('justify-center');
    expect(mainDiv).toHaveClass('bg-gray-100');
    
    // Check inner text container
    const textContainer = mainDiv.firstChild as HTMLElement;
    expect(textContainer).toHaveClass('text-center');
  });
  
  it('uses appropriate heading hierarchy', () => {
    render(<Index />);
    
    // Check that h1 is used for main heading
    const heading = screen.getByText('Welcome to Your Blank App');
    expect(heading.tagName).toBe('H1');
    
    // Check that the subtext is a paragraph
    const subtext = screen.getByText('Start building your amazing project here!');
    expect(subtext.tagName).toBe('P');
  });
}); 