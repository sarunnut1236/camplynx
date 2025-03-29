import { useState, useEffect } from 'react';
import { Shield, User, Edit, MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import PageHeader from '@/components/PageHeader';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole, getUserRoleDisplay } from '@/enums/User';
import { useToast } from '@/components/ui/use-toast';
import { useTranslation } from 'react-i18next';
import { getAllUsers, updateUser } from '@/providers/users';
import { User as UserType } from '@/models/User';

const Users = () => {
  const { hasPermission, user: currentUser } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation();
  const [users, setUsers] = useState<UserType[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newRole, setNewRole] = useState<UserRole | ''>('');
  const [loading, setLoading] = useState(true);
  
  // Load users on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersData = await getAllUsers();
        setUsers(usersData);
      } catch (error) {
        console.error("Error fetching users:", error);
        toast({
          title: "Error",
          description: "Failed to load users. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, [toast]);
  
  // Check if user has admin permission
  if (!hasPermission(UserRole.ADMIN)) {
    return <div className="p-6">{t('users.unauthorized')}</div>;
  }
  
  if (loading) {
    return <div className="p-6">{t('common.loading')}</div>;
  }
  
  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    try {
      const updatedUser = await updateUser(userId, { role: newRole });
      
      if (updatedUser) {
        setUsers(prev => 
          prev.map(user => 
            user.id === userId ? { ...user, role: newRole } : user
          )
        );
        
        toast({
          title: t('users.roleUpdated'),
          description: t('users.roleUpdatedDescription', { role: getUserRoleDisplay(newRole) }),
        });
      }
    } catch (error) {
      console.error("Error updating user role:", error);
      toast({
        title: "Error",
        description: "Failed to update user role. Please try again.",
        variant: "destructive",
      });
    }
    
    setDialogOpen(false);
    setSelectedUser(null);
  };
  
  const openRoleDialog = (user: UserType) => {
    setSelectedUser(user);
    setNewRole(user.role);
    setDialogOpen(true);
  };

  return (
    <div className="page-container pb-20 min-h-screen">
      <PageHeader title={t('users.manageUsers')} />
      
      <div className="mb-6">
        <p className="text-gray-600">
          {t('users.adminDescription')}
        </p>
      </div>
      
      <div className="space-y-4">
        {users.map((user) => (
          <div 
            key={user.id} 
            className="bg-white rounded-lg shadow-sm p-4 flex items-center justify-between"
          >
            <div className="flex items-center">
              {user.profileImage ? (
                <img 
                  src={user.profileImage} 
                  alt={user.firstname}
                  className="w-10 h-10 rounded-full object-cover mr-3"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-camp-light flex items-center justify-center mr-3">
                  <User size={18} className="text-camp-primary" />
                </div>
              )}
              
              <div>
                <p className="font-medium">{user.firstname}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
                <div className="flex items-center mt-1">
                  <Shield size={14} className="text-camp-primary mr-1" />
                  <span className="text-xs font-medium">{getUserRoleDisplay(user.role)}</span>
                </div>
              </div>
            </div>
            
            {/* Don't allow changing own role */}
            {user.id !== currentUser?.id && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal size={18} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => openRoleDialog(user)}>
                    <Edit size={14} className="mr-2" />
                    {t('users.changeRole')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        ))}
      </div>
      
      {/* Role change dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t('users.changeRoleTitle')}</DialogTitle>
            <DialogDescription>
              {t('users.changeRoleDescription', { name: selectedUser?.firstname })}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <Label htmlFor="role" className="mb-2 block">{t('users.selectRole')}</Label>
            <Select 
              value={newRole} 
              onValueChange={(value) => setNewRole(value as UserRole)}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('users.selectRolePlaceholder')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={UserRole.ADMIN}>{t('roles.admin')}</SelectItem>
                <SelectItem value={UserRole.JOINER}>{t('roles.joiner')}</SelectItem>
                <SelectItem value={UserRole.GUEST}>{t('roles.guest')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setDialogOpen(false)}
            >
              {t('common.cancel')}
            </Button>
            <Button 
              onClick={() => selectedUser && newRole && handleRoleChange(selectedUser.id, newRole as UserRole)}
              disabled={!newRole || newRole === selectedUser?.role}
              className="bg-camp-primary hover:bg-camp-secondary"
            >
              {t('common.saveChanges')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Users;
