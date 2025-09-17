import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { AlertTriangle, ArrowUp, Clock } from 'lucide-react';

export default function DepartmentEscalations() {
  const escalations = [
    {
      id: '1',
      title: 'Traffic Light Malfunction',
      description: 'Critical intersection traffic light not functioning',
      priority: 'high',
      assignedTo: 'John Smith',
      createdAt: '2 hours ago',
      canEscalate: true
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Escalation Panel</h1>
        <p className="text-gray-600">Escalate unresolved issues to Super Admin</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Issues Pending Escalation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {escalations.map((issue) => (
                <div key={issue.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium">{issue.title}</h4>
                    <Badge variant="destructive">
                      {issue.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {issue.description}
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-4">
                      <span className="text-muted-foreground">
                        Assigned to: {issue.assignedTo}
                      </span>
                      <span className="flex items-center text-muted-foreground">
                        <Clock className="h-3 w-3 mr-1" />
                        {issue.createdAt}
                      </span>
                    </div>
                    {issue.canEscalate && (
                      <Button size="sm" variant="outline">
                        <ArrowUp className="h-3 w-3 mr-1" />
                        Escalate
                      </Button>
                    )}
                  </div>
                </div>
              ))}
              
              {escalations.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <AlertTriangle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No issues pending escalation</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Escalate Issue</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Issue ID</Label>
              <p className="text-sm text-muted-foreground">
                Select an issue from the list to escalate
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="reason">Escalation Reason</Label>
              <Textarea 
                id="reason"
                placeholder="Please explain why this issue needs to be escalated..."
                rows={4}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Priority Level</Label>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">High</Button>
                <Button variant="destructive" size="sm">Urgent</Button>
                <Button variant="outline" size="sm">Emergency</Button>
              </div>
            </div>
            
            <Button className="w-full" disabled>
              <ArrowUp className="h-4 w-4 mr-2" />
              Escalate to Super Admin
            </Button>
            
            <p className="text-xs text-muted-foreground">
              Escalated issues will be immediately forwarded to the Super Admin for review
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
