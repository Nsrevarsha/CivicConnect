import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Search, Shield, Activity, AlertCircle } from 'lucide-react';

export default function SupportLogs() {
  const auditLogs = [
    {
      id: '1',
      action: 'User Login',
      user: 'admin@city.gov',
      timestamp: '2024-01-15 09:30:22',
      ip: '192.168.1.100',
      status: 'success'
    },
    {
      id: '2',
      action: 'Issue Assignment',
      user: 'dept.admin@city.gov',
      timestamp: '2024-01-15 09:25:15',
      ip: '192.168.1.105',
      status: 'success'
    },
    {
      id: '3',
      action: 'Failed Login Attempt',
      user: 'unknown@hacker.com',
      timestamp: '2024-01-15 09:20:10',
      ip: '45.123.456.789',
      status: 'failed'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Support & Logs</h1>
        <p className="text-gray-600">System audit trails and security monitoring</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              Security Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 mb-2">Secure</div>
            <p className="text-sm text-muted-foreground">
              No threats detected
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="h-5 w-5 mr-2" />
              System Uptime
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600 mb-2">99.9%</div>
            <p className="text-sm text-muted-foreground">
              Last 30 days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              Active Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600 mb-2">2</div>
            <p className="text-sm text-muted-foreground">
              Requiring attention
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Audit Trail</CardTitle>
          <div className="flex space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search logs..." className="pl-9 w-64" />
            </div>
            <Select>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                <SelectItem value="login">Login</SelectItem>
                <SelectItem value="assignment">Assignment</SelectItem>
                <SelectItem value="failed">Failed Attempts</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Action</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead>IP Address</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {auditLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="font-medium">{log.action}</TableCell>
                  <TableCell>{log.user}</TableCell>
                  <TableCell>{log.timestamp}</TableCell>
                  <TableCell>{log.ip}</TableCell>
                  <TableCell>
                    <Badge variant={log.status === 'success' ? 'default' : 'destructive'}>
                      {log.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
