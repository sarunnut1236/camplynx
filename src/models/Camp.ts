// Define camp day interface
export interface CampDay {
  id: string;
  dayNumber: number;
  date: string;
  activities: string[];
}

// Define camp interface
export interface Camp {
  id: string;
  name: string;
  description: string;
  location: string;
  startDate: string;
  endDate: string;
  imageUrl: string;
  days: CampDay[];
  ownerId?: string;  // ID of the admin who created the camp
}

// Define registration interface
export interface Registration {
  id: string;
  userId: string;
  campId: string;
  dayAvailability: { [dayId: string]: boolean };
  registrationDate: string;
} 