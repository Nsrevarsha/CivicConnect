import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Users, MoreHorizontal, TrendingUp } from 'lucide-react';

export default function SupervisorManagement() {
  const supervisors = [
    {
      id: '1',
      name: 'John Smith',
      email: 'john.smith@city.gov',
      activeIssues: 12,
      completedThisMonth: 45,
      slaCompliance: 85,
      status: 'active'
    },
    {
      id: '2',
      name: 'Sarah Wilson',
      email: 'sarah.wilson@city.gov',
      activeIssues: 8,
      completedThisMonth: 52,
      slaCompliance: 92,
      status: 'active'
    },
    {
      id: '3',
      name: 'Mike Johnson',
      email: 'mike.johnson@city.gov',
      activeIssues: 15,
      completedThisMonth: 38,
      slaCompliance: 78,
      status: 'busy'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Supervisor Management</h1>
          <p className="text-gray-600">Manage supervisors and monitor their performance</p>
        </div>
        <Button>
          <Users className="h-4 w-4 mr-2" />
          Add Supervisor
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Active Supervisors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-sm text-muted-foreground">Currently on duty</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Avg Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">85%</div>
            <p className="text-sm text-muted-foreground">SLA compliance</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Workload Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">35</div>
            <p className="text-sm text-muted-foreground">Total active issues</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Supervisor Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Supervisor</TableHead>
                <TableHead>Active Issues</TableHead>
                <TableHead>Completed (Month)</TableHead>
                <TableHead>SLA Compliance</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {supervisors.map((supervisor) => (
                <TableRow key={supervisor.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{supervisor.name}</div>
                      <div className="text-sm text-muted-foreground">{supervisor.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{supervisor.activeIssues}</Badge>
                  </TableCell>
                  <TableCell>{supervisor.completedThisMonth}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${supervisor.slaCompliance}%` }}
                        ></div>
                      </div>
                      <span className="text-sm">{supervisor.slaCompliance}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={supervisor.status === 'active' ? 'default' : 'secondary'}>
                      {supervisor.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
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
