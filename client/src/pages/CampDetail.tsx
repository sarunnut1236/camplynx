import { useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Clock, Check, AlertCircle, Edit, Trash, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import PageHeader from '@/components/PageHeader';
import { useCamp } from '@/contexts/CampContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { useTranslation } from 'react-i18next';
import { UserRole } from '@/enums/User';

const CampDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { getCampById, registerForCamp, getRegistrationByCampAndUser, updateRegistration, deleteCamp } = useCamp();
  const { user, hasPermission } = useAuth();
  const { t, i18n } = useTranslation();
  
  const camp = getCampById(id || '');
  const registration = user ? getRegistrationByCampAndUser(id || '', user.id) : undefined;
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  const [availability, setAvailability] = useState<{ [dayId: string]: boolean }>(
    registration?.dayAvailability || 
    (camp?.days.reduce((acc, day) => ({ ...acc, [day.id]: false }), {}) || {})
  );
  
  // Check if user is admin
  const isAdmin = hasPermission(UserRole.ADMIN);
  
  // Format date function that depends on i18n
  const formatDate = useCallback((date: Date) => {
    return date.toLocaleDateString(i18n.language, { weekday: 'long', month: 'long', day: 'numeric' });
  }, [i18n.language]);
  
  // Early return if camp not found
  if (!camp) {
    return <div className="p-6">{t('camps.notFound')}</div>;
  }
  
  const handleDayToggle = (dayId: string) => {
    setAvailability(prev => ({
      ...prev,
      [dayId]: !prev[dayId]
    }));
  };
  
  const handleRegistration = () => {
    if (!user) return;
    
    if (registration) {
      // Update existing registration
      updateRegistration(registration.id, availability);
      toast({
        title: t('toast.availabilityUpdated'),
        description: t('toast.availabilityUpdatedDescription'),
      });
    } else {
      // Create new registration
      registerForCamp(user.id, camp.id, availability);
    }
  };
  
  const handleDelete = () => {
    if (id) {
      deleteCamp(id);
      toast({
        title: t('toast.campDeleted'),
        description: t('toast.campDeletedDescription'),
      });
      navigate('/camps');
    }
  };

  return (
    <div className="page-container pb-20 min-h-screen">
      <PageHeader title={camp.name} />
      
      <div className="mb-6 section-card">
        <img 
          src={camp.imageUrl} 
          alt={t('camps.campImageAlt', { name: camp.name })}
          className="w-full h-48 object-cover rounded-lg mb-4"
        />
        
        <div className="space-y-3">
          <h1 className="text-2xl font-semibold">{camp.name}</h1>
          
          <div className="flex items-center text-gray-600">
            <Calendar size={18} className="mr-2" />
            <span>{formatDate(camp.startDate)} - {formatDate(camp.endDate)}</span>
          </div>
          
          <div className="flex items-center text-gray-600">
            <MapPin size={18} className="mr-2" />
            <span>{camp.location}</span>
          </div>
          
          <p className="text-gray-700 mt-2">{camp.description}</p>
          
          {/* Admin Actions */}
          {isAdmin && (
            <div className="mt-4 flex gap-2 flex-wrap">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-1"
                onClick={() => navigate(`/camps/${id}/participants`)}
              >
                <Users size={16} />
                {t('camps.viewParticipants')}
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-1"
                onClick={() => navigate(`/camps/${id}/edit`)}
              >
                <Edit size={16} />
                {t('camps.edit')}
              </Button>
              <Button 
                variant="destructive" 
                size="sm" 
                className="flex items-center gap-1"
                onClick={() => setShowDeleteDialog(true)}
              >
                <Trash size={16} />
                {t('camps.delete')}
              </Button>
            </div>
          )}
        </div>
      </div>
      
      <Tabs defaultValue="schedule" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="schedule">{t('camps.schedule')}</TabsTrigger>
          <TabsTrigger value="registration">{t('camps.registration')}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="schedule" className="mt-4">
          <div className="space-y-6">
            {camp.days.map((day) => (
              <div key={day.id} className="section-card">
                <h3 className="font-medium mb-2">
                  {t('camps.dayNumber', { number: day.dayNumber })}: {formatDate(day.date)}
                </h3>
                
                <Separator className="my-3" />
                
                <div className="space-y-3">
                  {day.activities.map((activity, index) => (
                    <div key={index} className="flex items-start">
                      <Clock size={18} className="mr-2 text-camp-primary mt-0.5" />
                      <div>
                        <p className="font-medium">{activity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="registration" className="mt-4">
          <div className="section-card mb-6">
            <h3 className="font-medium mb-4">{t('camps.selectDays')}:</h3>
            
            <div className="space-y-3">
              {camp.days.map((day) => (
                <div 
                  key={day.id} 
                  className="flex items-center p-3 border rounded-md hover:bg-gray-50"
                >
                  <Checkbox 
                    id={day.id}
                    checked={availability[day.id] ?? false}
                    onCheckedChange={() => handleDayToggle(day.id)}
                    className="mr-3"
                  />
                  <div>
                    <label htmlFor={day.id} className="font-medium cursor-pointer">
                      {t('camps.dayNumber', { number: day.dayNumber })}: {formatDate(day.date)}
                    </label>
                    <p className="text-sm text-gray-500">
                      {day.activities.length} {t(day.activities.length === 1 ? 'camps.activity' : 'camps.activities')} {t('camps.planned')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-camp-light bg-opacity-50 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <AlertCircle size={20} className="mr-2 text-camp-primary mt-0.5" />
              <div>
                <p className="font-medium">{t('camps.importantInfo')}</p>
                <p className="text-sm text-gray-600 mt-1">
                  {t('camps.attendanceNote')}
                </p>
              </div>
            </div>
          </div>
          
          <Button 
            onClick={handleRegistration}
            className="w-full bg-camp-primary hover:bg-camp-secondary"
          >
            {registration ? t('camps.updateAvailability') : t('camps.registerForCamp')}
          </Button>
          
          {registration && (
            <div className="mt-4 flex items-center justify-center text-sm text-green-600">
              <Check size={16} className="mr-1" />
              <span>{t('camps.registeredMessage')}</span>
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('camps.deleteConfirmTitle')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('camps.deleteConfirmMessage')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              {t('common.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CampDetail;
