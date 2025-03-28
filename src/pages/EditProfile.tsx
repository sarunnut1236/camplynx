
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, User } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import PageHeader from '@/components/PageHeader';

const EditProfile = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<Partial<User>>({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    title: user?.title || '',
    bio: user?.bio || '',
  });
  
  const [loading, setLoading] = useState(false);
  
  if (!user) {
    return <div>Loading profile...</div>;
  }
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      updateUser(formData);
      setLoading(false);
      navigate('/profile');
    }, 500);
  };
  
  const handleClearOptionalField = (field: string) => {
    setFormData(prev => ({ ...prev, [field]: '' }));
  };

  return (
    <div className="page-container pb-20">
      <PageHeader title="Edit Profile" />
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="form-group">
            <Label htmlFor="name" className="form-label">Name <span className="text-red-500">*</span></Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>
          
          <div className="form-group">
            <Label htmlFor="email" className="form-label">Email <span className="text-red-500">*</span></Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>
          
          <div className="form-group">
            <div className="flex justify-between">
              <Label htmlFor="phone" className="form-label">Phone</Label>
              <button 
                type="button"
                onClick={() => handleClearOptionalField('phone')}
                className="text-xs text-red-500"
              >
                Clear
              </button>
            </div>
            <Input
              id="phone"
              name="phone"
              value={formData.phone || ''}
              onChange={handleChange}
              className="form-input"
            />
          </div>
          
          <div className="form-group">
            <div className="flex justify-between">
              <Label htmlFor="title" className="form-label">Title</Label>
              <button 
                type="button"
                onClick={() => handleClearOptionalField('title')}
                className="text-xs text-red-500"
              >
                Clear
              </button>
            </div>
            <Input
              id="title"
              name="title"
              value={formData.title || ''}
              onChange={handleChange}
              className="form-input"
              placeholder="e.g. Camp Counselor"
            />
          </div>
          
          <div className="form-group">
            <div className="flex justify-between">
              <Label htmlFor="bio" className="form-label">Bio</Label>
              <button 
                type="button"
                onClick={() => handleClearOptionalField('bio')}
                className="text-xs text-red-500"
              >
                Clear
              </button>
            </div>
            <Textarea
              id="bio"
              name="bio"
              value={formData.bio || ''}
              onChange={handleChange}
              className="form-input"
              placeholder="Share a little about yourself..."
              rows={4}
            />
          </div>
        </div>
        
        <div className="flex justify-between">
          <Button 
            type="button" 
            variant="outline"
            onClick={() => navigate('/profile')}
          >
            Cancel
          </Button>
          
          <Button 
            type="submit" 
            className="bg-camp-primary hover:bg-camp-secondary"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;
