import { describe, it, expect } from 'vitest';
import { Camp, CampDay, Registration } from './Camp';

describe('Camp Model', () => {
  it('should create a valid Camp object', () => {
    const campDay: CampDay = {
      id: 'day-1',
      dayNumber: 1,
      date: '2024-01-01',
      activities: ['Morning Hike', 'Swimming']
    };

    const camp: Camp = {
      id: 'camp-1',
      name: 'Test Camp',
      description: 'A test camp',
      location: 'Test Location',
      startDate: '2024-01-01',
      endDate: '2024-01-03',
      imageUrl: 'http://example.com/image.jpg',
      days: [campDay]
    };

    expect(camp.id).toBe('camp-1');
    expect(camp.name).toBe('Test Camp');
    expect(camp.description).toBe('A test camp');
    expect(camp.location).toBe('Test Location');
    expect(camp.startDate).toBe('2024-01-01');
    expect(camp.endDate).toBe('2024-01-03');
    expect(camp.imageUrl).toBe('http://example.com/image.jpg');
    expect(camp.days.length).toBe(1);
    expect(camp.days[0]).toEqual(campDay);
  });

  it('should create a valid CampDay object', () => {
    const campDay: CampDay = {
      id: 'day-1',
      dayNumber: 1,
      date: '2024-01-01',
      activities: ['Morning Hike', 'Swimming', 'Campfire']
    };

    expect(campDay.id).toBe('day-1');
    expect(campDay.dayNumber).toBe(1);
    expect(campDay.date).toBe('2024-01-01');
    expect(campDay.activities.length).toBe(3);
    expect(campDay.activities).toContain('Morning Hike');
    expect(campDay.activities).toContain('Swimming');
    expect(campDay.activities).toContain('Campfire');
  });

  it('should create a valid Registration object', () => {
    const dayAvailability = {
      'day-1': true,
      'day-2': false,
      'day-3': true
    };

    const registration: Registration = {
      id: 'reg-1',
      userId: 'user-1',
      campId: 'camp-1',
      dayAvailability,
      registrationDate: '2024-01-01T12:00:00Z'
    };

    expect(registration.id).toBe('reg-1');
    expect(registration.userId).toBe('user-1');
    expect(registration.campId).toBe('camp-1');
    expect(registration.registrationDate).toBe('2024-01-01T12:00:00Z');
    expect(registration.dayAvailability).toEqual(dayAvailability);
    expect(registration.dayAvailability['day-1']).toBe(true);
    expect(registration.dayAvailability['day-2']).toBe(false);
    expect(registration.dayAvailability['day-3']).toBe(true);
  });
}); 