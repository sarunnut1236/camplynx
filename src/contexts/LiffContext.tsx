import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { initializeLiff, getLiffProfile, liffLogin, liffLogout } from '@/lib/liff';
import { LiffProfile, LiffContextType } from '@/models/Liff';

// Create context with default values
const LiffContext = createContext<LiffContextType>({
  isLiffInitialized: false,
  isLoggedIn: false,
  isInClient: false,
  profile: null,
  os: null,
  error: null,
  login: () => {},
  logout: () => {},
  refreshProfile: async () => {},
});

// Custom hook for using the LIFF context
export const useLiff = () => useContext(LiffContext);

// Provider component to wrap your app with
export const LiffProvider = ({ children }: { children: ReactNode }) => {
  const [isLiffInitialized, setIsLiffInitialized] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isInClient, setIsInClient] = useState(false);
  const [profile, setProfile] = useState<LiffProfile | null>(null);
  const [os, setOs] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);

  // Initialize LIFF when the component mounts (app loads)
  useEffect(() => {
    const initialize = async () => {
      try {
        const liffData = await initializeLiff();
        
        setIsLiffInitialized(true);
        setIsLoggedIn(liffData.isLoggedIn);
        setIsInClient(liffData.isInClient);
        setOs(liffData.os?.toString() || null);
        
        // Only try to get profile if user is logged in
        if (liffData.isLoggedIn) {
          await refreshProfile();
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)));
      }
    };

    initialize();
  }, []);

  // Function to refresh the user profile
  const refreshProfile = async () => {
    try {
      const userProfile = await getLiffProfile();
      setProfile(userProfile);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    }
  };

  // Handle login action
  const login = () => {
    liffLogin();
  };

  // Handle logout action
  const logout = () => {
    liffLogout();
    setIsLoggedIn(false);
    setProfile(null);
  };

  // Create context value
  const contextValue: LiffContextType = {
    isLiffInitialized,
    isLoggedIn,
    isInClient,
    profile,
    os,
    error,
    login,
    logout,
    refreshProfile,
  };

  // Provide context to children
  return (
    <LiffContext.Provider value={contextValue}>
      {children}
    </LiffContext.Provider>
  );
}; 