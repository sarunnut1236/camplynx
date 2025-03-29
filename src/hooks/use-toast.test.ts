import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useToast, reducer } from './use-toast';

describe('useToast hook', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should return toast function and state', () => {
    const { result } = renderHook(() => useToast());
    expect(result.current).toHaveProperty('toast');
    expect(result.current).toHaveProperty('toasts');
    expect(result.current).toHaveProperty('dismiss');
  });

  it('should add a toast when toast function is called', () => {
    const { result } = renderHook(() => useToast());
    
    act(() => {
      result.current.toast({
        title: 'Test Toast',
        description: 'This is a test toast'
      });
    });
    
    expect(result.current.toasts.length).toBe(1);
    expect(result.current.toasts[0]?.title).toBe('Test Toast');
    expect(result.current.toasts[0]?.description).toBe('This is a test toast');
  });

  it('should dismiss a toast when dismiss function is called', () => {
    const { result } = renderHook(() => useToast());
    
    let toastId: string = '';
    
    // Add a toast
    act(() => {
      const { id } = result.current.toast({
        title: 'Test Toast',
        description: 'This is a test toast'
      });
      toastId = id;
    });
    
    expect(result.current.toasts.length).toBe(1);
    expect(result.current.toasts[0]?.open).toBe(true);
    
    // Dismiss the toast
    act(() => {
      result.current.dismiss(toastId);
    });
    
    // The toast should still be in the list but marked as closed
    expect(result.current.toasts.length).toBe(1);
    expect(result.current.toasts[0]?.open).toBe(false);
  });
});

describe('toast reducer', () => {
  it('should handle ADD_TOAST action', () => {
    const initialState = { toasts: [] };
    const toast = { id: '1', title: 'Test Toast', open: true };
    
    const newState = reducer(initialState, {
      type: 'ADD_TOAST',
      toast
    });
    
    expect(newState.toasts.length).toBe(1);
    expect(newState.toasts[0]).toEqual(toast);
  });
  
  it('should handle UPDATE_TOAST action', () => {
    const initialState = { 
      toasts: [{ id: '1', title: 'Original Toast', open: true }] 
    };
    
    const newState = reducer(initialState, {
      type: 'UPDATE_TOAST',
      toast: { id: '1', title: 'Updated Toast' }
    });
    
    expect(newState.toasts.length).toBe(1);
    expect(newState.toasts[0]?.title).toBe('Updated Toast');
    expect(newState.toasts[0]?.open).toBe(true);
  });
  
  it('should handle DISMISS_TOAST action', () => {
    const initialState = { 
      toasts: [{ id: '1', title: 'Toast', open: true }] 
    };
    
    const newState = reducer(initialState, {
      type: 'DISMISS_TOAST',
      toastId: '1'
    });
    
    expect(newState.toasts.length).toBe(1);
    expect(newState.toasts[0]?.open).toBe(false);
  });
  
  it('should handle REMOVE_TOAST action with specific ID', () => {
    const initialState = { 
      toasts: [
        { id: '1', title: 'Toast 1', open: true },
        { id: '2', title: 'Toast 2', open: true }
      ] 
    };
    
    const newState = reducer(initialState, {
      type: 'REMOVE_TOAST',
      toastId: '1'
    });
    
    expect(newState.toasts.length).toBe(1);
    expect(newState.toasts[0]?.id).toBe('2');
  });
  
  it('should handle REMOVE_TOAST action without ID', () => {
    const initialState = { 
      toasts: [
        { id: '1', title: 'Toast 1', open: true },
        { id: '2', title: 'Toast 2', open: true }
      ] 
    };
    
    const newState = reducer(initialState, {
      type: 'REMOVE_TOAST'
    });
    
    expect(newState.toasts.length).toBe(0);
  });
}); 