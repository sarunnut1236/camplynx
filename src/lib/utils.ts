import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Prevent default touch behavior to make the app feel more native
 */
export function preventDefaultTouchMove(element: HTMLElement | null): () => void {
  if (!element) return () => {};
  
  const preventTouchMove = (e: TouchEvent) => {
    // Only prevent horizontal scrolling
    const touchStartX = e.touches[0].clientX;
    const touchMoveX = e.changedTouches[0].clientX;
    const deltaX = Math.abs(touchMoveX - touchStartX);
    
    if (deltaX > 10) { // Only prevent if horizontal movement is significant
      e.preventDefault();
    }
  };

  element.addEventListener('touchmove', preventTouchMove, { passive: false });
  
  // Return cleanup function
  return () => {
    element.removeEventListener('touchmove', preventTouchMove);
  };
}

/**
 * Applies mobile app behaviors to the application
 */
export function setupMobileAppBehavior(): void {
  // Prevent double-tap zoom
  document.addEventListener('touchend', (e) => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;
    
    if (now - (window as any).lastTouchEnd < DOUBLE_TAP_DELAY) {
      e.preventDefault();
    }
    (window as any).lastTouchEnd = now;
  }, { passive: false });
  
  // Disable bounce effect on iOS
  document.body.addEventListener('touchmove', (e) => {
    if (e.touches.length > 1) {
      e.preventDefault();
    }
  }, { passive: false });
  
  // Add safe area insets for iOS notches
  const updateSafeAreaInsets = () => {
    document.documentElement.style.setProperty(
      '--safe-area-inset-top', 
      `${window.visualViewport?.offsetTop || 0}px`
    );
    
    document.documentElement.style.setProperty(
      '--safe-area-inset-bottom', 
      `${Math.max(0, window.innerHeight - (window.visualViewport?.height || 0) - (window.visualViewport?.offsetTop || 0))}px`
    );
  };
  
  updateSafeAreaInsets();
  window.visualViewport?.addEventListener('resize', updateSafeAreaInsets);
}
