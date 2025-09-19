import { useState } from 'react';
import { Bell, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '../contexts/AuthContext';
import NotificationPanel from './NotificationPanel';

export default function Header() {
  const { user, logout } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);

  const getDashboardTitle = () => {
    if (user?.role === 'super_admin') return 'Super Admin Dashboard';
    if (user?.role === 'department_admin') return 'Department Dashboard';
    if (user?.role === 'supervisor') return 'Supervisor Dashboard';
    return 'Dashboard';
  };

  const getShortTitle = () => {
    if (user?.role === 'super_admin') return 'Super Admin';
    if (user?.role === 'department_admin') return 'Department';
    if (user?.role === 'supervisor') return 'Supervisor';
    return 'Dashboard';
  };

  return (
    <header className="bg-white shadow-sm border-b px-4 sm:px-6 py-3 sm:py-4">
      <div className="flex items-center justify-end">
        {/* Actions Section */}
        <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
          {/* Notifications Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowNotifications(true)}
            className="relative h-8 w-8 sm:h-10 sm:w-10"
          >
            <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
            <Badge className="absolute -top-1 -right-1 h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center p-0 text-[10px] sm:text-xs">
              3
            </Badge>
          </Button>
          
          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-10 sm:w-10">
                <User className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 sm:w-56">
              {/* User Info */}
              <div className="px-2 py-1.5">
                <div className="text-sm font-medium truncate">
                  {user?.email}
                </div>
                <div className="text-xs text-muted-foreground capitalize">
                  {user?.role?.replace('_', ' ')}
                </div>
              </div>
              
              {/* Logout */}
              <DropdownMenuItem onClick={logout} className="text-sm">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {/* Notification Panel */}
      <NotificationPanel 
        open={showNotifications} 
        onClose={() => setShowNotifications(false)} 
      />
    </header>
  );
}