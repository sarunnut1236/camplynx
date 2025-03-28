import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Welcome = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Automatically redirect to home page
  useEffect(() => {
    navigate('/home');
  }, [navigate]);

  // Just a loading screen while redirect happens
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
          <h1 className="text-3xl font-bold text-center text-gray-800">YNS Backoffice</h1>
          <p className="text-center text-gray-600 mt-2">Management System</p>
        </div>
        <div className="mt-4 text-center">
          <p>Redirecting to home page...</p>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
