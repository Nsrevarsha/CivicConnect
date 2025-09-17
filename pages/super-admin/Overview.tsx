import { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  Users,
  MapPin,
  BarChart3,
  Activity,
  Wifi
} from 'lucide-react';
import DashboardCard from '../../components/DashboardCard';
import EnhancedIssueTable from '../../components/EnhancedIssueTable';
import IssueMap from '../../components/IssueMap';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useBackend } from '../../contexts/AuthContext';
import { DashboardStats, Issue, mockUsers } from '@/lib/mockData';

export default function SuperAdminOverview() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMap, setShowMap] = useState(true);
  const backend = useBackend();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [statsResponse, issuesResponse] = await Promise.all([
        backend.analytics.getDashboardStats(),
        backend.issue.list({})
      ]);
      
      setStats(statsResponse);
      setIssues(issuesResponse); // Mock API returns issues directly, not wrapped in issues property
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-primary-800">Super Admin Dashboard</h1>
          <p className="text-primary-600">Global overview of all city operations</p>
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

      {/* Primary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard
          title="Total Issues"
          value={stats?.totalIssues || 0}
          icon={<AlertTriangle className="h-4 w-4 text-orange-600" />}
          description="All reported issues citywide"
        />
        <DashboardCard
          title="Open Issues"
          value={stats?.openIssues || 0}
          icon={<Clock className="h-4 w-4 text-blue-600" />}
          description="Pending resolution"
        />
        <DashboardCard
          title="Resolved Today"
          value={stats?.resolvedIssues || 0}
          icon={<CheckCircle className="h-4 w-4 text-green-600" />}
          description="Successfully completed"
        />
        <DashboardCard
          title="SLA Compliance"
          value={`${stats?.slaCompliance || 0}%`}
          icon={<TrendingUp className="h-4 w-4 text-purple-600" />}
          description="On-time resolution rate"
        />
      </div>

      {/* Super Admin Advanced Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <DashboardCard
          title="Active Users"
          value={mockUsers.filter(u => u.isActive).length}
          icon={<Users className="h-4 w-4 text-blue-500" />}
          description="System users online"
        />
        <DashboardCard
          title="Departments"
          value={Object.keys(stats?.departmentStats || {}).length}
          icon={<Users className="h-4 w-4 text-purple-500" />}
          description="Active departments"
        />
        <DashboardCard
          title="Urgent Issues"
          value={issues.filter(i => i.priority === 'urgent').length}
          icon={<AlertTriangle className="h-4 w-4 text-red-500" />}
          description="Require immediate attention"
        />
        <DashboardCard
          title="Overdue"
          value={issues.filter(i => i.dueDate && new Date(i.dueDate) < new Date() && i.status !== 'resolved').length}
          icon={<Clock className="h-4 w-4 text-orange-500" />}
          description="Past due date"
        />
        <DashboardCard
          title="Avg Response"
          value="2.4h"
          icon={<TrendingUp className="h-4 w-4 text-green-500" />}
          description="Average response time"
        />
        <DashboardCard
          title="Satisfaction"
          value="94%"
          icon={<CheckCircle className="h-4 w-4 text-blue-500" />}
          description="Citizen satisfaction rate"
        />
      </div>

      {/* Department Performance Overview */}
      <Card className="border-primary-200 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-primary-50 to-secondary-50">
          <CardTitle className="text-primary-800">Department Performance</CardTitle>
        </CardHeader>
        <CardContent className="bg-white">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(stats?.departmentStats || {}).map(([deptId, dept]) => (
              <div key={deptId} className="p-4 border rounded-lg bg-neutral-50">
                <h4 className="font-semibold text-primary-800">{dept.name}</h4>
                <div className="mt-2 space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Total Issues:</span>
                    <span className="font-medium">{dept.totalIssues}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Open:</span>
                    <span className="font-medium text-orange-600">{dept.openIssues}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Resolution Rate:</span>
                    <span className="font-medium text-green-600">
                      {Math.round(((dept.totalIssues - dept.openIssues) / dept.totalIssues) * 100)}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* System Health & Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-primary-200 shadow-lg">
          <CardHeader className="bg-primary">
            <CardTitle className="text-primary-800 flex items-center gap-2">
              <Activity className="h-5 w-5" />
              System Health
            </CardTitle>
          </CardHeader>
          <CardContent className="bg-white space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Server Status</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-green-600">Operational</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Database</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-green-600">Healthy</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">API Response Time</span>
              <span className="text-sm font-medium text-blue-600">142ms</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Storage Usage</span>
              <span className="text-sm font-medium">67%</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-primary-50 to-secondary-50">
            <CardTitle className="text-primary-800 flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              System Analytics
            </CardTitle>
          </CardHeader>
          <CardContent className="bg-white space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Daily Active Users</span>
              <span className="text-sm font-medium text-blue-600">{mockUsers.filter(u => u.isActive).length * 4}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Issues Created Today</span>
              <span className="text-sm font-medium text-green-600">{issues.filter(i => new Date(i.createdAt).toDateString() === new Date().toDateString()).length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Peak Load Time</span>
              <span className="text-sm font-medium">10:00 AM - 12:00 PM</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Concurrent Sessions</span>
              <span className="text-sm font-medium text-orange-600">127</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {showMap && (
        <IssueMap 
          issues={issues} // Pass issues directly since our mock data matches the expected structure
          height="500px"
          showControls={true}
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-primary shadow-lg">
          <CardHeader className="bg-primary">
            <CardTitle className="text-secondary">Recent Issues</CardTitle>
          </CardHeader>
          <CardContent className="bg-white">
            <EnhancedIssueTable showFilters={false} />
          </CardContent>
        </Card>

        <Card className="border-primary shadow-lg">
          <CardHeader className="bg-primary">
            <CardTitle className="text-secondary">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 bg-white">
            {stats?.recentActivity?.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg bg-neutral-50">
                <div className="flex-shrink-0 mt-1">
                  {activity.type === 'issue_created' && (
                    <AlertTriangle className="h-4 w-4 text-orange-500" />
                  )}
                  {activity.type === 'issue_updated' && (
                    <Clock className="h-4 w-4 text-blue-500" />
                  )}
                  {activity.type === 'issue_resolved' && (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-primary-800">{activity.description}</p>
                  <p className="text-xs text-primary-600">
                    {new Date(activity.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
