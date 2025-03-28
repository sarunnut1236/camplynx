
import React, { useState } from 'react';
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
  DialogTrigger,
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
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';

// Mock user data for demo
const mockUsers = [
  {
    id: '1',
    name: 'Jane Cooper',
    email: 'jane@example.com',
    role: 'admin' as UserRole,
    profileImage: '/lovable-uploads/439db2b7-c4d3-4bd9-ab25-68e85d686991.png',
  },
  {
    id: '2',
    name: 'John Smith',
    email: 'john@example.com',
    role: 'joiner' as UserRole,
  },
  {
    id: '3',
    name: 'Emily Davis',
    email: 'emily@example.com',
    role: 'joiner' as UserRole,
  },
  {
    id: '4',
    name: 'Michael Brown',
    email: 'michael@example.com',
    role: 'joiner' as UserRole,
  },
];

const Users = () => {
  const { hasPermission, user: currentUser } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState(mockUsers);
  const [selectedUser, setSelectedUser] = useState<typeof mockUsers[0] | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newRole, setNewRole] = useState<UserRole | ''>('');
  
  // Check if user has admin permission
  if (!hasPermission('admin')) {
    return <div className="p-6">Unauthorized access</div>;
  }
  
  const handleRoleChange = (userId: string, newRole: UserRole) => {
    setUsers(prev => 
      prev.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      )
    );
    
    setDialogOpen(false);
    setSelectedUser(null);
    
    toast({
      title: "Role updated",
      description: `User role has been updated to ${newRole}.`,
    });
  };
  
  const openRoleDialog = (user: typeof mockUsers[0]) => {
    setSelectedUser(user);
    setNewRole(user.role);
    setDialogOpen(true);
  };

  return (
    <div className="page-container pb-20">
      <PageHeader title="Manage Users" />
      
      <div className="mb-6">
        <p className="text-gray-600">
          As an admin, you can manage user roles and permissions.
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
                  alt={user.name}
                  className="w-10 h-10 rounded-full object-cover mr-3"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-camp-light flex items-center justify-center mr-3">
                  <User size={18} className="text-camp-primary" />
                </div>
              )}
              
              <div>
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
                <div className="flex items-center mt-1">
                  <Shield size={14} className="text-camp-primary mr-1" />
                  <span className="text-xs font-medium capitalize">{user.role}</span>
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
                    Change Role
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
            <DialogTitle>Change User Role</DialogTitle>
            <DialogDescription>
              Update the role for {selectedUser?.name}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <Label htmlFor="role" className="mb-2 block">Select Role</Label>
            <Select 
              value={newRole} 
              onValueChange={(value) => setNewRole(value as UserRole)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="joiner">Joiner</SelectItem>
                <SelectItem value="guest">Guest</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={() => selectedUser && newRole && handleRoleChange(selectedUser.id, newRole as UserRole)}
              disabled={!newRole || newRole === selectedUser?.role}
              className="bg-camp-primary hover:bg-camp-secondary"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Users;
