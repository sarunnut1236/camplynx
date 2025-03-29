import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';

const Welcome = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  useAuth();

  // Automatically redirect to home page
  useEffect(() => {
    navigate('/home');
  }, [navigate]);

  // Just a loading screen while redirect happens
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-b from-white to-camp-light">
      <div className="w-full max-w-md flex flex-col items-center">
        <div className="mb-12 animate-fade-in">
          <div className="flex items-center justify-center mb-4">
            <img 
              src="/yns-logo.png" 
              alt={t('app.logoAlt')} 
              className="w-48 h-auto"
            />
          </div>
          <h1 className="text-3xl font-bold text-center text-gray-800">{t('app.title')}</h1>
          <p className="text-center text-gray-600 mt-2">{t('app.subtitle')}</p>
        </div>
        <div className="mt-4 text-center">
          <p>{t('app.redirecting')}</p>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
