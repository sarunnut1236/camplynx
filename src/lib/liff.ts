import liff from "@line/liff";
import { LiffProfile, LiffData } from "@/models/Liff";

// Get LIFF ID from environment variables
const LIFF_ID = import.meta.env.LIFF_ID;

// Define a function to initialize LIFF
export const initializeLiff = async (): Promise<LiffData> => {
  try {
    console.log('📋 LIFF initialization starting...');
    console.log('📋 Environment check:', { 
      isDev: import.meta.env.DEV,
      isProd: import.meta.env.PROD,
      mode: import.meta.env.MODE
    });
    
    if (!LIFF_ID) {
      console.error('❌ LIFF ID is missing in environment variables');
      throw new Error("LIFF ID is not defined. Make sure LIFF_ID is set in your environment variables.");
    }
    
    console.log("📋 Initializing LIFF with ID:", LIFF_ID);
    
    // Capture initialization time for performance logging
    const startTime = performance.now();
    
    await liff.init({
      liffId: LIFF_ID,
      withLoginOnExternalBrowser: true,
    });
    
    const endTime = performance.now();
    console.log(`📋 LIFF initialization successful (took ${(endTime - startTime).toFixed(2)}ms)`);
    
    const os = liff.getOS();
    const liffData = {
      isLoggedIn: liff.isLoggedIn(),
      isInClient: liff.isInClient(),
      os: os ? os.toString() : null,
      language: liff.getLanguage(),
      version: liff.getVersion(),
    };
    
    console.log('📋 LIFF context data:', liffData);
    
    if (liffData.isLoggedIn) {
      console.log('📋 User is logged in, token info available');
      try {
        // Access token is often useful for debugging
        const accessToken = liff.getAccessToken();
        console.log('📋 Access token available:', accessToken ? 'Yes (length: ' + accessToken.length + ')' : 'No');
      } catch (tokenError) {
        console.warn('⚠️ Could not retrieve access token:', tokenError);
      }
    } else {
      console.log('📋 User is not logged in, no token info available');
    }
    
    // Return useful information about the LIFF context
    return liffData;
  } catch (error) {
    console.error("❌ LIFF initialization failed:", error);
    console.error('Details:', {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : 'No stack trace',
      name: error instanceof Error ? error.name : 'Unknown error type'
    });
    throw error;
  }
};

// Function to get user profile information (only works when logged in)
export const getLiffProfile = async (): Promise<LiffProfile | null> => {
  try {
    console.log('👤 Attempting to get LINE profile...');
    
    if (!liff.isLoggedIn()) {
      console.warn("⚠️ User is not logged in. Cannot get profile.");
      return null;
    }
    
    console.log('👤 User is logged in, fetching profile data...');
    const profile = await liff.getProfile();
    console.log('👤 Profile successfully retrieved:', {
      userId: profile.userId ? `${profile.userId.slice(0, 5)}...` : 'Not available', // Only show part of ID for security
      displayName: profile.displayName,
      hasProfilePicture: !!profile.pictureUrl,
      hasStatusMessage: !!profile.statusMessage
    });
    return profile;
  } catch (error) {
    console.error("❌ Error getting LINE profile:", error);
    console.error('Details:', {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : 'No stack trace',
      name: error instanceof Error ? error.name : 'Unknown error type'
    });
    throw error;
  }
};

// Function to login with LINE
export const liffLogin = () => {
  console.log('🔑 Attempting LINE login...');
  if (!liff.isLoggedIn()) {
    console.log('🔑 User not logged in, redirecting to LINE login...');
    liff.login();
  } else {
    console.log("🔑 User is already logged in");
  }
};

// Function to logout
export const liffLogout = () => {
  console.log('🚪 Attempting LINE logout...');
  if (liff.isLoggedIn()) {
    console.log('🚪 User is logged in, proceeding with logout...');
    liff.logout();
    console.log('🚪 Logout successful, reloading page...');
    window.location.reload();
  } else {
    console.log("🚪 User is not logged in, cannot logout");
  }
};

export default liff;
