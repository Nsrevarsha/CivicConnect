import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Camera, MapPin, Clock, CheckCircle, Upload } from 'lucide-react';
import { useBackend } from '../../contexts/AuthContext';
import { Issue } from '@/lib/mockData';

export default function TaskManagement() {
  const [tasks, setTasks] = useState<Issue[]>([]);
  const [selectedTask, setSelectedTask] = useState<Issue | null>(null);
  const [loading, setLoading] = useState(true);
  const backend = useBackend();

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const response = await backend.issue.list({});
      setTasks(response); // Mock API returns issues directly
    } catch (error) {
      console.error('Failed to load tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'secondary';
      case 'in_progress': return 'default';
      case 'resolved': return 'default';
      case 'escalated': return 'destructive';
      default: return 'secondary';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Task Management</h1>
        <p className="text-gray-600">View and update your assigned tasks</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>My Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tasks.map((task) => (
                <div 
                  key={task.id} 
                  className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                    selectedTask?.id === task.id ? 'border-primary bg-primary/5' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedTask(task)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium">{task.title}</h4>
                    <Badge variant={getStatusColor(task.status)}>
                      {task.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-3">
                    {task.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center text-muted-foreground">
                        <MapPin className="h-3 w-3 mr-1" />
                        {task.address}
                      </span>
                      <Badge variant={task.priority === 'urgent' ? 'destructive' : 'outline'}>
                        {task.priority}
                      </Badge>
                    </div>
                    <span className="flex items-center text-muted-foreground">
                      <Clock className="h-3 w-3 mr-1" />
                      Reported: {new Date(task.reportedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Task Details & Updates</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedTask ? (
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">{selectedTask.title}</h3>
                  <p className="text-sm text-muted-foreground">{selectedTask.description}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Priority:</span>
                    <Badge className="ml-2" variant={selectedTask.priority === 'urgent' ? 'destructive' : 'default'}>
                      {selectedTask.priority}
                    </Badge>
                  </div>
                  <div>
                    <span className="font-medium">Status:</span>
                    <Badge className="ml-2" variant={getStatusColor(selectedTask.status)}>
                      {selectedTask.status.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Update Status</Label>
                  <Select defaultValue={selectedTask.status}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Progress Notes</Label>
                  <Textarea 
                    placeholder="Add notes about your progress..."
                    rows={3}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Upload Photo Evidence</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Camera className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600">
                      Click to upload photos or drag and drop
                    </p>
                    <Input type="file" accept="image/*" multiple className="hidden" />
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Button className="flex-1">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Update Task
                  </Button>
                  <Button variant="outline">
                    <Upload className="h-4 w-4 mr-2" />
                    Save Draft
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <CheckCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>Select a task to view details and update progress</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
