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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Eye, 
  MapPin, 
  Clock, 
  MoreHorizontal,
  UserPlus,
  Edit,
  Pause,
  Undo,
  Users,
  MessageCircle,
  Play,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { useBackend, useAuth } from '@/contexts/AuthContext';
import { Issue } from '@/lib/mockData';
import IssueActionModal from '@/components/modals/IssueActionModal';
import { useToast } from '@/components/ui/use-toast';

interface EnhancedIssueTableProps {
  showFilters?: boolean;
  showActions?: boolean;
  onIssueUpdate?: (issue: Issue) => void;
}

export default function EnhancedIssueTable({ 
  showFilters = true, 
  showActions = true,
  onIssueUpdate
}: EnhancedIssueTableProps) {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [modalType, setModalType] = useState<'assign' | 'edit' | 'pause' | 'rollback' | 'team_assign' | 'support_request' | 'take_action' | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const backend = useBackend();
  const { user } = useAuth();
  const { toast } = useToast();

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
      setIssues(response);
    } catch (error) {
      console.error('Failed to load issues:', error);
      toast({
        title: 'Error',
        description: 'Failed to load issues',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAction = (issue: Issue, actionType: typeof modalType) => {
    console.log('handleAction called', { issue: issue.id, actionType });
    setSelectedIssue(issue);
    setModalType(actionType);
    setIsModalOpen(true);
  };

  const handleModalSuccess = (updatedIssue: Issue) => {
    // Update the issue in the local state
    setIssues(prev => prev.map(issue => 
      issue.id === updatedIssue.id ? updatedIssue : issue
    ));
    
    if (onIssueUpdate) {
      onIssueUpdate(updatedIssue);
    }
  };

  const handleQuickAction = async (issue: Issue, actionType: 'start' | 'complete' | 'verify' | 'close') => {
    console.log('handleQuickAction called', { issue: issue.id, actionType, user: user?.id });
    
    if (!user) {
      toast({
        title: 'Error',
        description: 'You must be logged in to perform actions',
        variant: 'destructive'
      });
      return;
    }

    try {
      const updatedIssue = await backend.issue.takeAction({
        issueId: issue.id,
        actionType,
        performedBy: user.id,
        notes: `Quick action: ${actionType}`
      });

      handleModalSuccess(updatedIssue);
      toast({
        title: 'Success',
        description: `Issue ${actionType} successfully`,
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to perform action',
        variant: 'destructive'
      });
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
              <SelectItem value="paused">Paused</SelectItem>
              <SelectItem value="escalated">Escalated</SelectItem>
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

          <Button 
            onClick={loadIssues} 
            variant="outline" 
            size="sm"
            className="ml-auto"
          >
            Refresh
          </Button>
        </div>
      )}
      
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[35%] text-left">Issue</TableHead>
              <TableHead className="w-[8%] text-center">Priority</TableHead>
              <TableHead className="w-[10%] text-center">Status</TableHead>
              <TableHead className="w-[20%] text-left">Location</TableHead>
              <TableHead className="w-[12%] text-center">Reported</TableHead>
              {showActions && <TableHead className="w-[15%] text-center">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {issues.map((issue) => (
              <TableRow key={issue.id}>
                <TableCell className="text-left">
                  <div>
                    <div className="font-medium text-sm">{issue.title}</div>
                    <div className="text-xs text-muted-foreground truncate">
                      {issue.description}
                    </div>
                    {issue.tags && issue.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {issue.tags.slice(0, 3).map(tag => (
                          <Badge key={tag} variant="outline" className="text-xs px-1 py-0">
                            {tag}
                          </Badge>
                        ))}
                        {issue.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs px-1 py-0">
                            +{issue.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}
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
                <TableCell className="text-left">
                  <div className="flex items-start space-x-1">
                    <MapPin className="h-3 w-3 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <span className="text-xs text-muted-foreground break-words">
                      {issue.address}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <div className="text-xs">
                    {new Date(issue.reportedAt).toLocaleDateString()}
                  </div>
                </TableCell>
                {showActions && (
                  <TableCell className="text-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        {issue.status === 'open' && (
                          <DropdownMenuItem onClick={() => handleQuickAction(issue, 'start')}>
                            <Play className="mr-2 h-4 w-4" />
                            Start Work
                          </DropdownMenuItem>
                        )}
                        {issue.status === 'in_progress' && (
                          <DropdownMenuItem onClick={() => handleQuickAction(issue, 'complete')}>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Mark Complete
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleAction(issue, 'assign')}>
                          <UserPlus className="mr-2 h-4 w-4" />
                          Assign
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleAction(issue, 'team_assign')}>
                          <Users className="mr-2 h-4 w-4" />
                          Assign Team
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleAction(issue, 'edit')}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleAction(issue, 'take_action')}>
                          <Eye className="mr-2 h-4 w-4" />
                          Take Action
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {issue.status !== 'paused' && (
                          <DropdownMenuItem onClick={() => handleAction(issue, 'pause')}>
                            <Pause className="mr-2 h-4 w-4" />
                            Pause
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem onClick={() => handleAction(issue, 'rollback')}>
                          <Undo className="mr-2 h-4 w-4" />
                          Rollback
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleAction(issue, 'support_request')}>
                          <MessageCircle className="mr-2 h-4 w-4" />
                          Request Support
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        {issues.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No issues found
          </div>
        )}
      </div>

      {/* Action Modal */}
      <IssueActionModal
        issue={selectedIssue}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedIssue(null);
          setModalType(null);
        }}
        actionType={modalType!}
        onSuccess={handleModalSuccess}
      />
    </div>
  );
}