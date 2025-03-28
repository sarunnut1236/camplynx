
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Clock, Check, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PageHeader from '@/components/PageHeader';
import { useCamp } from '@/contexts/CampContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';

const CampDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { getCampById, registerForCamp, getRegistrationByCampAndUser, updateRegistration } = useCamp();
  const { user } = useAuth();
  
  const camp = getCampById(id || '');
  const registration = user ? getRegistrationByCampAndUser(id || '', user.id) : undefined;
  
  const [availability, setAvailability] = useState<{ [dayId: string]: boolean }>(
    registration?.dayAvailability || 
    (camp?.days.reduce((acc, day) => ({ ...acc, [day.id]: false }), {}) || {})
  );
  
  if (!camp) {
    return <div className="p-6">Camp not found</div>;
  }
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  };
  
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
        title: "Availability updated",
        description: "Your availability for this camp has been updated.",
      });
    } else {
      // Create new registration
      registerForCamp(user.id, camp.id, availability);
    }
  };

  return (
    <div className="page-container pb-20">
      <PageHeader title={camp.name} />
      
      <div className="mb-6">
        <img 
          src={camp.imageUrl} 
          alt={camp.name}
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
        </div>
      </div>
      
      <Tabs defaultValue="schedule" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="registration">Registration</TabsTrigger>
        </TabsList>
        
        <TabsContent value="schedule" className="mt-4">
          <div className="space-y-6">
            {camp.days.map((day) => (
              <div key={day.id} className="bg-white rounded-lg shadow-sm p-4">
                <h3 className="font-medium mb-2">
                  Day {day.dayNumber}: {formatDate(day.date)}
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
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <h3 className="font-medium mb-4">Select days you can attend:</h3>
            
            <div className="space-y-3">
              {camp.days.map((day) => (
                <div 
                  key={day.id} 
                  className="flex items-center p-3 border rounded-md hover:bg-gray-50"
                >
                  <Checkbox 
                    id={day.id}
                    checked={availability[day.id]}
                    onCheckedChange={() => handleDayToggle(day.id)}
                    className="mr-3"
                  />
                  <div>
                    <label htmlFor={day.id} className="font-medium cursor-pointer">
                      Day {day.dayNumber}: {formatDate(day.date)}
                    </label>
                    <p className="text-sm text-gray-500">
                      {day.activities.length} {day.activities.length === 1 ? 'activity' : 'activities'} planned
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
                <p className="font-medium">Important Information</p>
                <p className="text-sm text-gray-600 mt-1">
                  Please indicate which days you can attend. You can update your availability later if your plans change.
                </p>
              </div>
            </div>
          </div>
          
          <Button 
            onClick={handleRegistration}
            className="w-full bg-camp-primary hover:bg-camp-secondary"
          >
            {registration ? 'Update Availability' : 'Register for Camp'}
          </Button>
          
          {registration && (
            <div className="mt-4 flex items-center justify-center text-sm text-green-600">
              <Check size={16} className="mr-1" />
              <span>You are registered for this camp</span>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CampDetail;
