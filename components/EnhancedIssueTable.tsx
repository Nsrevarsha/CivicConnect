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
      case 'paused': return 'outline';
      case 'escalated': return 'destructive';
      case 'open': return 'destructive';
      default: return 'secondary';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return 'text-green-600';
      case 'in_progress': return 'text-blue-600';
      case 'closed': return 'text-gray-600';
      case 'paused': return 'text-yellow-600';
      case 'escalated': return 'text-red-600';
      case 'open': return 'text-orange-600';
      default: return 'text-gray-600';
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
              <TableHead>Issue</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Assigned To</TableHead>
              <TableHead>Reported</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Due Date</TableHead>
              {showActions && <TableHead>Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {issues.map((issue) => (
              <TableRow key={issue.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{issue.title}</div>
                    <div className="text-sm text-muted-foreground truncate max-w-xs">
                      {issue.description}
                    </div>
                    {issue.tags && issue.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {issue.tags.slice(0, 2).map(tag => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {issue.tags.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{issue.tags.length - 2}
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={getPriorityBadgeVariant(issue.priority)}>
                    {issue.priority}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(issue.status)} className={getStatusColor(issue.status)}>
                    {issue.status.replace('_', ' ')}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div>
                    <div>{issue.assignedTo || 'Unassigned'}</div>
                    {issue.assignedTeam && issue.assignedTeam.length > 0 && (
                      <div className="text-xs text-muted-foreground">
                        Team: {issue.assignedTeam.length} members
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <span className="text-sm">
                      {new Date(issue.reportedAt).toLocaleDateString()}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-3 w-3 text-muted-foreground" />
                    <span className="text-sm truncate max-w-32">
                      {issue.address}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    {issue.dueDate ? new Date(issue.dueDate).toLocaleDateString() : 'Not set'}
                  </div>
                </TableCell>
                {showActions && (
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {/* Quick actions based on status */}
                      {issue.status === 'open' && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleQuickAction(issue, 'start')}
                          className="h-8 w-8 p-0"
                          title="Start Work"
                        >
                          <Play className="h-3 w-3" />
                        </Button>
                      )}
                      
                      {issue.status === 'in_progress' && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleQuickAction(issue, 'complete')}
                          className="h-8 w-8 p-0"
                          title="Mark Complete"
                        >
                          <CheckCircle className="h-3 w-3" />
                        </Button>
                      )}

                      {/* More actions dropdown */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
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
                    </div>
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