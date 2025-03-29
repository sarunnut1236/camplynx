// Define user roles
export enum UserRole {
    ADMIN = '2',
    JOINER = '1',
    GUEST = '0'
}

// Add display method for UserRole
export const getUserRoleDisplay = (role: UserRole): string => {
    switch (role) {
        case UserRole.ADMIN:
            return 'Admin';
        case UserRole.JOINER:
            return 'Joiner';
        case UserRole.GUEST:
            return 'Guest';
        default:
            return 'Unknown';
    }
};

// Define region type
export enum Region {
    BKK = 'BKK',
    EAST = 'EAST',
    CEN = 'CEN',
    PARI = 'PARI'
}
