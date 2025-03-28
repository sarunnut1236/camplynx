
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import PageHeader from '@/components/PageHeader';
import { useAuth } from '@/contexts/AuthContext';
import { useCamp, Camp, CampDay } from '@/contexts/CampContext';

const CreateCamp = () => {
  const navigate = useNavigate();
  const { hasPermission } = useAuth();
  const { createCamp } = useCamp();
  
  // Check if user has admin permission
  if (!hasPermission('admin')) {
    navigate('/unauthorized');
    return null;
  }
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    startDate: '',
    endDate: '',
    imageUrl: 'https://images.unsplash.com/photo-1496080174650-637e3f22fa03?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80', // Default image
  });
  
  const [days, setDays] = useState<Omit<CampDay, 'id'>[]>([
    {
      dayNumber: 1,
      date: '',
      activities: ['']
    }
  ]);
  
  const [loading, setLoading] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleDayDateChange = (index: number, date: string) => {
    setDays(prev => {
      const newDays = [...prev];
      newDays[index] = { ...newDays[index], date };
      return newDays;
    });
  };
  
  const handleActivityChange = (dayIndex: number, activityIndex: number, value: string) => {
    setDays(prev => {
      const newDays = [...prev];
      newDays[dayIndex].activities[activityIndex] = value;
      return newDays;
    });
  };
  
  const addActivity = (dayIndex: number) => {
    setDays(prev => {
      const newDays = [...prev];
      newDays[dayIndex].activities.push('');
      return newDays;
    });
  };
  
  const removeActivity = (dayIndex: number, activityIndex: number) => {
    setDays(prev => {
      const newDays = [...prev];
      newDays[dayIndex].activities = newDays[dayIndex].activities.filter((_, i) => i !== activityIndex);
      return newDays;
    });
  };
  
  const addDay = () => {
    setDays(prev => [
      ...prev,
      {
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
    
    // Create days with IDs
    const campDays: CampDay[] = days.map((day, index) => ({
      ...day,
      id: `day-${index + 1}-${Date.now()}`,
    }));
    
    // Create camp object
    const campData: Omit<Camp, 'id'> = {
      ...formData,
      days: campDays
    };
    
    // Create camp
    createCamp(campData);
    
    // Navigate back to camps list
    setTimeout(() => {
      setLoading(false);
      navigate('/camps');
    }, 500);
  };

  return (
    <div className="page-container pb-20">
      <PageHeader title="Create New Camp" />
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic camp information */}
        <div className="space-y-4">
          <div className="form-group">
            <Label htmlFor="name" className="form-label">Camp Name <span className="text-red-500">*</span></Label>
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
            <Label htmlFor="description" className="form-label">Description <span className="text-red-500">*</span></Label>
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
            <Label htmlFor="location" className="form-label">Location <span className="text-red-500">*</span></Label>
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
              <Label htmlFor="startDate" className="form-label">Start Date <span className="text-red-500">*</span></Label>
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
              <Label htmlFor="endDate" className="form-label">End Date <span className="text-red-500">*</span></Label>
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
            <Label htmlFor="imageUrl" className="form-label">Image URL</Label>
            <Input
              id="imageUrl"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              className="form-input"
              placeholder="https://example.com/image.jpg"
            />
            <p className="text-xs text-gray-500 mt-1">
              A default image will be used if not provided
            </p>
          </div>
        </div>
        
        <Separator />
        
        {/* Camp days and activities */}
        <div>
          <h3 className="text-lg font-medium mb-4">Camp Schedule</h3>
          
          {days.map((day, dayIndex) => (
            <div key={dayIndex} className="mb-6 p-4 border rounded-lg bg-gray-50">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium">Day {day.dayNumber}</h4>
                
                {days.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeDay(dayIndex)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 size={16} />
                  </Button>
                )}
              </div>
              
              <div className="form-group">
                <Label htmlFor={`day-${dayIndex}-date`} className="form-label">
                  Date <span className="text-red-500">*</span>
                </Label>
                <Input
                  id={`day-${dayIndex}-date`}
                  type="date"
                  value={day.date}
                  onChange={(e) => handleDayDateChange(dayIndex, e.target.value)}
                  className="form-input"
                  min={formData.startDate}
                  max={formData.endDate}
                  required
                />
              </div>
              
              <div className="mt-4">
                <Label className="form-label">Activities <span className="text-red-500">*</span></Label>
                
                {day.activities.map((activity, activityIndex) => (
                  <div key={activityIndex} className="flex items-center mb-2">
                    <Input
                      value={activity}
                      onChange={(e) => handleActivityChange(dayIndex, activityIndex, e.target.value)}
                      className="form-input mr-2"
                      placeholder={`Activity ${activityIndex + 1}`}
                      required
                    />
                    
                    {day.activities.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeActivity(dayIndex, activityIndex)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 px-2"
                      >
                        <Trash2 size={16} />
                      </Button>
                    )}
                  </div>
                ))}
                
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addActivity(dayIndex)}
                  className="mt-2"
                >
                  <Plus size={16} className="mr-1" />
                  Add Activity
                </Button>
              </div>
            </div>
          ))}
          
          <Button
            type="button"
            variant="outline"
            className="w-full mt-2"
            onClick={addDay}
          >
            <Plus size={16} className="mr-1" />
            Add Day
          </Button>
        </div>
        
        <div className="flex justify-between pt-4">
          <Button 
            type="button" 
            variant="outline"
            onClick={() => navigate('/camps')}
          >
            Cancel
          </Button>
          
          <Button 
            type="submit" 
            className="bg-camp-primary hover:bg-camp-secondary"
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Camp'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateCamp;
