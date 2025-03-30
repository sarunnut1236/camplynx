import { Region, UserRole } from "@/enums/User";

// Define user interface
export interface User {
    id: string;
    firstname?: string;
    surname?: string;
    nickname?: string;
    email?: string;
    phone?: string;
    role: UserRole;
    region?: Region;
    joinedAt?: Date;
    profileImage?: string;
    birthdate?: Date;
    lineId?: string;
    foodAllergy?: string;
    personalMedicalCondition?: string;
    bio?: string;
    title?: string;
    memberCode?: string;
    jwtLiffUserId?: string;
  }