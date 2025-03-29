import { describe, it, expect } from 'vitest';
import { LiffProfile, LiffContextType, LiffData } from './Liff';

describe('Liff Models', () => {
  it('should have the correct LiffProfile interface structure', () => {
    const profile: LiffProfile = {
      userId: 'test-user-id',
      displayName: 'Test User',
      pictureUrl: 'https://example.com/profile.jpg',
      statusMessage: 'Testing LINE Profile'
    };

    expect(profile.userId).toBe('test-user-id');
    expect(profile.displayName).toBe('Test User');
    expect(profile.pictureUrl).toBe('https://example.com/profile.jpg');
    expect(profile.statusMessage).toBe('Testing LINE Profile');
  });

  it('should have the correct LiffContextType interface structure', () => {
    const mockLogin = () => {};
    const mockLogout = () => {};
    const mockRefreshProfile = async () => {};

    const contextType: LiffContextType = {
      isLiffInitialized: true,
      isLoggedIn: true,
      isInClient: false,
      profile: null,
      os: 'android',
      error: null,
      login: mockLogin,
      logout: mockLogout,
      refreshProfile: mockRefreshProfile
    };

    expect(contextType.isLiffInitialized).toBe(true);
    expect(contextType.isLoggedIn).toBe(true);
    expect(contextType.isInClient).toBe(false);
    expect(contextType.profile).toBeNull();
    expect(contextType.os).toBe('android');
    expect(contextType.error).toBeNull();
    expect(typeof contextType.login).toBe('function');
    expect(typeof contextType.logout).toBe('function');
    expect(typeof contextType.refreshProfile).toBe('function');
  });

  it('should have the correct LiffData interface structure', () => {
    const liffData: LiffData = {
      isLoggedIn: true,
      isInClient: false,
      os: 'ios',
      language: 'en',
      version: '2.5.0'
    };

    expect(liffData.isLoggedIn).toBe(true);
    expect(liffData.isInClient).toBe(false);
    expect(liffData.os).toBe('ios');
    expect(liffData.language).toBe('en');
    expect(liffData.version).toBe('2.5.0');
  });
}); 