import { useState, useEffect } from 'react';
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
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Eye, MapPin, Clock } from 'lucide-react';
import { useBackend } from '../contexts/AuthContext';
import { Issue } from '@/lib/mockData';

interface IssueTableProps {
  showFilters?: boolean;
  showActions?: boolean;
}

export default function IssueTable({ showFilters = true, showActions = true }: IssueTableProps) {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const backend = useBackend();

  useEffect(() => {
    loadIssues();
  }, [statusFilter, priorityFilter]);

  const loadIssues = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (statusFilter && statusFilter !== 'all') params.status = statusFilter;
      if (priorityFilter && priorityFilter !== 'all') params.priority = priorityFilter;
      
      const response = await backend.issue.list(params);
      setIssues(response); // Mock API returns issues directly
    } catch (error) {
      console.error('Failed to load issues:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityBadgeVariant = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'default';
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'resolved': return 'default';
      case 'in_progress': return 'default';
      case 'closed': return 'secondary';
      case 'open': return 'destructive';
      default: return 'secondary';
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
    <div className="space-y-4">
      {showFilters && (
        <div className="flex space-x-4">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All Priorities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
      
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Issue</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Reported</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {issues
              .filter(issue => new Date(issue.reportedAt).getTime() > Date.now() - 24 * 60 * 60 * 1000)
              .map((issue) => (
              <TableRow key={issue.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{issue.title}</div>
                    <div className="text-sm text-muted-foreground truncate max-w-xs">
                      {issue.description}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <div className={`text-xs font-medium ${
                    issue.priority === 'urgent' ? 'text-red-600' :
                    issue.priority === 'high' ? 'text-orange-600' :
                    issue.priority === 'medium' ? 'text-yellow-600' :
                    'text-green-600'
                  }`}>
                    {issue.priority}
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <div className={`text-xs font-medium ${
                    issue.status === 'resolved' ? 'text-green-600' :
                    issue.status === 'in_progress' ? 'text-blue-600' :
                    issue.status === 'closed' ? 'text-gray-600' :
                    issue.status === 'paused' ? 'text-amber-600' :
                    issue.status === 'escalated' ? 'text-red-600' :
                    'text-orange-600'
                  }`}>
                    {issue.status.replace('_', ' ')}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      {new Date(issue.reportedAt).toLocaleDateString()}
                    </span>
                    <Badge variant="secondary" className="text-xs">
                      Recent
                    </Badge>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        {issues.filter(issue => new Date(issue.reportedAt).getTime() > Date.now() - 24 * 60 * 60 * 1000).length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No recent issues found
          </div>
        )}
      </div>
    </div>
  );
}
