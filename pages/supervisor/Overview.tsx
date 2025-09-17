import { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Calendar,
  MapPin,
  MessageSquare
} from 'lucide-react';
import DashboardCard from '../../components/DashboardCard';
import IssueMap from '../../components/IssueMap';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useBackend } from '../../contexts/AuthContext';
import { DashboardStats, Issue } from '@/lib/mockData';

export default function SupervisorOverview() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [myTasks, setMyTasks] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMap, setShowMap] = useState(true);
  const backend = useBackend();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [statsResponse, tasksResponse] = await Promise.all([
        backend.analytics.getDashboardStats(),
        backend.issue.list({ limit: 5 })
      ]);
      setStats(statsResponse);
      setMyTasks(tasksResponse); // Mock API returns issues directly
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-600';
      case 'high': return 'text-orange-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-primary-800">My Dashboard</h1>
          <p className="text-primary-600">Your assigned tasks and performance overview</p>
        </div>
        <Button
          onClick={() => setShowMap(!showMap)}
          variant="outline"
          className="border-primary-300 text-primary-700 hover:bg-primary-50"
        >
          <MapPin className="h-4 w-4 mr-2" />
          {showMap ? 'Hide Map' : 'Show Map'}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard
          title="Total Assigned"
          value={stats?.totalIssues || 0}
          icon={<AlertTriangle className="h-4 w-4 text-blue-600" />}
          description="All your tasks"
        />
        <DashboardCard
          title="In Progress"
          value={stats?.inProgressIssues || 0}
          icon={<Clock className="h-4 w-4 text-orange-600" />}
          description="Currently working on"
        />
        <DashboardCard
          title="Completed"
          value={stats?.resolvedIssues || 0}
          icon={<CheckCircle className="h-4 w-4 text-green-600" />}
          description="This month"
        />
        <DashboardCard
          title="SLA Performance"
          value={`${stats?.slaCompliance || 0}%`}
          icon={<Calendar className="h-4 w-4 text-purple-600" />}
          description="On-time completion"
        />
      </div>

      {showMap && (
        <IssueMap 
          issues={myTasks} // Pass myTasks directly since our mock data matches the expected structure
          height="400px"
          showControls={true}
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>My Current Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {myTasks.map((task) => (
                <div key={task.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="font-medium">{task.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {task.description}
                      </p>
                    </div>
                    <Badge variant={task.priority === 'urgent' ? 'destructive' : 'default'}>
                      {task.priority}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center text-muted-foreground">
                        <MapPin className="h-3 w-3 mr-1" />
                        {task.address}
                      </span>
                      <span className="flex items-center text-muted-foreground">
                        <Calendar className="h-3 w-3 mr-1" />
                        Reported: {new Date(task.reportedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <Button size="sm" variant="outline">
                      Update Status
                    </Button>
                  </div>
                </div>
              ))}
              
              {myTasks.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <CheckCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No active tasks assigned</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full" variant="outline">
              <Clock className="h-4 w-4 mr-2" />
              Clock In/Out
            </Button>
            <Button className="w-full" variant="outline">
              <MapPin className="h-4 w-4 mr-2" />
              Update Location
            </Button>
            <Button className="w-full" variant="outline">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Report Emergency
            </Button>
            <Button className="w-full" variant="outline">
              <MessageSquare className="h-4 w-4 mr-2" />
              Contact Admin
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Today's Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { time: '09:00', task: 'Pothole repair on Main Street', priority: 'high' },
              { time: '11:30', task: 'Streetlight inspection - Oak Avenue', priority: 'medium' },
              { time: '14:00', task: 'Park maintenance - Central Park', priority: 'low' },
              { time: '16:00', task: 'Equipment check and return', priority: 'medium' }
            ].map((item, index) => (
              <div key={index} className="flex items-center space-x-4 p-3 border rounded-lg">
                <div className="text-sm font-medium w-16">{item.time}</div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{item.task}</p>
                </div>
                <div className={`text-xs font-medium ${getPriorityColor(item.priority)}`}>
                  {item.priority}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
