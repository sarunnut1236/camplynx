
import React from 'react';
import { LogOut, User, Bell, Shield, HelpCircle } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import PageHeader from '@/components/PageHeader';
import { useAuth } from '@/contexts/AuthContext';

const Settings = () => {
  const { user, logout } = useAuth();

  return (
    <div className="page-container pb-20">
      <PageHeader 
        title="Settings" 
        showBackButton={false}
      />
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4">
          <h2 className="text-lg font-medium">Account Settings</h2>
        </div>
        
        <Separator />
        
        <div className="p-4">
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center">
              <User size={18} className="mr-3 text-gray-500" />
              <span>Profile Information</span>
            </div>
            <span className="text-sm text-gray-500">Edit</span>
          </div>
          
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center">
              <Bell size={18} className="mr-3 text-gray-500" />
              <span>Notifications</span>
            </div>
            <Switch />
          </div>
          
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center">
              <Shield size={18} className="mr-3 text-gray-500" />
              <span>Role & Permissions</span>
            </div>
            <span className="text-sm font-medium capitalize">{user?.role}</span>
          </div>
        </div>
        
        <Separator />
        
        <div className="p-4">
          <h2 className="text-lg font-medium">Support</h2>
        </div>
        
        <Separator />
        
        <div className="p-4">
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center">
              <HelpCircle size={18} className="mr-3 text-gray-500" />
              <span>Help & FAQ</span>
            </div>
            <span className="text-sm text-gray-500">View</span>
          </div>
          
          <button 
            onClick={logout}
            className="flex items-center text-red-500 py-2 w-full"
          >
            <LogOut size={18} className="mr-3" />
            <span>Logout</span>
          </button>
        </div>
      </div>
      
      <div className="mt-6 text-center text-sm text-gray-500">
        <p>CampLynx v1.0.0</p>
        <p>© 2024 CampLynx. All rights reserved.</p>
      </div>
    </div>
  );
};

export default Settings;
