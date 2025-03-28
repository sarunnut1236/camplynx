
import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, Calendar, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PageHeader from '@/components/PageHeader';
import { useCamp } from '@/contexts/CampContext';
import { useAuth } from '@/contexts/AuthContext';

const formatDateRange = (startDate: string, endDate: string) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
  return `${start.toLocaleDateString('en-US', options)} - ${end.toLocaleDateString('en-US', options)}`;
};

const Camps = () => {
  const { camps } = useCamp();
  const { user, hasPermission } = useAuth();
  const isAdmin = hasPermission('admin');

  return (
    <div className="page-container pb-20">
      <PageHeader 
        title="Camp Activities" 
        showBackButton={false}
      />
      
      {isAdmin && (
        <div className="mb-6">
          <Link to="/camps/create">
            <Button className="w-full bg-camp-primary hover:bg-camp-secondary flex items-center justify-center">
              <Plus size={18} className="mr-2" />
              Create New Camp
            </Button>
          </Link>
        </div>
      )}
      
      <div className="space-y-6">
        {camps.length === 0 ? (
          <div className="text-center py-10">
            <Calendar size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-500">No camps available</h3>
            <p className="text-gray-400 mt-2">Check back later for upcoming camps</p>
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
                alt={camp.name}
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
                    {camp.days.length} {camp.days.length === 1 ? 'Day' : 'Days'}
                  </span>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-camp-primary border-camp-primary hover:bg-camp-light"
                  >
                    View Details
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
