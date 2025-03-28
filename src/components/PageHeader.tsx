import React from 'react';
import { ArrowLeft, User } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

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
  
  // Don't show back button on main screens
  const hideBackByDefault = ['/home', '/camps', '/profile'];

  return (
    <div className="flex items-center justify-between py-4 mb-4">
      <div className="flex items-center">
        {showBackButton && !hideBackByDefault.includes(location.pathname) && (
          <button 
            onClick={() => navigate(-1)}
            className="mr-3 text-gray-600"
            aria-label="Go back"
          >
            <ArrowLeft size={20} />
          </button>
        )}
        <h1 className="text-xl font-semibold">{title}</h1>
      </div>
      
      {showProfileButton && user && (
        <Link to="/profile" className="flex items-center">
          {user.profileImage ? (
            <img 
              src={user.profileImage} 
              alt={user.name}
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-camp-light flex items-center justify-center">
              <User size={16} className="text-camp-primary" />
            </div>
          )}
        </Link>
      )}
    </div>
  );
};

export default PageHeader;
