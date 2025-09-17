import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Send, AlertTriangle, Info } from 'lucide-react';

export default function NotificationCenter() {
  const recentNotifications = [
    {
      id: '1',
      title: 'Emergency Water Main Break',
      type: 'emergency',
      recipients: 'All Departments',
      sentAt: '2 hours ago'
    },
    {
      id: '2',
      title: 'Weekly Performance Report',
      type: 'regular',
      recipients: 'Department Admins',
      sentAt: '1 day ago'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Notification Center</h1>
        <p className="text-gray-600">Send alerts and notifications citywide</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Send Notification</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="type">Notification Type</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="emergency">Emergency Alert</SelectItem>
                  <SelectItem value="regular">Regular Update</SelectItem>
                  <SelectItem value="maintenance">Maintenance Notice</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="recipients">Recipients</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select recipients" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  <SelectItem value="dept_admins">Department Admins</SelectItem>
                  <SelectItem value="supervisors">Supervisors Only</SelectItem>
                  <SelectItem value="region">By Region</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input placeholder="Notification title" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea placeholder="Enter your message..." rows={4} />
            </div>
            
            <Button className="w-full">
              <Send className="h-4 w-4 mr-2" />
              Send Notification
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentNotifications.map((notification) => (
                <div key={notification.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium">{notification.title}</h4>
                    <Badge variant={notification.type === 'emergency' ? 'destructive' : 'default'}>
                      {notification.type === 'emergency' ? (
                        <AlertTriangle className="h-3 w-3 mr-1" />
                      ) : (
                        <Info className="h-3 w-3 mr-1" />
                      )}
                      {notification.type}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    To: {notification.recipients}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Sent {notification.sentAt}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
