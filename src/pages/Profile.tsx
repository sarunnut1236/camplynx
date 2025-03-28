
import React from 'react';
import { Link } from 'react-router-dom';
import { Edit, User, Mail, Phone, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PageHeader from '@/components/PageHeader';
import { useAuth } from '@/contexts/AuthContext';

const Profile = () => {
  const { user } = useAuth();
  
  if (!user) {
    return <div>Loading profile...</div>;
  }

  return (
    <div className="page-container pb-20">
      <PageHeader 
        title="Profile Management" 
        showBackButton={false}
      />
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col items-center mb-6">
          {user.profileImage ? (
            <img 
              src={user.profileImage} 
              alt={user.name}
              className="w-24 h-24 rounded-full object-cover mb-3"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-camp-light flex items-center justify-center mb-3">
              <User size={36} className="text-camp-primary" />
            </div>
          )}
          <h2 className="text-xl font-semibold">{user.name}</h2>
          {user.title && <p className="text-gray-600">{user.title}</p>}
          {user.bio && <p className="text-sm text-gray-500 text-center mt-2">{user.bio}</p>}
        </div>
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium border-b pb-2 mb-4">Profile Details</h3>
          
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Name</p>
              <div className="flex items-center">
                <User size={16} className="text-gray-400 mr-2" />
                <p>{user.name}</p>
              </div>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <div className="flex items-center">
                <Mail size={16} className="text-gray-400 mr-2" />
                <p>{user.email}</p>
              </div>
            </div>
            
            {user.phone && (
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <div className="flex items-center">
                  <Phone size={16} className="text-gray-400 mr-2" />
                  <p>{user.phone}</p>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex justify-between pt-4">
            <Link to="/profile/edit">
              <Button variant="outline" className="flex items-center">
                <Edit size={16} className="mr-2" />
                Edit
              </Button>
            </Link>
            
            <Button 
              variant="outline" 
              className="text-red-500 border-red-200 hover:bg-red-50"
            >
              <Trash2 size={16} className="mr-2" />
              Delete Optional Fields
            </Button>
          </div>
        </div>
      </div>
      
      {/* Role information */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-medium border-b pb-2 mb-4">Role & Permissions</h3>
        
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-500">Current Role</p>
            <p className="font-medium capitalize">{user.role}</p>
          </div>
          
          {user.role === 'admin' && (
            <Link to="/users">
              <Button className="w-full mt-4 bg-camp-primary hover:bg-camp-secondary">
                Manage Users & Roles
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
