import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowUp, AlertTriangle, Clock, Info } from 'lucide-react';

export default function SupervisorEscalation() {
  const [selectedIssueId, setSelectedIssueId] = useState('');
  const [escalationReason, setEscalationReason] = useState('');
  const [urgencyLevel, setUrgencyLevel] = useState('');

  const myIssues = [
    {
      id: '1',
      title: 'Water Main Break',
      description: 'Major water line rupture causing flooding',
      priority: 'urgent',
      assignedAt: '2 hours ago',
      canEscalate: true
    },
    {
      id: '2',
      title: 'Traffic Light Malfunction',
      description: 'Intersection signal not functioning properly',
      priority: 'high',
      assignedAt: '4 hours ago',
      canEscalate: true
    }
  ];

  const escalationGuidelines = [
    {
      title: 'Emergency Situations',
      description: 'Life-threatening situations requiring immediate response',
      examples: ['Water main breaks', 'Gas leaks', 'Structural collapses']
    },
    {
      title: 'Resource Constraints',
      description: 'When additional resources or expertise is needed',
      examples: ['Specialized equipment', 'Additional personnel', 'Technical expertise']
    },
    {
      title: 'Time-Sensitive Issues',
      description: 'Issues approaching SLA deadlines that cannot be resolved',
      examples: ['Complex repairs', 'External dependencies', 'Weather delays']
    }
  ];

  const handleEscalate = () => {
    if (!selectedIssueId || !escalationReason || !urgencyLevel) {
      alert('Please fill in all required fields');
      return;
    }
    
    // In real app, make API call to escalate
    alert('Issue escalated successfully!');
    setSelectedIssueId('');
    setEscalationReason('');
    setUrgencyLevel('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Escalate Issue</h1>
        <p className="text-gray-600">Request help from department admin for urgent or blocked issues</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <ArrowUp className="h-5 w-5 mr-2" />
              Escalate Issue
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="issue">Select Issue</Label>
              <Select value={selectedIssueId} onValueChange={setSelectedIssueId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose an issue to escalate" />
                </SelectTrigger>
                <SelectContent>
                  {myIssues.map((issue) => (
                    <SelectItem key={issue.id} value={issue.id}>
                      {issue.title} - {issue.priority}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="urgency">Urgency Level</Label>
              <Select value={urgencyLevel} onValueChange={setUrgencyLevel}>
                <SelectTrigger>
                  <SelectValue placeholder="Select urgency level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High - Needs attention within 2 hours</SelectItem>
                  <SelectItem value="urgent">Urgent - Needs immediate attention</SelectItem>
                  <SelectItem value="emergency">Emergency - Life/property at risk</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reason">Escalation Reason</Label>
              <Textarea
                id="reason"
                value={escalationReason}
                onChange={(e) => setEscalationReason(e.target.value)}
                placeholder="Please explain why this issue needs to be escalated..."
                rows={4}
              />
            </div>

            <Button 
              onClick={handleEscalate}
              className="w-full"
              disabled={!selectedIssueId || !escalationReason || !urgencyLevel}
            >
              <ArrowUp className="h-4 w-4 mr-2" />
              Escalate to Department Admin
            </Button>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <Info className="h-4 w-4 text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Escalation Notice</p>
                  <p>Your department admin will be immediately notified and will review the escalation within 30 minutes during business hours.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>My Current Issues</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {myIssues.map((issue) => (
                  <div key={issue.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium">{issue.title}</h4>
                      <Badge variant={issue.priority === 'urgent' ? 'destructive' : 'default'}>
                        {issue.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      {issue.description}
                    </p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center text-muted-foreground">
                        <Clock className="h-3 w-3 mr-1" />
                        Assigned {issue.assignedAt}
                      </span>
                      {issue.canEscalate && (
                        <Badge variant="outline">Can escalate</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2" />
                Escalation Guidelines
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {escalationGuidelines.map((guideline, index) => (
                  <div key={index} className="space-y-2">
                    <h4 className="font-medium text-sm">{guideline.title}</h4>
                    <p className="text-xs text-muted-foreground">
                      {guideline.description}
                    </p>
                    <div className="text-xs text-muted-foreground">
                      Examples: {guideline.examples.join(', ')}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
