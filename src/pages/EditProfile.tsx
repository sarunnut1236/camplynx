import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { Region } from '@/enums/User';
import { User } from '@/models/User';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import PageHeader from '@/components/PageHeader';

const regionOptions: Region[] = [Region.BKK, Region.EAST, Region.CEN, Region.PARI];
// Generate last 20 years for date selection
const currentYear = new Date().getFullYear();
const years = Array.from({ length: 20 }, (_, i) => currentYear - i);
// Generate months for date selection
const months = [
  { value: 0, label: 'January' },
  { value: 1, label: 'February' },
  { value: 2, label: 'March' },
  { value: 3, label: 'April' },
  { value: 4, label: 'May' },
  { value: 5, label: 'June' },
  { value: 6, label: 'July' },
  { value: 7, label: 'August' },
  { value: 8, label: 'September' },
  { value: 9, label: 'October' },
  { value: 10, label: 'November' },
  { value: 11, label: 'December' },
];

// For birthdate selection
const birthdateYears = Array.from({ length: 100 }, (_, i) => currentYear - i);
const days = Array.from({ length: 31 }, (_, i) => i + 1);

const EditProfile = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const [formData, setFormData] = useState<Partial<User>>({
    firstname: user?.firstname || '',
    surname: user?.surname || '',
    nickname: user?.nickname || '',
    email: user?.email || '',
    phone: user?.phone || '',
    ...(user?.region ? { region: user.region } : {}),
    ...(user?.joinedAt ? { joinedAt: user.joinedAt } : {}),
    ...(user?.birthdate ? { birthdate: user.birthdate } : {}),
    lineId: user?.lineId || '',
    foodAllergy: user?.foodAllergy || '',
    personalMedicalCondition: user?.personalMedicalCondition || '',
    title: user?.title || '',
    bio: user?.bio || '',
    memberCode: user?.memberCode || '',
  });

  // Extra state for date handling - Joined Date
  const [joinedMonth, setJoinedMonth] = useState<number | undefined>(
    user?.joinedAt ? user.joinedAt.getMonth() : undefined
  );
  const [joinedYear, setJoinedYear] = useState<number | undefined>(
    user?.joinedAt ? user.joinedAt.getFullYear() : undefined
  );
  
  // Extra state for date handling - Birthdate
  const [birthYear, setBirthYear] = useState<number | undefined>(
    user?.birthdate ? user.birthdate.getFullYear() : undefined
  );
  const [birthMonth, setBirthMonth] = useState<number | undefined>(
    user?.birthdate ? user.birthdate.getMonth() : undefined
  );
  const [birthDay, setBirthDay] = useState<number | undefined>(
    user?.birthdate ? user.birthdate.getDate() : undefined
  );
  
  const [loading, setLoading] = useState(false);
  
  if (!user) {
    return <div>{t('editProfile.loading')}</div>;
  }

  const updateJoinedDate = (year?: number, month?: number) => {
    if (year && month !== undefined) {
      // Create a new date with the selected year and month, day 1
      const newDate = new Date(year, month, 1);
      setFormData(prev => ({ ...prev, joinedAt: newDate }));
    } else {
      setFormData(prev => {
        const next = { ...prev };
        delete next.joinedAt;
        return next;
      });
    }
  };
  
  const updateBirthdate = (year?: number, month?: number, day?: number) => {
    if (year && month !== undefined && day) {
      // Create a new date with the selected year, month, and day
      const newDate = new Date(year, month, day);
      setFormData(prev => ({ ...prev, birthdate: newDate }));
    } else {
      setFormData(prev => {
        const next = { ...prev };
        delete next.birthdate;
        return next;
      });
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
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

  const handleClearJoinedDate = () => {
    setJoinedMonth(undefined);
    setJoinedYear(undefined);
    setFormData(prev => {
      const next = { ...prev };
      delete next.joinedAt;
      return next;
    });
  };
  
  const handleClearBirthdate = () => {
    setBirthYear(undefined);
    setBirthMonth(undefined);
    setBirthDay(undefined);
    setFormData(prev => {
      const next = { ...prev };
      delete next.birthdate;
      return next;
    });
  };

  // Use formatted values for select items to avoid type issues
  const formatSelectedValue = (value: any) => {
    if (value === undefined) return undefined;
    return value.toString();
  };

  return (
    <div className="page-container pb-20 min-h-screen">
      <PageHeader title={t('editProfile.title')} />
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium border-b pb-2 mb-4">{t('editProfile.personalInfo')}</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
              <Label htmlFor="firstname" className="form-label">{t('editProfile.firstname')} <span className="text-red-500">*</span></Label>
              <Input
                id="firstname"
                name="firstname"
                value={formData.firstname}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>
            
            <div className="form-group">
              <Label htmlFor="surname" className="form-label">{t('editProfile.surname')} <span className="text-red-500">*</span></Label>
              <Input
                id="surname"
                name="surname"
                value={formData.surname}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>
          </div>
          
          <div className="form-group">
            <div className="flex justify-between">
              <Label htmlFor="nickname" className="form-label">{t('editProfile.nickname')}</Label>
              <button 
                type="button"
                onClick={() => handleClearOptionalField('nickname')}
                className="text-xs text-red-500"
              >
                {t('editProfile.clear')}
              </button>
            </div>
            <Input
              id="nickname"
              name="nickname"
              value={formData.nickname || ''}
              onChange={handleChange}
              className="form-input"
            />
          </div>
          
          <div className="form-group">
            <div className="flex justify-between">
              <Label htmlFor="email" className="form-label">{t('editProfile.email')}</Label>
              <button 
                type="button"
                onClick={() => handleClearOptionalField('email')}
                className="text-xs text-red-500"
              >
                {t('editProfile.clear')}
              </button>
            </div>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email || ''}
              onChange={handleChange}
              className="form-input"
            />
          </div>
          
          <div className="form-group">
            <div className="flex justify-between">
              <Label htmlFor="phone" className="form-label">{t('editProfile.phone')}</Label>
              <button 
                type="button"
                onClick={() => handleClearOptionalField('phone')}
                className="text-xs text-red-500"
              >
                {t('editProfile.clear')}
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
              <Label htmlFor="memberCode" className="form-label">{t('editProfile.memberCode')}</Label>
              <button 
                type="button"
                onClick={() => handleClearOptionalField('memberCode')}
                className="text-xs text-red-500"
              >
                {t('editProfile.clear')}
              </button>
            </div>
            <Input
              id="memberCode"
              name="memberCode"
              value={formData.memberCode || ''}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
              <div className="flex justify-between">
                <Label htmlFor="region" className="form-label">{t('editProfile.region')}</Label>
                <button 
                  type="button"
                  onClick={() => handleSelectChange('region', '')}
                  className="text-xs text-red-500"
                >
                  {t('editProfile.clear')}
                </button>
              </div>
              <Select
                value={formData.region?.toString() || ''}
                onValueChange={(value) => handleSelectChange('region', value)}
              >
                <SelectTrigger id="region" className="form-input">
                  <SelectValue placeholder="Select a region" />
                </SelectTrigger>
                <SelectContent>
                  {regionOptions.map(region => (
                    <SelectItem key={region} value={region}>
                      {region}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="form-group">
              <div className="flex justify-between">
                <Label className="form-label">Joined Date</Label>
                <button 
                  type="button"
                  onClick={handleClearJoinedDate}
                  className="text-xs text-red-500"
                >
                  {t('editProfile.clear')}
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Select
                  value={formatSelectedValue(joinedMonth)}
                  onValueChange={(value) => {
                    const month = parseInt(value, 10);
                    setJoinedMonth(month);
                    updateJoinedDate(joinedYear, month);
                  }}
                >
                  <SelectTrigger className="form-input">
                    <SelectValue placeholder="Month" />
                  </SelectTrigger>
                  <SelectContent>
                    {months.map(month => (
                      <SelectItem key={month.value} value={month.value.toString()}>
                        {month.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select
                  value={formatSelectedValue(joinedYear)}
                  onValueChange={(value) => {
                    const year = parseInt(value, 10);
                    setJoinedYear(year);
                    updateJoinedDate(year, joinedMonth);
                  }}
                >
                  <SelectTrigger className="form-input">
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map(year => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <div className="form-group">
            <div className="flex justify-between">
              <Label htmlFor="birthdate" className="form-label">Birthdate</Label>
              <button 
                type="button"
                onClick={handleClearBirthdate}
                className="text-xs text-red-500"
              >
                {t('editProfile.clear')}
              </button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <Select
                value={formatSelectedValue(birthMonth)}
                onValueChange={(value) => {
                  const month = parseInt(value, 10);
                  setBirthMonth(month);
                  updateBirthdate(birthYear, month, birthDay);
                }}
              >
                <SelectTrigger className="form-input">
                  <SelectValue placeholder="Month" />
                </SelectTrigger>
                <SelectContent>
                  {months.map(month => (
                    <SelectItem key={month.value} value={month.value.toString()}>
                      {month.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select
                value={formatSelectedValue(birthDay)}
                onValueChange={(value) => {
                  const day = parseInt(value, 10);
                  setBirthDay(day);
                  updateBirthdate(birthYear, birthMonth, day);
                }}
              >
                <SelectTrigger className="form-input">
                  <SelectValue placeholder="Day" />
                </SelectTrigger>
                <SelectContent>
                  {days.map(day => (
                    <SelectItem key={day} value={day.toString()}>
                      {day}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select
                value={formatSelectedValue(birthYear)}
                onValueChange={(value) => {
                  const year = parseInt(value, 10);
                  setBirthYear(year);
                  updateBirthdate(year, birthMonth, birthDay);
                }}
              >
                <SelectTrigger className="form-input">
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                  {birthdateYears.map(year => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="form-group">
            <div className="flex justify-between">
              <Label htmlFor="lineId" className="form-label">Line ID</Label>
              <button 
                type="button"
                onClick={() => handleClearOptionalField('lineId')}
                className="text-xs text-red-500"
              >
                {t('editProfile.clear')}
              </button>
            </div>
            <Input
              id="lineId"
              name="lineId"
              value={formData.lineId || ''}
              onChange={handleChange}
              className="form-input"
            />
          </div>
          
          <h3 className="text-lg font-medium border-b pb-2 mb-4 mt-6">{t('editProfile.healthInfo')}</h3>
          
          <div className="form-group">
            <div className="flex justify-between">
              <Label htmlFor="foodAllergy" className="form-label">{t('editProfile.foodAllergy')}</Label>
              <button 
                type="button"
                onClick={() => handleClearOptionalField('foodAllergy')}
                className="text-xs text-red-500"
              >
                {t('editProfile.clear')}
              </button>
            </div>
            <Textarea
              id="foodAllergy"
              name="foodAllergy"
              value={formData.foodAllergy || ''}
              onChange={handleChange}
              className="form-input"
              placeholder="List any food allergies you have..."
              rows={2}
            />
          </div>
          
          <div className="form-group">
            <div className="flex justify-between">
              <Label htmlFor="personalMedicalCondition" className="form-label">{t('editProfile.medicalCondition')}</Label>
              <button 
                type="button"
                onClick={() => handleClearOptionalField('personalMedicalCondition')}
                className="text-xs text-red-500"
              >
                {t('editProfile.clear')}
              </button>
            </div>
            <Textarea
              id="personalMedicalCondition"
              name="personalMedicalCondition"
              value={formData.personalMedicalCondition || ''}
              onChange={handleChange}
              className="form-input"
              placeholder="Any medical conditions we should be aware of..."
              rows={2}
            />
          </div>
          
          <h3 className="text-lg font-medium border-b pb-2 mb-4 mt-6">{t('editProfile.additionalInfo')}</h3>
          
          <div className="form-group">
            <div className="flex justify-between">
              <Label htmlFor="title" className="form-label">{t('editProfile.title')}</Label>
              <button 
                type="button"
                onClick={() => handleClearOptionalField('title')}
                className="text-xs text-red-500"
              >
                {t('editProfile.clear')}
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
              <Label htmlFor="bio" className="form-label">{t('editProfile.bio')}</Label>
              <button 
                type="button"
                onClick={() => handleClearOptionalField('bio')}
                className="text-xs text-red-500"
              >
                {t('editProfile.clear')}
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
        
        <div className="pt-6 flex justify-between">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => navigate('/profile')}
          >
            {t('editProfile.cancel')}
          </Button>
          
          <Button 
            type="submit" 
            className="bg-camp-primary hover:bg-camp-secondary"
            disabled={loading}
          >
            {loading ? t('editProfile.saving') : t('editProfile.save')}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;
