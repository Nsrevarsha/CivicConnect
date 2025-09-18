import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search } from 'lucide-react';
import EnhancedIssueTable from '../../components/EnhancedIssueTable';

export default function IssueAssignment() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Issue Assignment</h1>
        <p className="text-gray-600">View and manage all issues across departments</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Issues</CardTitle>
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search issues..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
        </CardHeader>
        <CardContent>
          <EnhancedIssueTable searchTerm={searchTerm} />
        </CardContent>
      </Card>
    </div>
  );
}