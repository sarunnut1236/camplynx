import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { User, Calendar, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import PageHeader from '@/components/PageHeader';
import { useAuth } from '@/contexts/AuthContext';
import { useCamp } from '@/contexts/CampContext';
import { UserRole } from '@/enums/User';
import { useTranslation } from 'react-i18next';
import { Registration } from '@/models/Camp';
import { getUserById } from '@/providers/users';
import { User as UserType } from '@/models/User';

// Type for participant with user data
interface Participant {
  user: UserType;
  registration: Registration;
}

const CampParticipants = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { hasPermission } = useAuth();
  const { getCampById, registrations } = useCamp();
  const { t } = useTranslation();
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Get camp
  const camp = getCampById(id || '');
  
  // Check if user has admin permission
  if (!hasPermission(UserRole.ADMIN)) {
    navigate('/unauthorized');
    return null;
  }
  
  // Check if camp exists
  if (!camp) {
    navigate('/camps');
    return null;
  }
  
  // Load participants data
  useEffect(() => {
    const loadParticipants = async () => {
      try {
        // Get all registrations for this camp
        const campRegistrations = registrations.filter(reg => reg.campId === id);
        
        // Load user data for each registration
        const participantsData = await Promise.all(
          campRegistrations.map(async (registration) => {
            const user = await getUserById(registration.userId);
            return {
              user: user || { id: registration.userId, role: UserRole.GUEST },
              registration,
            };
          })
        );
        
        setParticipants(participantsData);
      } catch (error) {
        console.error("Error loading participants:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadParticipants();
  }, [id, registrations]);
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };
  
  // Calculate attendance stats
  const calculateAttendance = (participant: Participant) => {
    const totalDays = camp.days.length;
    const availableDays = Object.values(participant.registration.dayAvailability).filter(Boolean).length;
    
    return {
      availableDays,
      totalDays,
      percentage: totalDays > 0 ? Math.round((availableDays / totalDays) * 100) : 0
    };
  };
  
  return (
    <div className="page-container pb-20 min-h-screen">
      <PageHeader title={t('camps.participants')} />
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">{camp.name}</h2>
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <Calendar size={16} className="mr-1" />
          <span>{formatDate(camp.startDate)} - {formatDate(camp.endDate)}</span>
        </div>
        <p className="text-gray-600">{camp.days.length} {t(camp.days.length === 1 ? 'camps.day' : 'camps.days')}</p>
      </div>
      
      {loading ? (
        <div className="text-center py-8">{t('common.loading')}</div>
      ) : participants.length === 0 ? (
        <div className="text-center py-8">
          <User size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-500">{t('camps.noParticipants')}</h3>
          <p className="text-gray-400 mt-2">{t('camps.noParticipantsDescription')}</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-gray-50 p-3 rounded-md text-sm font-medium flex justify-between">
            <span>{t('camps.totalParticipants')}: {participants.length}</span>
          </div>
          
          {participants.map((participant) => {
            const attendance = calculateAttendance(participant);
            return (
              <div 
                key={participant.registration.id} 
                className="bg-white rounded-lg shadow-sm p-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {participant.user.profileImage ? (
                      <img 
                        src={participant.user.profileImage} 
                        alt={participant.user.firstname}
                        className="w-12 h-12 rounded-full object-cover mr-3"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-camp-light flex items-center justify-center mr-3">
                        <User size={20} className="text-camp-primary" />
                      </div>
                    )}
                    
                    <div>
                      <p className="font-medium">
                        {participant.user.firstname || 'Unknown'} {participant.user.surname || ''}
                      </p>
                      {participant.user.email && (
                        <p className="text-sm text-gray-500">{participant.user.email}</p>
                      )}
                      <p className="text-xs text-gray-400 mt-1">
                        {t('camps.registeredOn')}: {formatDate(participant.registration.registrationDate)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <Badge 
                      className={attendance.percentage >= 75 ? 'bg-green-100 text-green-800' : 
                        attendance.percentage >= 50 ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'}
                    >
                      {attendance.availableDays} / {attendance.totalDays} {t('camps.days')}
                    </Badge>
                    <p className="text-sm mt-1">
                      {attendance.percentage}% {t('camps.availability')}
                    </p>
                  </div>
                </div>
                
                <div className="mt-4 pt-3 border-t">
                  <p className="text-sm font-medium mb-2">{t('camps.dayAvailability')}:</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {camp.days.map((day) => (
                      <div 
                        key={day.id} 
                        className="flex items-center text-sm p-2 rounded-md bg-gray-50"
                      >
                        {participant.registration.dayAvailability[day.id] ? (
                          <CheckCircle size={16} className="text-green-500 mr-2" />
                        ) : (
                          <XCircle size={16} className="text-red-500 mr-2" />
                        )}
                        <span>Day {day.dayNumber}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      
      <div className="mt-8">
        <Button
          onClick={() => navigate(`/camps/${id}`)}
          variant="outline"
          className="w-full"
        >
          {t('common.back')}
        </Button>
      </div>
    </div>
  );
};

export default CampParticipants; 