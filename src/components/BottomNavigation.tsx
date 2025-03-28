
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, User, Calendar, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

const BottomNavigation = () => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  
  // Don't show bottom nav on welcome screen
  if (!isAuthenticated || location.pathname === '/') {
    return null;
  }

  return (
    <div className="bottom-nav">
      <Link 
        to="/home" 
        className={cn("nav-item", location.pathname === '/home' && "active")}
      >
        <Home size={24} />
        <span className="text-xs mt-1">Home</span>
      </Link>
      
      <Link 
        to="/camps" 
        className={cn("nav-item", location.pathname.includes('/camps') && "active")}
      >
        <Calendar size={24} />
        <span className="text-xs mt-1">Camps</span>
      </Link>
      
      <Link 
        to="/profile" 
        className={cn("nav-item", location.pathname.includes('/profile') && "active")}
      >
        <User size={24} />
        <span className="text-xs mt-1">Profile</span>
      </Link>
      
      <Link 
        to="/settings" 
        className={cn("nav-item", location.pathname === '/settings' && "active")}
      >
        <Settings size={24} />
        <span className="text-xs mt-1">Settings</span>
      </Link>
    </div>
  );
};

export default BottomNavigation;
