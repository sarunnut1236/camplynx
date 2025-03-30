import { Link } from 'react-router-dom';
import { Edit, User as UserIcon, Mail, Phone, Calendar, MapPin, Gift, MessageCircle, Utensils, Stethoscope, Globe, CreditCard } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import PageHeader from '@/components/PageHeader';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from 'react-i18next';
import { UserRole, getUserRoleDisplay } from '@/enums/User';
import { useLiff } from '@/contexts/LiffContext';

const Profile = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const { language, changeLanguage } = useLanguage();
  const { isLiffInitialized, profile } = useLiff();
  
  if (!user) {
    return <div>Loading profile...</div>;
  }

  const handleLanguageChange = (value: string) => {
    changeLanguage(value);
  };

  return (
    <div className="page-container pb-20 min-h-screen">
      <PageHeader 
        title={t('profile.title')} 
        showBackButton={false}
      />
      
      {/* Profile Picture Section */}
      <div className="section-card">
        <div className="flex flex-col items-center mb-4">
          {profile?.pictureUrl ? (
            <img 
              src={profile.pictureUrl} 
              alt={profile.displayName || `${user.firstname} ${user.surname}`}
              className="w-24 h-24 rounded-full object-cover mb-3"
            />
          ) : user.profileImage ? (
            <img 
              src={user.profileImage} 
              alt={`${user.firstname} ${user.surname}`}
              className="w-24 h-24 rounded-full object-cover mb-3"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-camp-light flex items-center justify-center mb-3">
              <UserIcon size={36} className="text-camp-primary" />
            </div>
          )}

          {/* Display LINE displayName if available */}
          {profile?.displayName && (
            <p className="text-xl text-gray-800 font-semibold mb-1">{profile.displayName}</p>
          )}
          
          {/* Display user's name if no LINE profile */}
          {!profile?.displayName && (
            <p className="text-xl text-gray-800 font-semibold mb-1">{user.firstname} {user.surname}</p>
          )}
          {user.title && <p className="text-gray-500 text-sm mb-1">{user.title}</p>}
          {user.bio && <p className="text-xs text-gray-500 text-center mt-1 max-w-xs">{user.bio}</p>}
        </div>
      </div>
      
      {/* Personal Details Section */}
      <div className="section-card">
        <h3 className="text-lg font-medium border-b pb-2 mb-4">{t('profile.details')}</h3>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">{t('profile.fullName')}</p>
              <div className="flex items-center">
                <UserIcon size={16} className="text-gray-400 mr-2" />
                <p>{user.firstname} {user.surname}</p>
              </div>
            </div>
            
            {user.nickname && (
              <div>
                <p className="text-sm text-gray-500">{t('profile.nickname')}</p>
                <p>{user.nickname}</p>
              </div>
            )}
            
            {user.email && (
              <div>
                <p className="text-sm text-gray-500">{t('profile.email')}</p>
                <div className="flex items-center">
                  <Mail size={16} className="text-gray-400 mr-2" />
                  <p>{user.email}</p>
                </div>
              </div>
            )}
            
            {user.phone && (
              <div>
                <p className="text-sm text-gray-500">{t('profile.phone')}</p>
                <div className="flex items-center">
                  <Phone size={16} className="text-gray-400 mr-2" />
                  <p>{user.phone}</p>
                </div>
              </div>
            )}
            
            {user.region && (
              <div>
                <p className="text-sm text-gray-500">{t('profile.region')}</p>
                <div className="flex items-center">
                  <MapPin size={16} className="text-gray-400 mr-2" />
                  <p>{user.region}</p>
                </div>
              </div>
            )}
            
            {user.joinedAt && (
              <div>
                <p className="text-sm text-gray-500">{t('profile.joinedDate')}</p>
                <div className="flex items-center">
                  <Calendar size={16} className="text-gray-400 mr-2" />
                  <p>{format(user.joinedAt, 'MMMM, y')}</p>
                </div>
              </div>
            )}
            
            {user.birthdate && (
              <div>
                <p className="text-sm text-gray-500">{t('profile.birthdate')}</p>
                <div className="flex items-center">
                  <Gift size={16} className="text-gray-400 mr-2" />
                  <p>{format(user.birthdate, 'PPP')}</p>
                </div>
              </div>
            )}
            
            {user.lineId && (
              <div>
                <p className="text-sm text-gray-500">{t('profile.lineId')}</p>
                <div className="flex items-center">
                  <MessageCircle size={16} className="text-gray-400 mr-2" />
                  <p>{user.lineId}</p>
                </div>
              </div>
            )}
            
            {user.memberCode && (
              <div>
                <p className="text-sm text-gray-500">{t('profile.memberCode')}</p>
                <div className="flex items-center">
                  <CreditCard size={16} className="text-gray-400 mr-2" />
                  <p>{user.memberCode}</p>
                </div>
              </div>
            )}
          </div>
          
          {(user.foodAllergy || user.personalMedicalCondition) && (
            <div className="mt-4 pt-4 border-t">
              <h4 className="text-md font-medium mb-3">{t('profile.healthInfo')}</h4>
              <div className="grid grid-cols-1 gap-4">
                {user.foodAllergy && (
                  <div>
                    <p className="text-sm text-gray-500">{t('profile.foodAllergy')}</p>
                    <div className="flex items-start">
                      <Utensils size={16} className="text-gray-400 mr-2 mt-1" />
                      <p>{user.foodAllergy}</p>
                    </div>
                  </div>
                )}
                
                {user.personalMedicalCondition && (
                  <div>
                    <p className="text-sm text-gray-500">{t('profile.medicalCondition')}</p>
                    <div className="flex items-start">
                      <Stethoscope size={16} className="text-gray-400 mr-2 mt-1" />
                      <p>{user.personalMedicalCondition}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        
        <div className="flex justify-between pt-4 mt-4">
          <Link to="/profile/edit">
            <Button variant="outline" className="flex items-center">
              <Edit size={16} className="mr-2" />
              {t('profile.edit')}
            </Button>
          </Link>
        </div>
      </div>
      
      {/* Role information */}
      <div className="section-card">
        <h3 className="text-lg font-medium border-b pb-2 mb-4">{t('profile.roleAndPermissions')}</h3>
        
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-500">{t('profile.currentRole')}</p>
            <p className="font-medium">{getUserRoleDisplay(user.role)}</p>
          </div>
          
          {user.role === UserRole.ADMIN && (
            <Link to="/users">
              <Button className="w-full mt-4 bg-camp-primary hover:bg-camp-secondary">
                {t('profile.manageUsers')}
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Settings section */}
      <div className="section-card mb-0">
        <h3 className="text-lg font-medium border-b pb-2 mb-4">{t('profile.settings')}</h3>
        
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-500">{t('profile.language')}</p>
            <div className="flex items-center mt-2">
              <Globe size={16} className="text-gray-400 mr-2" />
              <Select value={language} onValueChange={handleLanguageChange}>
                <SelectTrigger className="w-full max-w-xs">
                  <SelectValue placeholder={t('profile.selectLanguage')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">{t('profile.english')}</SelectItem>
                  <SelectItem value="th">{t('profile.thai')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
