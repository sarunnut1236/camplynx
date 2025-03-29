import { Link } from 'react-router-dom';
import { Search, Calendar, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import PageHeader from '@/components/PageHeader';
import { useAuth } from '@/contexts/AuthContext';
import { useCamp } from '@/contexts/CampContext';
import { useTranslation } from 'react-i18next';

const Home = () => {
  const { user } = useAuth();
  const { camps } = useCamp();
  const { t } = useTranslation();
  
  // Get upcoming camps (for demo purposes, just using all camps)
  const upcomingCamps = camps.slice(0, 3);

  return (
    <div className="page-container pb-20">
      <PageHeader 
        title={t('navigation.home')} 
        showBackButton={false}
      />
      
      {/* Logo */}
      <div className="flex justify-center mb-6">
        <img 
          src="/yns-logo.png" 
          alt={t('app.logoAlt')}
          className="h-20"
        />
      </div>
      
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            type="text"
            placeholder={t('home.searchPlaceholder')}
            className="pl-10"
          />
        </div>
      </div>
      
      {/* User greeting */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold">
          {t('home.hello', { name: user?.firstname })}
        </h2>
        <p className="text-gray-600">{t('home.welcome')}</p>
      </div>
      
      {/* Upcoming activities */}
      <div className="mb-8">
        <h3 className="text-lg font-medium mb-4">{t('home.upcomingActivities')}</h3>
        
        {upcomingCamps.map((camp) => (
          <Link 
            key={camp.id}
            to={`/camps/${camp.id}`}
            className="camp-card flex mb-4 hover:shadow-lg transition-shadow"
          >
            <div className="w-1/3">
              <img 
                src={camp.imageUrl} 
                alt={camp.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="w-2/3 p-3">
              <h4 className="font-medium">{camp.name}</h4>
              <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                {camp.description}
              </p>
              <div className="flex items-center text-xs text-gray-500">
                <Calendar size={14} className="mr-1" />
                <span>
                  {new Date(camp.startDate).toLocaleDateString()} - {new Date(camp.endDate).toLocaleDateString()}
                </span>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2 text-xs"
              >
                {t('home.registerNow')}
              </Button>
            </div>
          </Link>
        ))}
        
        <Link to="/camps" className="text-camp-primary text-sm font-medium flex items-center">
          {t('home.seeAllCamps')}
        </Link>
      </div>
      
      {/* Quick actions */}
      <div>
        <h3 className="text-lg font-medium mb-4">{t('home.quickActions')}</h3>
        <div className="grid grid-cols-2 gap-4">
          <Link 
            to="/profile" 
            className="bg-camp-light rounded-lg p-4 flex flex-col items-center justify-center text-center hover:bg-opacity-80 transition-colors"
          >
            <div className="bg-white p-3 rounded-full mb-2">
              <User size={24} className="text-camp-primary" />
            </div>
            <span className="font-medium">{t('home.manageProfile')}</span>
          </Link>
          
          <Link 
            to="/camps" 
            className="bg-camp-light rounded-lg p-4 flex flex-col items-center justify-center text-center hover:bg-opacity-80 transition-colors"
          >
            <div className="bg-white p-3 rounded-full mb-2">
              <Calendar size={24} className="text-camp-primary" />
            </div>
            <span className="font-medium">{t('home.viewCamps')}</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
