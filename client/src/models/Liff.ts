// Define LINE profile structure based on LINE LIFF documentation
export interface LiffProfile {
  userId: string;
  displayName: string;
  pictureUrl?: string;
  statusMessage?: string;
}

// Define LIFF context state and methods
export interface LiffContextType {
  isLiffInitialized: boolean;
  isLoggedIn: boolean;
  isInClient: boolean;
  profile: LiffProfile | null;
  os: string | null;
  error: Error | null;
  login: () => void;
  logout: () => void;
  refreshProfile: () => Promise<void>;
}

// LIFF initialization return data
export interface LiffData {
  isLoggedIn: boolean;
  isInClient: boolean;
  os?: string | null;
  language?: string;
  version?: string;
} 