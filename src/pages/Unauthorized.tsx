
import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Unauthorized = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="text-center max-w-md">
        <div className="bg-red-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
          <ShieldAlert size={40} className="text-red-500" />
        </div>
        
        <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
        
        <p className="text-gray-600 mb-6">
          You don't have permission to access this page. Please contact an administrator if you believe this is an error.
        </p>
        
        <div className="space-y-3">
          <Link to="/home">
            <Button className="w-full">
              Return to Home
            </Button>
          </Link>
          
          <Link to="/profile">
            <Button variant="outline" className="w-full">
              Go to Profile
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
