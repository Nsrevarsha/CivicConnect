import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import IssueTable from '../../components/IssueTable';

export default function IssueManagement() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Issue Management</h1>
        <p className="text-gray-600">Review and manage department issues</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Department Issues</CardTitle>
        </CardHeader>
        <CardContent>
          <IssueTable />
        </CardContent>
      </Card>
    </div>
  );
}
