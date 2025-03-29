import { Link } from 'react-router-dom';
import { Plus, Calendar, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PageHeader from '@/components/PageHeader';
import { useCamp } from '@/contexts/CampContext';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/enums/User';
import { useTranslation } from 'react-i18next';

// Pure function that doesn't use hooks
const formatDate = (date: Date, language: string): string => {
  const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
  return date.toLocaleDateString(language, options);
};

const Camps = () => {
  const { camps } = useCamp();
  const { user, hasPermission } = useAuth();
  const { t, i18n } = useTranslation();
  const isAdmin = hasPermission(UserRole.ADMIN);

  // Move the date formatting logic inside the component
  const formatDateRange = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return `${formatDate(start, i18n.language)} - ${formatDate(end, i18n.language)}`;
  };

  return (
    <div className="page-container pb-20 min-h-screen">
      <PageHeader 
        title={t('camps.title')} 
        showBackButton={false}
      />
      
      {isAdmin && (
        <div className="mb-6">
          <Link to="/camps/create">
            <Button className="w-full bg-camp-primary hover:bg-camp-secondary flex items-center justify-center">
              <Plus size={18} className="mr-2" />
              {t('camps.createNew')}
            </Button>
          </Link>
        </div>
      )}
      
      <div className="space-y-6">
        {camps.length === 0 ? (
          <div className="text-center py-10">
            <Calendar size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-500">{t('camps.noCamps')}</h3>
            <p className="text-gray-400 mt-2">{t('camps.checkLater')}</p>
          </div>
        ) : (
          camps.map((camp) => (
            <Link 
              key={camp.id} 
              to={`/camps/${camp.id}`}
              className="camp-card block hover:shadow-lg transition-shadow"
            >
              <img 
                src={camp.imageUrl} 
                alt={t('camps.campImageAlt', { name: camp.name })}
                className="camp-image"
              />
              <div className="camp-content">
                <h3 className="camp-title">{camp.name}</h3>
                <p className="camp-description line-clamp-2">{camp.description}</p>
                
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <Calendar size={16} className="mr-1" />
                  <span>{formatDateRange(camp.startDate, camp.endDate)}</span>
                </div>
                
                <div className="flex items-center text-sm text-gray-500">
                  <MapPin size={16} className="mr-1" />
                  <span>{camp.location}</span>
                </div>
                
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-sm font-medium">
                    {camp.days.length} {t(camp.days.length === 1 ? 'camps.day' : 'camps.days')}
                  </span>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-camp-primary border-camp-primary hover:bg-camp-light"
                  >
                    {t('camps.viewDetails')}
                  </Button>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default Camps;
