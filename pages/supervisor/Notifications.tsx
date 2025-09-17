import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bell, CheckCircle, AlertTriangle, Info, X } from 'lucide-react';

export default function SupervisorNotifications() {
  const notifications = [
    {
      id: '1',
      title: 'New Task Assigned',
      message: 'High priority pothole repair on Main Street has been assigned to you',
      type: 'info',
      timestamp: '30 minutes ago',
      isRead: false
    },
    {
      id: '2',
      title: 'SLA Warning',
      message: 'Task #456 is approaching its deadline (2 hours remaining)',
      type: 'warning', 
      timestamp: '1 hour ago',
      isRead: false
    },
    {
      id: '3',
      title: 'Task Completed',
      message: 'Streetlight repair on Oak Avenue has been marked as completed',
      type: 'success',
      timestamp: '3 hours ago',
      isRead: true
    },
    {
      id: '4',
      title: 'Emergency Alert',
      message: 'Water main break reported - all available supervisors respond',
      type: 'error',
      timestamp: '5 hours ago',
      isRead: true
    }
  ];

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  const getNotificationBorder = (type: string) => {
    switch (type) {
      case 'error': return 'border-l-red-500';
      case 'warning': return 'border-l-yellow-500';
      case 'success': return 'border-l-green-500';
      default: return 'border-l-blue-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-600">Stay updated with your task alerts and messages</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <CheckCircle className="h-4 w-4 mr-2" />
            Mark All Read
          </Button>
          <Button variant="outline" size="sm">
            <X className="h-4 w-4 mr-2" />
            Clear All
          </Button>
        </div>
      </div>

      <div className="grid gap-4">
        {notifications.map((notification) => (
          <Card 
            key={notification.id} 
            className={`border-l-4 ${getNotificationBorder(notification.type)} ${
              !notification.isRead ? 'bg-blue-50/30' : ''
            }`}
          >
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                {getNotificationIcon(notification.type)}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium text-gray-900">
                          {notification.title}
                        </p>
                        {!notification.isRead && (
                          <Badge variant="destructive" className="text-xs">New</Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        {notification.timestamp}
                      </p>
                    </div>
                    <Button variant="ghost" size="sm">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {notifications.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Bell className="h-8 w-8 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600">No notifications</p>
            <p className="text-sm text-gray-500 mt-1">
              You're all caught up! New alerts will appear here.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
