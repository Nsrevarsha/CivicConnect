import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Calendar,
  Download,
  Filter,
  RefreshCw,
  Users,
  AlertTriangle,
  CheckCircle,
  Clock,
  FileSpreadsheet,
  PieChart,
  LineChart
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useBackend } from '../../contexts/AuthContext';
import { DashboardStats } from '@/lib/mockData';

interface AnalyticsData {
  issuesByStatus: { status: string; count: number; percentage: number }[];
  issuesByPriority: { priority: string; count: number; percentage: number }[];
  issuesByDepartment: { department: string; count: number; percentage: number }[];
  resolutionTimes: { range: string; count: number; percentage: number }[];
  userActivity: { date: string; active_users: number; issues_created: number }[];
  systemMetrics: {
    api_response_time: number;
    database_queries: number;
    error_rate: number;
    uptime: number;
  };
}

export default function SystemAnalytics() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('7d');
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const backend = useBackend();

  useEffect(() => {
    loadAnalyticsData();
  }, [dateRange]);

  const loadAnalyticsData = async () => {
    setLoading(true);
    try {
      const [dashboardStats] = await Promise.all([
        backend.analytics.getDashboardStats(),
        // In a real app, you would fetch analytics data here
      ]);

      setStats(dashboardStats);
      
      // Mock analytics data - in real app this would come from backend
      setAnalyticsData({
        issuesByStatus: [
          { status: 'Open', count: 45, percentage: 35 },
          { status: 'In Progress', count: 38, percentage: 30 },
          { status: 'Resolved', count: 42, percentage: 33 },
          { status: 'Closed', count: 3, percentage: 2 }
        ],
        issuesByPriority: [
          { priority: 'Low', count: 52, percentage: 41 },
          { priority: 'Medium', count: 46, percentage: 36 },
          { priority: 'High', count: 23, percentage: 18 },
          { priority: 'Urgent', count: 7, percentage: 5 }
        ],
        issuesByDepartment: [
          { department: 'Public Works', count: 48, percentage: 38 },
          { department: 'Police', count: 32, percentage: 25 },
          { department: 'Fire Department', count: 28, percentage: 22 },
          { department: 'Sanitation', count: 20, percentage: 15 }
        ],
        resolutionTimes: [
          { range: '< 1 hour', count: 23, percentage: 18 },
          { range: '1-6 hours', count: 45, percentage: 35 },
          { range: '6-24 hours', count: 38, percentage: 30 },
          { range: '> 24 hours', count: 22, percentage: 17 }
        ],
        userActivity: [
          { date: '2024-01-15', active_users: 142, issues_created: 23 },
          { date: '2024-01-16', active_users: 156, issues_created: 18 },
          { date: '2024-01-17', active_users: 134, issues_created: 31 },
          { date: '2024-01-18', active_users: 167, issues_created: 27 },
          { date: '2024-01-19', active_users: 189, issues_created: 22 },
          { date: '2024-01-20', active_users: 178, issues_created: 35 },
          { date: '2024-01-21', active_users: 203, issues_created: 29 }
        ],
        systemMetrics: {
          api_response_time: 142,
          database_queries: 15847,
          error_rate: 0.2,
          uptime: 99.8
        }
      });
      
      setLastRefresh(new Date());
    } catch (error) {
      console.error('Failed to load analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportReport = (format: 'pdf' | 'excel') => {
    // In a real app, this would trigger report generation and download
    alert(`Exporting ${format.toUpperCase()} report...`);
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
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-primary-800">System Analytics</h1>
          <p className="text-primary-600">Comprehensive insights and performance metrics</p>
          <p className="text-sm text-gray-500 mt-1">
            Last updated: {lastRefresh.toLocaleTimeString()}
          </p>
        </div>
        <div className="flex gap-2">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md bg-white text-sm"
          >
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
          </select>
          <Button
            onClick={loadAnalyticsData}
            variant="outline"
            className="border-primary-300 text-primary-700 hover:bg-primary-50"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button
            onClick={() => handleExportReport('pdf')}
            variant="outline"
            className="border-primary-300 text-primary-700 hover:bg-primary-50"
          >
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
          <Button
            onClick={() => handleExportReport('excel')}
            className="bg-primary-600 hover:bg-primary-700 text-white"
          >
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            Export Excel
          </Button>
        </div>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-primary shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-primary-600">Total Issues</p>
                <p className="text-3xl font-bold text-primary-800">{stats?.totalIssues || 0}</p>
                <p className="text-sm text-green-600 mt-1">↑ 12% from last period</p>
              </div>
              <AlertTriangle className="h-12 w-12 text-primary-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Resolution Rate</p>
                <p className="text-3xl font-bold text-green-800">{stats?.slaCompliance || 0}%</p>
                <p className="text-sm text-green-600 mt-1">↑ 5% from last period</p>
              </div>
              <CheckCircle className="h-12 w-12 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Avg Response Time</p>
                <p className="text-3xl font-bold text-blue-800">2.4h</p>
                <p className="text-sm text-red-600 mt-1">↑ 8% from last period</p>
              </div>
              <Clock className="h-12 w-12 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-200 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Active Users</p>
                <p className="text-3xl font-bold text-purple-800">127</p>
                <p className="text-sm text-green-600 mt-1">↑ 15% from last period</p>
              </div>
              <Users className="h-12 w-12 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Issues by Status */}
        <Card className="border-primary-200 shadow-lg">
          <CardHeader className="bg-primary">
            <CardTitle className="text-secondary flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Issues by Status
            </CardTitle>
          </CardHeader>
          <CardContent className="bg-white p-6">
            <div className="space-y-4">
              {analyticsData?.issuesByStatus.map((item) => (
                <div key={item.status} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ 
                        backgroundColor: 
                          item.status === 'Open' ? '#ef4444' :
                          item.status === 'In Progress' ? '#f59e0b' :
                          item.status === 'Resolved' ? '#10b981' : '#6b7280'
                      }}
                    ></div>
                    <span className="font-medium">{item.status}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold">{item.count}</span>
                    <span className="text-sm text-gray-500 ml-2">({item.percentage}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Issues by Priority */}
        <Card className="border-primary-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-primary-50 to-secondary-50">
            <CardTitle className="text-primary-800 flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Issues by Priority
            </CardTitle>
          </CardHeader>
          <CardContent className="bg-white p-6">
            <div className="space-y-4">
              {analyticsData?.issuesByPriority.map((item) => (
                <div key={item.priority} className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">{item.priority}</span>
                    <span className="font-bold">{item.count} ({item.percentage}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full"
                      style={{ 
                        width: `${item.percentage}%`,
                        backgroundColor:
                          item.priority === 'Urgent' ? '#dc2626' :
                          item.priority === 'High' ? '#ea580c' :
                          item.priority === 'Medium' ? '#d97706' : '#65a30d'
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Department Performance */}
        <Card className="border-primary-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-primary-50 to-secondary-50">
            <CardTitle className="text-primary-800 flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Department Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="bg-white p-6">
            <div className="space-y-4">
              {analyticsData?.issuesByDepartment.map((item) => (
                <div key={item.department} className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">{item.department}</span>
                    <span className="font-bold">{item.count} issues</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-primary-500 h-2 rounded-full"
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                  <div className="text-sm text-gray-500">{item.percentage}% of total</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Resolution Times */}
        <Card className="border-primary-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-primary-50 to-secondary-50">
            <CardTitle className="text-primary-800 flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Resolution Times
            </CardTitle>
          </CardHeader>
          <CardContent className="bg-white p-6">
            <div className="space-y-4">
              {analyticsData?.resolutionTimes.map((item) => (
                <div key={item.range} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge 
                      variant="outline" 
                      className={
                        item.range === '< 1 hour' ? 'border-green-300 text-green-700' :
                        item.range === '1-6 hours' ? 'border-blue-300 text-blue-700' :
                        item.range === '6-24 hours' ? 'border-yellow-300 text-yellow-700' :
                        'border-red-300 text-red-700'
                      }
                    >
                      {item.range}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <span className="font-bold">{item.count}</span>
                    <span className="text-sm text-gray-500 ml-2">({item.percentage}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Health Metrics */}
      <Card className="border-primary-200 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-primary-50 to-secondary-50">
          <CardTitle className="text-primary-800 flex items-center gap-2">
            <LineChart className="h-5 w-5" />
            System Health Metrics
          </CardTitle>
        </CardHeader>
        <CardContent className="bg-white p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {analyticsData?.systemMetrics.api_response_time}ms
              </div>
              <div className="text-sm text-gray-600">API Response Time</div>
              <div className="mt-2">
                <Badge variant="outline" className="border-green-300 text-green-700">
                  Excellent
                </Badge>
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {analyticsData?.systemMetrics.database_queries.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Database Queries/Day</div>
              <div className="mt-2">
                <Badge variant="outline" className="border-blue-300 text-blue-700">
                  Normal
                </Badge>
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {analyticsData?.systemMetrics.error_rate}%
              </div>
              <div className="text-sm text-gray-600">Error Rate</div>
              <div className="mt-2">
                <Badge variant="outline" className="border-green-300 text-green-700">
                  Low
                </Badge>
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {analyticsData?.systemMetrics.uptime}%
              </div>
              <div className="text-sm text-gray-600">System Uptime</div>
              <div className="mt-2">
                <Badge variant="outline" className="border-green-300 text-green-700">
                  Excellent
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* User Activity Trends */}
      <Card className="border-primary-200 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-primary-50 to-secondary-50">
          <CardTitle className="text-primary-800 flex items-center gap-2">
            <Users className="h-5 w-5" />
            User Activity Trends (Last 7 Days)
          </CardTitle>
        </CardHeader>
        <CardContent className="bg-white p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 px-4 font-medium text-gray-700">Date</th>
                  <th className="text-left py-2 px-4 font-medium text-gray-700">Active Users</th>
                  <th className="text-left py-2 px-4 font-medium text-gray-700">Issues Created</th>
                  <th className="text-left py-2 px-4 font-medium text-gray-700">Issues/User Ratio</th>
                </tr>
              </thead>
              <tbody>
                {analyticsData?.userActivity.map((day) => (
                  <tr key={day.date} className="border-b border-gray-100">
                    <td className="py-2 px-4">
                      {new Date(day.date).toLocaleDateString('en-US', { 
                        weekday: 'short', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </td>
                    <td className="py-2 px-4 font-medium">{day.active_users}</td>
                    <td className="py-2 px-4 font-medium">{day.issues_created}</td>
                    <td className="py-2 px-4">
                      <Badge 
                        variant="outline" 
                        className={
                          (day.issues_created / day.active_users) < 0.15 
                            ? 'border-green-300 text-green-700'
                            : (day.issues_created / day.active_users) < 0.25
                            ? 'border-yellow-300 text-yellow-700'
                            : 'border-red-300 text-red-700'
                        }
                      >
                        {(day.issues_created / day.active_users).toFixed(2)}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}