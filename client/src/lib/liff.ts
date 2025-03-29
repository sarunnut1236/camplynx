import liff from "@line/liff";
import { LiffProfile, LiffData } from "@/models/Liff";

// Get LIFF ID from environment variables
const VITE_LIFF_ID = import.meta.env.VITE_LIFF_ID;

// Define a function to initialize LIFF using Promise approach
export const initializeLiff = (): Promise<LiffData> => {
  if (!VITE_LIFF_ID) {
    return Promise.reject(new Error("LIFF ID is not defined. Make sure VITE_LIFF_ID is set in your environment variables."));
  }
  
  return liff.init({
    liffId: VITE_LIFF_ID,
    withLoginOnExternalBrowser: true,
  })
  .then(() => {
    return liff.ready;
  })
  .then(() => {
    if(!liff.isLoggedIn()) {
      liff.login();
    }
    const os = liff.getOS();
    const liffData = {
      isLoggedIn: liff.isLoggedIn(),
      isInClient: liff.isInClient(),
      os: os ? os.toString() : null,
      language: liff.getLanguage(),
      version: liff.getVersion(),
    };
    
    // Return useful information about the LIFF context
    return liffData;
  })
  .catch((error) => {
    throw error;
  });
};

// Function to get user profile information (only works when logged in)
export const getLiffProfile = (): Promise<LiffProfile | null> => {
  if (!liff.isLoggedIn()) {
    return Promise.resolve(null);
  }
  
  return liff.getProfile()
    .then(profile => {
      return profile;
    })
    .catch(error => {
      throw error;
    });
};

// Function to login with LINE
export const liffLogin = () => {
  if (!liff.isLoggedIn()) {
    liff.login();
  }
};

// Function to logout
export const liffLogout = () => {
  if (liff.isLoggedIn()) {
    liff.logout();
    window.location.reload();
  }
};

export default liff;
