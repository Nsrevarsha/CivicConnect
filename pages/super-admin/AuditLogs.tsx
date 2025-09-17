import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Search, 
  Filter, 
  Calendar,
  Download,
  Eye,
  AlertTriangle,
  User,
  Settings,
  Database,
  Lock,
  Unlock,
  Edit3,
  Trash2,
  Plus
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useBackend } from '../../contexts/AuthContext';

interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: string;
  action: string;
  resource: string;
  resourceId: string;
  details: string;
  ipAddress: string;
  userAgent: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: 'authentication' | 'user_management' | 'system_config' | 'data_access' | 'security';
}

export default function AuditLogs() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [dateRange, setDateRange] = useState('7d');
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const backend = useBackend();

  useEffect(() => {
    loadAuditLogs();
  }, [dateRange]);

  useEffect(() => {
    let filtered = logs;
    
    if (searchTerm) {
      filtered = filtered.filter(log => 
        log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.resource.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.details.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(log => log.category === selectedCategory);
    }
    
    if (selectedSeverity !== 'all') {
      filtered = filtered.filter(log => log.severity === selectedSeverity);
    }
    
    setFilteredLogs(filtered);
  }, [logs, searchTerm, selectedCategory, selectedSeverity]);

  const loadAuditLogs = async () => {
    try {
      // In a real app, this would fetch from backend.audit.list()
      // For now, we'll use mock data
      const mockLogs: AuditLog[] = [
        {
          id: '1',
          timestamp: '2024-01-21T10:30:00Z',
          userId: '1',
          userName: 'Super Admin',
          userRole: 'super_admin',
          action: 'USER_CREATED',
          resource: 'User',
          resourceId: '5',
          details: 'Created new department admin for Public Works',
          ipAddress: '192.168.1.100',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          severity: 'medium',
          category: 'user_management'
        },
        {
          id: '2',
          timestamp: '2024-01-21T09:45:00Z',
          userId: '1',
          userName: 'Super Admin',
          userRole: 'super_admin',
          action: 'SYSTEM_CONFIG_UPDATED',
          resource: 'SystemSettings',
          resourceId: 'notification_settings',
          details: 'Updated email notification settings',
          ipAddress: '192.168.1.100',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          severity: 'low',
          category: 'system_config'
        },
        {
          id: '3',
          timestamp: '2024-01-21T08:15:00Z',
          userId: '2',
          userName: 'John Doe',
          userRole: 'department_admin',
          action: 'ISSUE_ASSIGNED',
          resource: 'Issue',
          resourceId: 'ISS-2024-001',
          details: 'Assigned issue to team member Sarah Johnson',
          ipAddress: '192.168.1.150',
          userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
          severity: 'low',
          category: 'data_access'
        },
        {
          id: '4',
          timestamp: '2024-01-20T16:20:00Z',
          userId: '4',
          userName: 'Police Department Admin',
          userRole: 'department_admin',
          action: 'LOGIN_FAILED',
          resource: 'Authentication',
          resourceId: 'auth_session',
          details: 'Failed login attempt - incorrect password',
          ipAddress: '10.0.0.45',
          userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)',
          severity: 'high',
          category: 'authentication'
        },
        {
          id: '5',
          timestamp: '2024-01-20T14:30:00Z',
          userId: '1',
          userName: 'Super Admin',
          userRole: 'super_admin',
          action: 'USER_DEACTIVATED',
          resource: 'User',
          resourceId: '3',
          details: 'Deactivated user account for John Smith due to policy violation',
          ipAddress: '192.168.1.100',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          severity: 'critical',
          category: 'security'
        },
        {
          id: '6',
          timestamp: '2024-01-20T11:45:00Z',
          userId: '2',
          userName: 'John Doe',
          userRole: 'department_admin',
          action: 'DATA_EXPORT',
          resource: 'Issues',
          resourceId: 'department_report',
          details: 'Exported department issues report for Q4 2023',
          ipAddress: '192.168.1.150',
          userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
          severity: 'medium',
          category: 'data_access'
        }
      ];
      
      setLogs(mockLogs);
    } catch (error) {
      console.error('Failed to load audit logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityBadgeColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'authentication':
        return <Lock className="h-3 w-3" />;
      case 'user_management':
        return <User className="h-3 w-3" />;
      case 'system_config':
        return <Settings className="h-3 w-3" />;
      case 'data_access':
        return <Database className="h-3 w-3" />;
      case 'security':
        return <Shield className="h-3 w-3" />;
      default:
        return <AlertTriangle className="h-3 w-3" />;
    }
  };

  const getActionIcon = (action: string) => {
    if (action.includes('CREATE')) return <Plus className="h-3 w-3 text-green-600" />;
    if (action.includes('UPDATE') || action.includes('EDIT')) return <Edit3 className="h-3 w-3 text-blue-600" />;
    if (action.includes('DELETE') || action.includes('DEACTIVAT')) return <Trash2 className="h-3 w-3 text-red-600" />;
    if (action.includes('LOGIN')) return <Lock className="h-3 w-3 text-purple-600" />;
    return <AlertTriangle className="h-3 w-3 text-orange-600" />;
  };

  const handleExportLogs = () => {
    // In a real app, this would trigger log export
    alert('Exporting audit logs...');
  };

  const logStats = {
    totalLogs: logs.length,
    criticalLogs: logs.filter(log => log.severity === 'critical').length,
    highSeverityLogs: logs.filter(log => log.severity === 'high').length,
    authenticationLogs: logs.filter(log => log.category === 'authentication').length,
    userManagementLogs: logs.filter(log => log.category === 'user_management').length,
    securityLogs: logs.filter(log => log.category === 'security').length,
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
          <h1 className="text-3xl font-bold text-primary-800">Audit Logs</h1>
          <p className="text-primary-600">System activity monitoring and security audit trail</p>
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
            onClick={handleExportLogs}
            className="bg-primary-600 hover:bg-primary-700 text-white"
          >
            <Download className="h-4 w-4 mr-2" />
            Export Logs
          </Button>
        </div>
      </div>

      {/* Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <Card className="border-primary-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-primary-600">Total Logs</p>
                <p className="text-2xl font-bold text-primary-800">{logStats.totalLogs}</p>
              </div>
              <Shield className="h-8 w-8 text-primary-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-red-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600">Critical</p>
                <p className="text-2xl font-bold text-red-800">{logStats.criticalLogs}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-orange-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">High Priority</p>
                <p className="text-2xl font-bold text-orange-800">{logStats.highSeverityLogs}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Authentication</p>
                <p className="text-2xl font-bold text-purple-800">{logStats.authenticationLogs}</p>
              </div>
              <Lock className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">User Mgmt</p>
                <p className="text-2xl font-bold text-blue-800">{logStats.userManagementLogs}</p>
              </div>
              <User className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Security</p>
                <p className="text-2xl font-bold text-green-800">{logStats.securityLogs}</p>
              </div>
              <Shield className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-primary-200">
        <CardHeader>
          <CardTitle className="text-primary-800 flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filter Audit Logs
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search logs by user, action, or resource..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md bg-white text-sm"
              >
                <option value="all">All Categories</option>
                <option value="authentication">Authentication</option>
                <option value="user_management">User Management</option>
                <option value="system_config">System Config</option>
                <option value="data_access">Data Access</option>
                <option value="security">Security</option>
              </select>
              <select
                value={selectedSeverity}
                onChange={(e) => setSelectedSeverity(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md bg-white text-sm"
              >
                <option value="all">All Severities</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Audit Logs Table */}
      <Card className="border-primary-200">
        <CardHeader>
          <CardTitle className="text-primary-800">Audit Logs ({filteredLogs.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Timestamp</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">User</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Action</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Resource</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Category</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Severity</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4 text-sm text-gray-700">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <div className="font-medium text-gray-900">{log.userName}</div>
                        <div className="text-sm text-gray-500">{log.userRole}</div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        {getActionIcon(log.action)}
                        <span className="font-medium text-sm">{log.action}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <div className="font-medium text-gray-900">{log.resource}</div>
                        <div className="text-sm text-gray-500">{log.resourceId}</div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <Badge className="inline-flex items-center gap-1 bg-gray-100 text-gray-800 border-gray-200">
                        {getCategoryIcon(log.category)}
                        {log.category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <Badge className={getSeverityBadgeColor(log.severity)}>
                        {log.severity.charAt(0).toUpperCase() + log.severity.slice(1)}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedLog(log);
                          setShowDetails(true);
                        }}
                      >
                        <Eye className="h-3 w-3" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredLogs.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No audit logs found matching your criteria.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Audit Log Details Modal */}
      {showDetails && selectedLog && (
        <div className="fixed inset-0 bg-primary bg-opacity-20 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-primary-800">Audit Log Details</h2>
                <Button
                  variant="outline"
                  onClick={() => setShowDetails(false)}
                >
                  ×
                </Button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Timestamp</label>
                    <p className="text-gray-900">{new Date(selectedLog.timestamp).toLocaleString()}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">User</label>
                    <p className="text-gray-900">{selectedLog.userName} ({selectedLog.userRole})</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Action</label>
                    <p className="text-gray-900 flex items-center gap-2">
                      {getActionIcon(selectedLog.action)}
                      {selectedLog.action}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Resource</label>
                    <p className="text-gray-900">{selectedLog.resource} ({selectedLog.resourceId})</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Category</label>
                    <Badge className="inline-flex items-center gap-1 bg-gray-100 text-gray-800 border-gray-200">
                      {getCategoryIcon(selectedLog.category)}
                      {selectedLog.category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </Badge>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Severity</label>
                    <Badge className={getSeverityBadgeColor(selectedLog.severity)}>
                      {selectedLog.severity.charAt(0).toUpperCase() + selectedLog.severity.slice(1)}
                    </Badge>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">IP Address</label>
                    <p className="text-gray-900">{selectedLog.ipAddress}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">User Agent</label>
                    <p className="text-gray-900 text-sm truncate">{selectedLog.userAgent}</p>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-600">Details</label>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded-md">{selectedLog.details}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}