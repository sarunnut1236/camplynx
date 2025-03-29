import { describe, it, expect } from 'vitest';
import { User } from './User';
import { UserRole, Region } from '@/enums/User';

describe('User Model', () => {
  it('should create a valid user with minimal properties', () => {
    const user: User = {
      id: '1',
      role: UserRole.GUEST
    };
    
    expect(user.id).toBe('1');
    expect(user.role).toBe(UserRole.GUEST);
    expect(user.firstname).toBeUndefined();
    expect(user.email).toBeUndefined();
  });

  it('should create a user with all properties', () => {
    const now = new Date();
    const user: User = {
      id: '2',
      firstname: 'John',
      surname: 'Doe',
      nickname: 'JD',
      email: 'john@example.com',
      phone: '123456789',
      role: UserRole.ADMIN,
      region: Region.BKK,
      joinedAt: now,
      profileImage: '/profile.jpg',
      birthdate: now,
      lineId: 'johndoe',
      foodAllergy: 'None',
      personalMedicalCondition: 'None',
      bio: 'Test user',
      title: 'Mr.'
    };

    expect(user.id).toBe('2');
    expect(user.firstname).toBe('John');
    expect(user.surname).toBe('Doe');
    expect(user.nickname).toBe('JD');
    expect(user.email).toBe('john@example.com');
    expect(user.phone).toBe('123456789');
    expect(user.role).toBe(UserRole.ADMIN);
    expect(user.region).toBe(Region.BKK);
    expect(user.joinedAt).toBe(now);
    expect(user.profileImage).toBe('/profile.jpg');
    expect(user.birthdate).toBe(now);
    expect(user.lineId).toBe('johndoe');
    expect(user.foodAllergy).toBe('None');
    expect(user.personalMedicalCondition).toBe('None');
    expect(user.bio).toBe('Test user');
    expect(user.title).toBe('Mr.');
  });
}); 