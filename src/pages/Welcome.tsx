
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth, User } from '@/contexts/AuthContext';

const Welcome = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // For demo purposes, we'll just log in with a default user
    // In a real app, you would validate the email against a database
    setTimeout(() => {
      const demoUser: User = {
        id: '1',
        name: 'Jane Cooper',
        email: email,
        role: 'admin',
        profileImage: '/lovable-uploads/439db2b7-c4d3-4bd9-ab25-68e85d686991.png'
      };
      
      login(demoUser);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-b from-white to-camp-light">
      <div className="w-full max-w-md flex flex-col items-center">
        <div className="mb-12 animate-fade-in">
          <div className="flex items-center justify-center mb-4">
            <div className="w-20 h-20 bg-camp-primary rounded-lg flex items-center justify-center">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                className="w-12 h-12 text-white"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M17 14c.889-.889 1.438-1.438 1.72-2.046a4 4 0 0 0 0-3.908C18.437 7.438 17.89 6.89 17 6" />
                <path d="M11 6c-.889.889-1.438 1.438-1.72 2.046a4 4 0 0 0 0 3.908c.282.608.83 1.157 1.72 2.046" />
                <path d="M8 17a2 2 0 1 1 3.913.652" />
                <path d="M21 17a2 2 0 1 1-3.913.652" />
                <path d="M12 4v2" />
                <path d="M2 9h2" />
                <path d="M14 4v2" />
                <path d="M4 9h2" />
              </svg>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-center text-gray-800">CampLynx</h1>
          <p className="text-center text-gray-600 mt-2">Camp Management App</p>
        </div>

        <div className="w-full bg-white rounded-lg shadow-md p-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <h2 className="text-xl font-semibold mb-6 text-center">Welcome Back!</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value="password" // Prefilled for demo
                readOnly
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-camp-primary hover:bg-camp-secondary"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-4">
            For demo purposes, any email will work.
          </p>
        </div>
        
        <div className="mt-8 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <p className="text-center text-gray-600">Tap to continue to the home screen</p>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
