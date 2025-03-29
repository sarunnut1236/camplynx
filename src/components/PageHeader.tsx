import React from 'react';
import { ArrowLeft, User } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { useLiff } from '@/contexts/LiffContext';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface PageHeaderProps {
  title: string;
  showBackButton?: boolean;
  showProfileButton?: boolean;
}

const PageHeader: React.FC<PageHeaderProps> = ({ 
  title, 
  showBackButton = true,
  showProfileButton = true
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { profile, isLoggedIn } = useLiff();
  const { t } = useTranslation();
  
  // Don't show back button on main screens
  const hideBackByDefault = ['/home', '/camps', '/profile'];

  return (
    <div className="flex items-center justify-between py-4 mb-4">
      <div className="flex items-center">
        {showBackButton && !hideBackByDefault.includes(location.pathname) && (
          <button 
            onClick={() => navigate(-1)}
            className="mr-3 text-gray-600 hover:text-gray-900 transition-colors"
            aria-label={t('navigation.goBack')}
          >
            <ArrowLeft size={20} />
          </button>
        )}
        <h1 className="text-xl font-semibold">{title}</h1>
      </div>
      
      {showProfileButton && user && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link to="/profile" className="flex items-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-camp-primary rounded-full">
                {profile?.pictureUrl ? (
                  <div className="relative w-9 h-9 rounded-full overflow-hidden border-2 border-camp-light hover:border-camp-primary transition-all">
                    <img 
                      src={profile.pictureUrl} 
                      alt={profile.displayName || user.firstname}
                      className="w-full h-full object-cover"
                    />
                    {isLoggedIn && (
                      <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border border-white"></div>
                    )}
                  </div>
                ) : user.profileImage ? (
                  <div className="relative w-9 h-9 rounded-full overflow-hidden border-2 border-camp-light hover:border-camp-primary transition-all">
                    <img 
                      src={user.profileImage} 
                      alt={user.firstname}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-9 h-9 rounded-full bg-camp-light hover:bg-camp-primary/10 flex items-center justify-center border-2 border-camp-light hover:border-camp-primary transition-all">
                    <User size={16} className="text-camp-primary" />
                  </div>
                )}
              </Link>
            </TooltipTrigger>
            <TooltipContent>
              <p>{profile?.displayName || `${user.firstname} ${user.surname}`}</p>
              <p className="text-xs text-gray-500">{t('navigation.viewProfile')}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
};

export default PageHeader;
