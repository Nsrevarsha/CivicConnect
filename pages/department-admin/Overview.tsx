import { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  Users,
  MapPin
} from 'lucide-react';
import DashboardCard from '../../components/DashboardCard';
import EnhancedIssueTable from '../../components/EnhancedIssueTable';
import IssueMap from '../../components/IssueMap';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useBackend } from '../../contexts/AuthContext';
import { DashboardStats, Issue } from '@/lib/mockData';

export default function DepartmentOverview() {
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
      setIssues(issuesResponse); // Mock API returns issues directly
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
          <h1 className="text-3xl font-bold text-primary-800">Department Dashboard</h1>
          <p className="text-primary-600">Monitor department performance and team activity</p>
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
          title="Pending Issues"
          value={stats?.openIssues || 0}
          icon={<Clock className="h-4 w-4 text-orange-600" />}
          description="Awaiting assignment"
        />
        <DashboardCard
          title="In Progress"
          value={stats?.inProgressIssues || 0}
          icon={<AlertTriangle className="h-4 w-4 text-blue-600" />}
          description="Currently being worked on"
        />
        <DashboardCard
          title="Resolved Today"
          value={stats?.resolvedIssues || 0}
          icon={<CheckCircle className="h-4 w-4 text-green-600" />}
          description="Completed successfully"
        />
        <DashboardCard
          title="SLA Adherence"
          value={`${stats?.slaCompliance || 0}%`}
          icon={<TrendingUp className="h-4 w-4 text-purple-600" />}
          description="Department compliance"
        />
      </div>

      {showMap && (
        <IssueMap 
          issues={issues} // Pass issues directly since our mock data matches the expected structure
          height="400px"
          showControls={true}
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-primary-200 shadow-lg">
          <CardHeader className="bg-primary">
            <CardTitle className="text-secondary">Department Issues</CardTitle>
          </CardHeader>
          <CardContent className="bg-white">
            <EnhancedIssueTable showFilters={false} />
          </CardContent>
        </Card>

        <Card className="border-primary shadow-lg">
          <CardHeader className="bg-primary">
            <CardTitle className="text-secondary">Supervisor Performance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 bg-white">
            {[
              { name: 'John Smith', issues: 12, completion: 85 },
              { name: 'Sarah Wilson', issues: 8, completion: 92 },
              { name: 'Mike Johnson', issues: 15, completion: 78 }
            ].map((supervisor) => (
              <div key={supervisor.name} className="space-y-2 p-3 rounded-lg bg-neutral-50">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-primary-800">{supervisor.name}</span>
                  <span className="text-primary-600">
                    {supervisor.issues} issues
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-primary-500 h-2 rounded-full" 
                    style={{ width: `${supervisor.completion}%` }}
                  ></div>
                </div>
                <div className="text-xs text-primary-600">
                  {supervisor.completion}% completion rate
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
