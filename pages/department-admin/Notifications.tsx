import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
import { Send, Bell } from 'lucide-react';

export default function DepartmentNotifications() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Department Notifications</h1>
        <p className="text-gray-600">Send alerts and updates to your team</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Send Department Alert</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="recipients">Recipients</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select recipients" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all_supervisors">All Supervisors</SelectItem>
                  <SelectItem value="active_supervisors">Active Supervisors</SelectItem>
                  <SelectItem value="specific">Specific Supervisors</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="title">Alert Title</Label>
              <Input placeholder="Enter alert title" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea placeholder="Enter your message..." rows={4} />
            </div>
            
            <Button className="w-full">
              <Send className="h-4 w-4 mr-2" />
              Send Alert
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="h-5 w-5 mr-2" />
              Recent Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium">Weekend Schedule Update</h4>
                  <span className="text-xs text-muted-foreground">2 hours ago</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Updated weekend coverage schedule for emergency responses
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Sent to: All Supervisors
                </p>
              </div>
              
              <div className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium">Equipment Maintenance</h4>
                  <span className="text-xs text-muted-foreground">1 day ago</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Scheduled maintenance for department vehicles this Friday
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Sent to: Active Supervisors
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
