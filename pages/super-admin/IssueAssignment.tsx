import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import IssueTable from '../../components/IssueTable';

export default function IssueAssignment() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Issue Assignment</h1>
        <p className="text-gray-600">View and manage all issues across departments</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Issues</CardTitle>
        </CardHeader>
        <CardContent>
          <IssueTable />
        </CardContent>
      </Card>
    </div>
  );
}
