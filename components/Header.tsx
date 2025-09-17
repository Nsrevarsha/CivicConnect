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

  return (
    <header className="bg-white shadow-sm border-b px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            {user?.role === 'super_admin' && 'Super Admin Dashboard'}
            {user?.role === 'department_admin' && 'Department Dashboard'}
            {user?.role === 'supervisor' && 'Supervisor Dashboard'}
          </h2>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowNotifications(true)}
            className="relative"
          >
            <Bell className="h-5 w-5" />
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
              3
            </Badge>
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-2 py-1.5 text-sm font-medium">
                {user?.email}
              </div>
              <div className="px-2 py-1.5 text-xs text-muted-foreground capitalize">
                {user?.role?.replace('_', ' ')}
              </div>
              <DropdownMenuItem onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <NotificationPanel 
        open={showNotifications} 
        onClose={() => setShowNotifications(false)} 
      />
    </header>
  );
}
