import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { 
  getAllCamps, 
  getCampById, 
  createCamp, 
  updateCamp, 
  deleteCamp, 
  getAllRegistrations,
  getUserRegistrations,
  getRegistrationById,
  getRegistrationByCampAndUser,
  registerForCamp,
  updateRegistration
} from './index';
import { Camp, Registration } from '@/models';

describe('Camp Providers', () => {
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

  describe('getAllCamps', () => {
    it('should return mock data when localStorage is empty', async () => {
      const camps = await getAllCamps();
      expect(camps.length).toBeGreaterThan(0);
      expect(camps[0]?.name).toBeDefined();
    });

    it('should return data from localStorage when available', async () => {
      const mockCamp: Camp = {
        id: 'test-1',
        name: 'Test Camp',
        description: 'A test camp from localStorage',
        location: 'Test Location',
        startDate: '2024-01-01',
        endDate: '2024-01-03',
        imageUrl: 'http://example.com/image.jpg',
        days: []
      };
      
      localStorage.setItem('yns_camps', JSON.stringify([mockCamp]));

      const camps = await getAllCamps();
      expect(camps.length).toBe(1);
      expect(camps[0]?.name).toBe('Test Camp');
      expect(camps[0]?.description).toBe('A test camp from localStorage');
    });
  });

  describe('getCampById', () => {
    it('should return a camp by its ID', async () => {
      const mockCamp: Camp = {
        id: 'test-id',
        name: 'Test Camp',
        description: 'A test camp',
        location: 'Test Location',
        startDate: '2024-01-01',
        endDate: '2024-01-03',
        imageUrl: 'http://example.com/image.jpg',
        days: []
      };
      
      localStorage.setItem('yns_camps', JSON.stringify([mockCamp]));

      const camp = await getCampById('test-id');
      expect(camp).toBeDefined();
      expect(camp?.id).toBe('test-id');
      expect(camp?.name).toBe('Test Camp');
    });

    it('should return undefined for non-existent camp ID', async () => {
      const camp = await getCampById('non-existent-id');
      expect(camp).toBeUndefined();
    });
  });

  describe('createCamp', () => {
    it('should create a new camp and store it in localStorage', async () => {
      const campData = {
        name: 'New Camp',
        description: 'A newly created camp',
        location: 'New Location',
        startDate: '2024-01-01',
        endDate: '2024-01-03',
        imageUrl: 'http://example.com/image.jpg',
        days: []
      };

      const newCamp = await createCamp(campData);
      expect(newCamp).toBeDefined();
      expect(newCamp.id).toBeDefined();
      expect(newCamp.name).toBe('New Camp');
      
      // Verify it was stored in localStorage
      expect(localStorage.setItem).toHaveBeenCalled();
    });
  });

  describe('updateCamp', () => {
    it('should update an existing camp', async () => {
      const mockCamp: Camp = {
        id: 'update-id',
        name: 'Camp to Update',
        description: 'Original description',
        location: 'Original location',
        startDate: '2024-01-01',
        endDate: '2024-01-03',
        imageUrl: 'http://example.com/image.jpg',
        days: []
      };
      
      localStorage.setItem('yns_camps', JSON.stringify([mockCamp]));

      const updatedCamp = await updateCamp('update-id', {
        description: 'Updated description',
        location: 'Updated location'
      });

      expect(updatedCamp).toBeDefined();
      expect(updatedCamp?.id).toBe('update-id');
      expect(updatedCamp?.name).toBe('Camp to Update');
      expect(updatedCamp?.description).toBe('Updated description');
      expect(updatedCamp?.location).toBe('Updated location');
    });

    it('should return undefined when updating non-existent camp', async () => {
      const updatedCamp = await updateCamp('non-existent-id', {
        name: 'Updated name'
      });

      expect(updatedCamp).toBeUndefined();
    });
  });

  describe('deleteCamp', () => {
    it('should delete a camp and its registrations', async () => {
      const mockCamp: Camp = {
        id: 'delete-id',
        name: 'Camp to Delete',
        description: 'To be deleted',
        location: 'Location',
        startDate: '2024-01-01',
        endDate: '2024-01-03',
        imageUrl: 'http://example.com/image.jpg',
        days: []
      };
      
      const mockRegistration: Registration = {
        id: 'reg-1',
        userId: 'user-1',
        campId: 'delete-id',
        dayAvailability: {},
        registrationDate: '2024-01-01T12:00:00Z'
      };

      localStorage.setItem('yns_camps', JSON.stringify([mockCamp]));
      localStorage.setItem('yns_registrations', JSON.stringify([mockRegistration]));

      const result = await deleteCamp('delete-id');
      expect(result).toBe(true);
      
      // Verify camp was removed
      const camps = await getAllCamps();
      expect(camps.length).toBe(0);
      
      // Verify registrations were removed
      const registrations = await getAllRegistrations();
      expect(registrations.length).toBe(0);
    });
  });

  describe('Registration functions', () => {
    const mockRegistration: Registration = {
      id: 'reg-id',
      userId: 'user-id',
      campId: 'camp-id',
      dayAvailability: {'day-1': true, 'day-2': false},
      registrationDate: '2024-01-01T12:00:00Z'
    };

    beforeEach(() => {
      localStorage.setItem('yns_registrations', JSON.stringify([mockRegistration]));
    });

    it('should get all registrations', async () => {
      const registrations = await getAllRegistrations();
      expect(registrations.length).toBe(1);
      expect(registrations[0]?.id).toBe('reg-id');
    });

    it('should get registrations by user ID', async () => {
      const registrations = await getUserRegistrations('user-id');
      expect(registrations.length).toBe(1);
      expect(registrations[0]?.id).toBe('reg-id');
      expect(registrations[0]?.userId).toBe('user-id');
    });

    it('should get registration by ID', async () => {
      const registration = await getRegistrationById('reg-id');
      expect(registration).toBeDefined();
      expect(registration?.id).toBe('reg-id');
    });

    it('should get registration by camp and user', async () => {
      const registration = await getRegistrationByCampAndUser('camp-id', 'user-id');
      expect(registration).toBeDefined();
      expect(registration?.campId).toBe('camp-id');
      expect(registration?.userId).toBe('user-id');
    });

    it('should register a user for a camp', async () => {
      const dayAvailability = {'day-3': true, 'day-4': true};
      
      const registration = await registerForCamp('new-user', 'camp-id', dayAvailability);
      expect(registration).toBeDefined();
      expect(registration?.userId).toBe('new-user');
      expect(registration?.campId).toBe('camp-id');
      expect(registration?.dayAvailability).toEqual(dayAvailability);
      
      // Verify it was stored in localStorage
      expect(localStorage.setItem).toHaveBeenCalled();
    });

    it('should not register if already registered', async () => {
      const result = await registerForCamp('user-id', 'camp-id', {});
      expect(result).toBeUndefined();
    });

    it('should update registration', async () => {
      const newAvailability = {'day-1': false, 'day-2': true};
      
      const updated = await updateRegistration('reg-id', newAvailability);
      expect(updated).toBeDefined();
      expect(updated?.id).toBe('reg-id');
      expect(updated?.dayAvailability).toEqual(newAvailability);
    });

    it('should return undefined when updating non-existent registration', async () => {
      const updated = await updateRegistration('non-existent', {});
      expect(updated).toBeUndefined();
    });
  });
}); 