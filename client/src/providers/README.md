# Data Providers

This folder contains provider functions that abstract away the data access layer of the application. 

## Why Providers?

The provider pattern helps separate the UI components from the data fetching logic, making it easy to:

1. Replace mock data with real API calls in the future
2. Test components in isolation from data fetching
3. Reuse data fetching logic across multiple components

## Usage

Import the provider functions from the main providers export:

```typescript
import { getAllUsers, getUserById, getCampById } from '@/providers';
```

All provider functions are async and return promises, so you should use them with async/await:

```typescript
// Example in a React component
const MyComponent = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getAllUsers();
        setUsers(data);
      } catch (error) {
        console.error("Error loading users:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Rest of component...
}
```

## Future API Integration

When it's time to integrate with a real API, you will only need to update the provider functions, not the components that use them. For example:

```typescript
// Current implementation (mock data)
export const getAllUsers = async (): Promise<User[]> => {
  // Return mock data
  return mockUsers;
};

// Future implementation (real API)
export const getAllUsers = async (): Promise<User[]> => {
  // Make API call
  const response = await fetch('https://api.example.com/users');
  return response.json();
};
``` 