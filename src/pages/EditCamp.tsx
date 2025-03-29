import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import PageHeader from '@/components/PageHeader';
import { useAuth } from '@/contexts/AuthContext';
import { useCamp } from '@/contexts/CampContext';
import { Camp, CampDay } from '@/models/Camp';
import { useTranslation } from 'react-i18next';
import { UserRole } from '@/enums/User';

const EditCamp = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { hasPermission, user } = useAuth();
  const { getCampById, updateCamp } = useCamp();
  const { t } = useTranslation();
  
  // Get camp data 
  const camp = getCampById(id || '');
  
  // Check if user has admin permission
  if (!hasPermission(UserRole.ADMIN)) {
    navigate('/unauthorized');
    return null;
  }
  
  // Check if user exists
  if (!user) {
    navigate('/unauthorized');
    return null;
  }
  
  // Check if camp exists
  if (!camp) {
    navigate('/camps');
    return null;
  }
  
  // Check if user is the owner of the camp or is an admin
  if (camp.ownerId && camp.ownerId !== user.id) {
    navigate('/unauthorized');
    return null;
  }
  
  const [formData, setFormData] = useState({
    name: camp.name,
    description: camp.description,
    location: camp.location,
    startDate: camp.startDate,
    endDate: camp.endDate,
    imageUrl: camp.imageUrl,
  });
  
  const [days, setDays] = useState<CampDay[]>(camp.days || []);
  const [loading, setLoading] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleDayDateChange = (index: number, date: string) => {
    setDays(prev => {
      const newDays = [...prev];
      if (newDays[index]) {
        newDays[index] = { 
          ...newDays[index],
          date
        };
      }
      return newDays;
    });
  };
  
  const handleActivityChange = (dayIndex: number, activityIndex: number, value: string) => {
    setDays(prev => {
      const newDays = [...prev];
      if (newDays[dayIndex] && newDays[dayIndex].activities) {
        newDays[dayIndex].activities[activityIndex] = value;
      }
      return newDays;
    });
  };
  
  const addActivity = (dayIndex: number) => {
    setDays(prev => {
      const newDays = [...prev];
      if (newDays[dayIndex]?.activities) {
        newDays[dayIndex].activities.push('');
      }
      return newDays;
    });
  };
  
  const removeActivity = (dayIndex: number, activityIndex: number) => {
    setDays(prev => {
      const newDays = [...prev];
      if (newDays[dayIndex]?.activities) {
        newDays[dayIndex].activities = newDays[dayIndex].activities.filter((_, i) => i !== activityIndex);
      }
      return newDays;
    });
  };
  
  const addDay = () => {
    setDays(prev => [
      ...prev,
      {
        id: `day-${prev.length + 1}-${Date.now()}`,
        dayNumber: prev.length + 1,
        date: '',
        activities: ['']
      }
    ]);
  };
  
  const removeDay = (index: number) => {
    setDays(prev => {
      const newDays = prev.filter((_, i) => i !== index);
      // Update day numbers
      return newDays.map((day, i) => ({
        ...day,
        dayNumber: i + 1
      }));
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Create updated camp object
    const campData: Partial<Camp> = {
      ...formData,
      days,
      // Keep the original owner
      ownerId: camp.ownerId || user.id
    };
    
    // Update camp
    updateCamp(camp.id, campData);
    
    // Navigate back to camp details
    setTimeout(() => {
      setLoading(false);
      navigate(`/camps/${camp.id}`);
    }, 500);
  };
  
  return (
    <div className="page-container pb-20 min-h-screen">
      <PageHeader title={t('camps.editCamp')} />
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic camp information */}
        <div className="space-y-4">
          <div className="form-group">
            <Label htmlFor="name" className="form-label">{t('camps.name')} <span className="text-red-500">*</span></Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="form-input"
              placeholder="e.g. Summer Adventure Camp"
              required
            />
          </div>
          
          <div className="form-group">
            <Label htmlFor="description" className="form-label">{t('camps.description')} <span className="text-red-500">*</span></Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="form-input"
              placeholder="Describe what the camp is about..."
              rows={3}
              required
            />
          </div>
          
          <div className="form-group">
            <Label htmlFor="location" className="form-label">{t('camps.location')} <span className="text-red-500">*</span></Label>
            <Input
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="form-input"
              placeholder="e.g. Pine Forest Retreat"
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <Label htmlFor="startDate" className="form-label">{t('camps.startDate')} <span className="text-red-500">*</span></Label>
              <Input
                id="startDate"
                name="startDate"
                type="date"
                value={formData.startDate}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>
            
            <div className="form-group">
              <Label htmlFor="endDate" className="form-label">{t('camps.endDate')} <span className="text-red-500">*</span></Label>
              <Input
                id="endDate"
                name="endDate"
                type="date"
                value={formData.endDate}
                onChange={handleChange}
                className="form-input"
                min={formData.startDate}
                required
              />
            </div>
          </div>
          
          <div className="form-group">
            <Label htmlFor="imageUrl" className="form-label">{t('camps.imageUrl')}</Label>
            <Input
              id="imageUrl"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              className="form-input"
              placeholder="https://example.com/image.jpg"
            />
            <p className="text-xs text-gray-500 mt-1">
              {t('camps.defaultImage')}
            </p>
          </div>
        </div>
        
        <Separator />
        
        {/* Camp days and activities */}
        <div>
          <h3 className="text-lg font-medium mb-4">{t('camps.schedule')}</h3>
          
          {days.map((day, dayIndex) => (
            <div key={day.id} className="mb-6 p-4 border rounded-lg bg-gray-50">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium">Day {day.dayNumber}</h4>
                
                {days.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-red-500"
                    onClick={() => removeDay(dayIndex)}
                  >
                    <Trash2 size={16} />
                    <span className="sr-only">Remove Day</span>
                  </Button>
                )}
              </div>
              
              <div className="form-group mb-3">
                <Label htmlFor={`day-${dayIndex}-date`} className="form-label">{t('camps.date')} <span className="text-red-500">*</span></Label>
                <Input
                  id={`day-${dayIndex}-date`}
                  type="date"
                  value={day.date}
                  onChange={(e) => handleDayDateChange(dayIndex, e.target.value)}
                  className="form-input"
                  required
                />
              </div>
              
              <div className="space-y-3">
                <Label className="form-label">{t('camps.activities')} <span className="text-red-500">*</span></Label>
                
                {day.activities.map((activity, activityIndex) => (
                  <div key={activityIndex} className="flex gap-2">
                    <Input
                      value={activity}
                      onChange={(e) => handleActivityChange(dayIndex, activityIndex, e.target.value)}
                      className="form-input"
                      placeholder={`Activity ${activityIndex + 1}`}
                      required
                    />
                    
                    {day.activities.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-10 w-10 p-0 text-red-500"
                        onClick={() => removeActivity(dayIndex, activityIndex)}
                      >
                        <Trash2 size={16} />
                        <span className="sr-only">Remove Activity</span>
                      </Button>
                    )}
                  </div>
                ))}
                
                <Button
                  type="button"
                  variant="outline"
                  className="w-full mt-2"
                  onClick={() => addActivity(dayIndex)}
                >
                  <Plus size={16} className="mr-2" />
                  {t('camps.addActivity')}
                </Button>
              </div>
            </div>
          ))}
          
          <Button
            type="button"
            variant="outline"
            className="w-full mb-6"
            onClick={addDay}
          >
            <Plus size={16} className="mr-2" />
            {t('camps.addDay')}
          </Button>
        </div>
        
        <div className="sticky bottom-16 bg-white p-4 border-t">
          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => navigate(`/camps/${id}`)}
            >
              {t('common.cancel')}
            </Button>
            
            <Button
              type="submit"
              className="flex-1 bg-camp-primary hover:bg-camp-secondary"
              disabled={loading}
            >
              {loading ? t('common.saving') : t('common.saveChanges')}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditCamp; 