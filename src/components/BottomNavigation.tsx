import { Link, useLocation } from 'react-router-dom';
import { Home, User, Calendar } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

const BottomNavigation = () => {
  const location = useLocation();
  const { t } = useTranslation();
  
  // Only hide on the welcome page which now auto-redirects
  if (location.pathname === '/') {
    return null;
  }

  return (
    <div className="bottom-nav z-50">
      <Link 
        to="/home" 
        className={cn("nav-item", location.pathname === '/home' && "active")}
      >
        <Home size={24} />
        <span className="text-xs mt-1">{t('navigation.home')}</span>
      </Link>
      
      <Link 
        to="/camps" 
        className={cn("nav-item", location.pathname.includes('/camps') && "active")}
      >
        <Calendar size={24} />
        <span className="text-xs mt-1">{t('navigation.camps')}</span>
      </Link>
      
      <Link 
        to="/profile" 
        className={cn("nav-item", location.pathname.includes('/profile') && "active")}
      >
        <User size={24} />
        <span className="text-xs mt-1">{t('navigation.profile')}</span>
      </Link>
    </div>
  );
};

export default BottomNavigation;
