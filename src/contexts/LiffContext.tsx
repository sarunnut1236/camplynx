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
        console.log('🚀 Starting LIFF initialization...');
        const liffData = await initializeLiff();
        console.log('✅ LIFF initialization complete:', liffData);
        console.log('📱 Device info - OS:', liffData.os, 'Language:', liffData.language);
        console.log('🔐 Login status:', liffData.isLoggedIn ? 'Logged in' : 'Not logged in');
        console.log('🌐 Environment:', liffData.isInClient ? 'LINE App Browser' : 'External Browser');
        
        setIsLiffInitialized(true);
        setIsLoggedIn(liffData.isLoggedIn);
        setIsInClient(liffData.isInClient);
        setOs(liffData.os?.toString() || null);
        
        // Only try to get profile if user is logged in
        if (liffData.isLoggedIn) {
          console.log('👤 User is logged in, fetching profile...');
          await refreshProfile();
        } else {
          console.log('👤 User is not logged in, skipping profile fetch');
        }
      } catch (err) {
        console.error('❌ LIFF initialization error:', err);
        if (err instanceof Error) {
          console.error('Error details:', {
            message: err.message,
            stack: err.stack,
            name: err.name
          });
        }
        setError(err instanceof Error ? err : new Error(String(err)));
      }
    };

    initialize();
  }, []);

  // Function to refresh the user profile
  const refreshProfile = async () => {
    try {
      console.log('👤 Fetching LINE profile data...');
      const userProfile = await getLiffProfile();
      console.log('✅ LINE profile data fetched successfully:', userProfile);
      if (userProfile) {
        console.log('Profile details:', {
          userId: userProfile.userId,
          displayName: userProfile.displayName,
          pictureUrl: userProfile.pictureUrl ? 'Available' : 'Not available',
          statusMessage: userProfile.statusMessage || 'No status message'
        });
      } else {
        console.log('No profile data returned');
      }
      setProfile(userProfile);
    } catch (err) {
      console.error('❌ Error refreshing profile:', err);
      if (err instanceof Error) {
        console.error('Error details:', {
          message: err.message,
          stack: err.stack,
          name: err.name
        });
      }
      setError(err instanceof Error ? err : new Error(String(err)));
    }
  };

  // Handle login action
  const login = () => {
    console.log('🔑 Initiating LINE login...');
    liffLogin();
  };

  // Handle logout action
  const logout = () => {
    console.log('🚪 Logging out from LINE...');
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