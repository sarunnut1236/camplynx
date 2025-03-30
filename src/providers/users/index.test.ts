import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  getAllUsers,
  getUserById,
  getUserByEmail,
  updateUser,
  createDefaultUser
} from './index';
import { UserRole } from '@/enums/User';

describe('User Providers', () => {
  // Mock localStorage
  const mockLocalStorage = (() => {
    let store: Record<string, string> = {};
    return {
      getItem: vi.fn((key: string) => store[key] || null),
      setItem: vi.fn((key: string, value: string) => {
        store[key] = value;
      }),
      clear: vi.fn(() => {
        store = {};
      })
    };
  })();

  // Setup mocks
  beforeEach(() => {
    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage
    });
    mockLocalStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('getAllUsers', () => {
    it('should return mock users data', async () => {
      const users = await getAllUsers();
      expect(users.length).toBeGreaterThan(0);
      expect(users[0]?.firstname).toBeDefined();
    });
  });

  describe('getUserById', () => {
    it('should return a user by their ID', async () => {
      // First get all users to access a valid ID
      const allUsers = await getAllUsers();
      
      // Skip test if no users available
      if (allUsers.length === 0) {
        console.warn('Test skipped: No users found in mock data');
        return;
      }
      
      const userId = allUsers[0]!.id;
      const userFirstname = allUsers[0]!.firstname;
      
      const user = await getUserById(userId);
      expect(user).toBeDefined();
      expect(user?.id).toBe(userId);
      expect(user?.firstname).toBe(userFirstname);
    });

    it('should return undefined for non-existent user ID', async () => {
      const user = await getUserById('non-existent-id');
      expect(user).toBeUndefined();
    });
  });

  describe('getUserByEmail', () => {
    it('should return a user by their email', async () => {
      // First get all users to access a valid email
      const allUsers = await getAllUsers();
      const userWithEmail = allUsers.find(u => u.email);
      
      if (userWithEmail && userWithEmail.email) {
        const user = await getUserByEmail(userWithEmail.email);
        expect(user).toBeDefined();
        expect(user?.id).toBe(userWithEmail.id);
        expect(user?.email).toBe(userWithEmail.email);
      } else {
        // Skip test if no user with email found
        console.warn('Test skipped: No user with email found in mock data');
      }
    });

    it('should return undefined for non-existent email', async () => {
      const user = await getUserByEmail('non-existent@example.com');
      expect(user).toBeUndefined();
    });
  });

  describe('updateUser', () => {
    it('should update an existing user', async () => {
      // First get all users to access a valid ID
      const allUsers = await getAllUsers();
      
      // Skip test if no users available
      if (allUsers.length === 0) {
        console.warn('Test skipped: No users found in mock data');
        return;
      }
      
      const userId = allUsers[0]!.id;
      
      const updatedUser = await updateUser(userId, {
        firstname: 'Updated Name',
        surname: 'Updated Surname'
      });

      expect(updatedUser).toBeDefined();
      expect(updatedUser?.id).toBe(userId);
      expect(updatedUser?.firstname).toBe('Updated Name');
      expect(updatedUser?.surname).toBe('Updated Surname');
    });

    it('should return undefined when updating non-existent user', async () => {
      const updatedUser = await updateUser('non-existent-id', {
        firstname: 'Updated name'
      });

      expect(updatedUser).toBeUndefined();
    });
  });

  describe('createDefaultUser', () => {
    it('should create a default user with specified firstname', () => {
      const firstname = 'New User';
      const newUser = createDefaultUser(firstname);
      
      expect(newUser).toBeDefined();
      expect(newUser.id).toBeDefined();
      expect(newUser.firstname).toBe(firstname);
      expect(newUser.role).toBe(UserRole.GUEST);
    });
    
    it('should create a default user with firstname and email', () => {
      const firstname = 'New User';
      const email = 'new@example.com';
      const newUser = createDefaultUser(firstname, email);
      
      expect(newUser).toBeDefined();
      expect(newUser.id).toBeDefined();
      expect(newUser.firstname).toBe(firstname);
      expect(newUser.email).toBe(email);
      expect(newUser.role).toBe(UserRole.GUEST);
    });
  });
}); 