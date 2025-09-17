import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Clock, User, MapPin } from 'lucide-react';

export default function EscalationInbox() {
  const escalations = [
    {
      id: '1',
      title: 'Water Main Break - Emergency',
      description: 'Major water main break causing street flooding',
      priority: 'urgent',
      escalatedBy: 'John Smith',
      escalatedAt: '30 minutes ago',
      department: 'Public Works',
      location: '789 Pine Street'
    },
    {
      id: '2',
      title: 'Power Outage - Multiple Blocks',
      description: 'Widespread power outage affecting 500+ homes',
      priority: 'high',
      escalatedBy: 'Sarah Johnson',
      escalatedAt: '2 hours ago',
      department: 'Utilities',
      location: 'Downtown District'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Escalation Inbox</h1>
        <p className="text-gray-600">Manage critical issues requiring immediate attention</p>
      </div>

      <div className="grid gap-6">
        {escalations.map((escalation) => (
          <Card key={escalation.id} className="border-l-4 border-l-red-500">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2 text-red-500" />
                  {escalation.title}
                </CardTitle>
                <Badge variant="destructive">
                  {escalation.priority}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">{escalation.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Escalated by</p>
                    <p className="text-sm text-muted-foreground">{escalation.escalatedBy}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Time</p>
                    <p className="text-sm text-muted-foreground">{escalation.escalatedAt}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Location</p>
                    <p className="text-sm text-muted-foreground">{escalation.location}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button size="sm">
                  Take Action
                </Button>
                <Button variant="outline" size="sm">
                  Assign Team
                </Button>
                <Button variant="outline" size="sm">
                  Request Support
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
