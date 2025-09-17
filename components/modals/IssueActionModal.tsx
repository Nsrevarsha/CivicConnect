import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Issue, User, Team } from '@/lib/mockData';
import { useAuth, useBackend } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';

interface IssueActionModalProps {
  issue: Issue | null;
  isOpen: boolean;
  onClose: () => void;
  actionType: 'assign' | 'edit' | 'pause' | 'rollback' | 'team_assign' | 'support_request' | 'take_action';
  onSuccess?: (updatedIssue: Issue) => void;
}

export default function IssueActionModal({ 
  issue, 
  isOpen, 
  onClose, 
  actionType, 
  onSuccess 
}: IssueActionModalProps) {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const { user } = useAuth();
  const backend = useBackend();
  const { toast } = useToast();

  // Form states
  const [assignedTo, setAssignedTo] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('');
  const [title, setTitle] = useState(issue?.title || '');
  const [description, setDescription] = useState(issue?.description || '');
  const [priority, setPriority] = useState(issue?.priority || 'medium');
  const [category, setCategory] = useState(issue?.category || '');
  const [tags, setTags] = useState(issue?.tags?.join(', ') || '');
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');
  const [actionSubType, setActionSubType] = useState('start');
  const [supportType, setSupportType] = useState<'escalation' | 'consultation' | 'resource_request' | 'technical_support'>('escalation');
  const [supportPriority, setSupportPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('medium');
  const [supportDescription, setSupportDescription] = useState('');
  const [requestedTo, setRequestedTo] = useState('');

  useState(() => {
    // This will run on mount and when dependencies change
  });
  
  const loadUsersAndTeams = React.useCallback(async () => {
    if (!issue) return;
    try {
      const [usersData, teamsData] = await Promise.all([
        backend.user.list(issue?.departmentId),
        backend.team.list(issue?.departmentId)
      ]);
      setUsers(usersData);
      setTeams(teamsData);
    } catch (error) {
      console.error('Failed to load users and teams:', error);
    }
  }, [backend, issue]);

  React.useEffect(() => {
    if (isOpen && issue) {
      // Load users and teams when modal opens
      loadUsersAndTeams();
      
      // Reset form states
      setTitle(issue.title);
      setDescription(issue.description);
      setPriority(issue.priority);
      setCategory(issue.category);
      setTags(issue.tags?.join(', ') || '');
      setReason('');
      setNotes('');
      setAssignedTo(issue.assignedTo || '');
    }
  }, [isOpen, issue, loadUsersAndTeams]);


  const handleSubmit = async () => {
    console.log('handleSubmit called', { 
      issue: issue?.id, 
      user: user?.id, 
      actionType, 
      assignedTo, 
      selectedTeam,
      reason: reason.trim() 
    });
    
    if (!issue || !user) {
      toast({ 
        title: 'Error', 
        description: 'Missing required information', 
        variant: 'destructive' 
      });
      return;
    }

    setLoading(true);
    try {
      let result;

      switch (actionType) {
        case 'assign':
          if (!assignedTo) {
            toast({ title: 'Error', description: 'Please select a user to assign', variant: 'destructive' });
            setLoading(false);
            return;
          }
          result = await backend.issue.assign({
            issueId: issue.id,
            assignedTo,
            performedBy: user.id,
            reason
          });
          toast({ title: 'Success', description: 'Issue assigned successfully' });
          break;

        case 'team_assign':
          if (!selectedTeam) {
            toast({ title: 'Error', description: 'Please select a team', variant: 'destructive' });
            setLoading(false);
            return;
          }
          result = await backend.issue.assignTeam({
            issueId: issue.id,
            teamId: selectedTeam,
            performedBy: user.id,
            reason
          });
          toast({ title: 'Success', description: 'Team assigned successfully' });
          break;

        case 'edit':
          const updates: any = {};
          if (title !== issue.title) updates.title = title;
          if (description !== issue.description) updates.description = description;
          if (priority !== issue.priority) updates.priority = priority;
          if (category !== issue.category) updates.category = category;
          const newTags = tags.split(',').map(t => t.trim()).filter(Boolean);
          if (JSON.stringify(newTags) !== JSON.stringify(issue.tags)) updates.tags = newTags;

          result = await backend.issue.edit({
            issueId: issue.id,
            updates,
            performedBy: user.id
          });
          toast({ title: 'Success', description: 'Issue updated successfully' });
          break;

        case 'pause':
          if (!reason.trim()) {
            toast({ title: 'Error', description: 'Please provide a reason for pausing', variant: 'destructive' });
            setLoading(false);
            return;
          }
          result = await backend.issue.pause({
            issueId: issue.id,
            performedBy: user.id,
            reason: reason.trim()
          });
          toast({ title: 'Success', description: 'Issue paused successfully' });
          break;

        case 'rollback':
          result = await backend.issue.rollback({
            issueId: issue.id,
            performedBy: user.id
          });
          toast({ title: 'Success', description: 'Issue rolled back successfully' });
          break;

        case 'take_action':
          result = await backend.issue.takeAction({
            issueId: issue.id,
            actionType: actionSubType as any,
            performedBy: user.id,
            notes: notes.trim() || undefined
          });
          toast({ title: 'Success', description: `Action "${actionSubType}" completed successfully` });
          break;

        case 'support_request':
          if (!supportDescription.trim() || !requestedTo) {
            toast({ title: 'Error', description: 'Please fill in all required fields', variant: 'destructive' });
            setLoading(false);
            return;
          }
          await backend.issue.createSupportRequest({
            issueId: issue.id,
            type: supportType,
            priority: supportPriority,
            description: supportDescription.trim(),
            requestedBy: user.id,
            requestedFrom: user.departmentId || 'unknown',
            requestedTo
          });
          toast({ title: 'Success', description: 'Support request created successfully' });
          break;

        default:
          throw new Error('Invalid action type');
      }

      if (result && onSuccess) {
        onSuccess(result);
      }
      onClose();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'An error occurred',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const getModalTitle = () => {
    switch (actionType) {
      case 'assign': return 'Assign Issue';
      case 'team_assign': return 'Assign to Team';
      case 'edit': return 'Edit Issue';
      case 'pause': return 'Pause Issue';
      case 'rollback': return 'Rollback Issue';
      case 'take_action': return 'Take Action';
      case 'support_request': return 'Request Support';
      default: return 'Issue Action';
    }
  };

  const getModalDescription = () => {
    switch (actionType) {
      case 'assign': return 'Assign this issue to a user';
      case 'team_assign': return 'Assign this issue to a team';
      case 'edit': return 'Edit issue details';
      case 'pause': return 'Temporarily pause this issue';
      case 'rollback': return 'Rollback this issue to previous status';
      case 'take_action': return 'Take action on this issue';
      case 'support_request': return 'Request support from another department or team';
      default: return 'Perform action on this issue';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{getModalTitle()}</DialogTitle>
          <DialogDescription>{getModalDescription()}</DialogDescription>
          {issue && (
            <div className="text-sm text-muted-foreground mt-2">
              <strong>Issue:</strong> {issue.title}
            </div>
          )}
        </DialogHeader>

        <div className="space-y-4 py-4">
          {actionType === 'assign' && (
            <>
              <div>
                <Label htmlFor="assignedTo">Assign to User</Label>
                <Select value={assignedTo} onValueChange={setAssignedTo}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a user" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map(u => (
                      <SelectItem key={u.id} value={u.id}>{u.name} ({u.email})</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="reason">Reason (Optional)</Label>
                <Textarea
                  id="reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Why are you assigning this issue?"
                  className="min-h-[60px]"
                />
              </div>
            </>
          )}

          {actionType === 'team_assign' && (
            <>
              <div>
                <Label htmlFor="selectedTeam">Assign to Team</Label>
                <Select value={selectedTeam} onValueChange={setSelectedTeam}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a team" />
                  </SelectTrigger>
                  <SelectContent>
                    {teams.map(team => (
                      <SelectItem key={team.id} value={team.id}>
                        {team.name} ({team.members.length} members)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="reason">Reason (Optional)</Label>
                <Textarea
                  id="reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Why are you assigning this to a team?"
                  className="min-h-[60px]"
                />
              </div>
            </>
          )}

          {actionType === 'edit' && (
            <>
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Issue title"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Issue description"
                  className="min-h-[80px]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Select value={priority} onValueChange={(value) => setPriority(value as any)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="Issue category"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="tags">Tags (comma separated)</Label>
                <Input
                  id="tags"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="urgent, road-safety, maintenance"
                />
              </div>
            </>
          )}

          {actionType === 'pause' && (
            <div>
              <Label htmlFor="reason">Reason for Pausing *</Label>
              <Textarea
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Explain why this issue needs to be paused..."
                className="min-h-[80px]"
                required
              />
            </div>
          )}

          {actionType === 'rollback' && (
            <div className="text-sm text-muted-foreground">
              This will rollback the issue to its previous status. The action cannot be undone.
            </div>
          )}

          {actionType === 'take_action' && (
            <>
              <div>
                <Label htmlFor="actionSubType">Action Type</Label>
                <Select value={actionSubType} onValueChange={setActionSubType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="start">Start Work</SelectItem>
                    <SelectItem value="complete">Mark Complete</SelectItem>
                    <SelectItem value="verify">Verify Resolution</SelectItem>
                    <SelectItem value="close">Close Issue</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add any notes about this action..."
                  className="min-h-[60px]"
                />
              </div>
            </>
          )}

          {actionType === 'support_request' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="supportType">Request Type</Label>
                  <Select value={supportType} onValueChange={(value) => setSupportType(value as any)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="escalation">Escalation</SelectItem>
                      <SelectItem value="consultation">Consultation</SelectItem>
                      <SelectItem value="resource_request">Resource Request</SelectItem>
                      <SelectItem value="technical_support">Technical Support</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="supportPriority">Priority</Label>
                  <Select value={supportPriority} onValueChange={(value) => setSupportPriority(value as any)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="requestedTo">Request To</Label>
                <Input
                  id="requestedTo"
                  value={requestedTo}
                  onChange={(e) => setRequestedTo(e.target.value)}
                  placeholder="Department or user ID"
                />
              </div>
              <div>
                <Label htmlFor="supportDescription">Description *</Label>
                <Textarea
                  id="supportDescription"
                  value={supportDescription}
                  onChange={(e) => setSupportDescription(e.target.value)}
                  placeholder="Describe what support you need..."
                  className="min-h-[80px]"
                  required
                />
              </div>
            </>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Processing...' : 'Confirm'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}