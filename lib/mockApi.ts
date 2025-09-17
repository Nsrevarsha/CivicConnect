// Mock API service to replace backend client calls
import { 
  mockUsers, 
  mockIssues, 
  mockNotifications, 
  mockDashboardStats,
  mockDepartments,
  mockTeams,
  User, 
  Issue, 
  Notification, 
  DashboardStats,
  IssueAction,
  SupportRequest,
  Team
} from './mockData';
import { enhanceIssuesWithDefaults } from './enhanceIssues';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

interface LoginRequest {
  email: string;
  password: string;
  mfaCode?: string;
}

interface LoginResponse {
  user: User;
  token: string;
}

interface IssueListRequest {
  departmentId?: string;
  status?: string;
  priority?: string;
  limit?: number;
}

interface IssueUpdateRequest {
  id: string;
  status?: string;
  assignedTo?: string;
  notes?: string;
}

// Mock API class
export class MockApiService {
  // Authentication
  async login(params: LoginRequest): Promise<LoginResponse> {
    await delay(500); // Simulate network delay
    
    // Find user by email
    const user = mockUsers.find(u => u.email === params.email);
    
    if (!user) {
      throw new Error('Invalid credentials');
    }
    
    // Simple password validation (in real app, you'd check against hashed password)
    const validPasswords: { [email: string]: string } = {
      'admin@civic.gov': 'admin123',
      'public.works@civic.gov': 'works123',
      'supervisor@civic.gov': 'super123',
      'police.admin@civic.gov': 'police123'
    };
    
    if (validPasswords[user.email] !== params.password) {
      throw new Error('Invalid credentials');
    }
    
    // Generate mock JWT token
    const token = `mock-jwt-${user.id}-${Date.now()}`;
    
    return {
      user,
      token
    };
  }

  // Analytics
  async getDashboardStats(): Promise<DashboardStats> {
    await delay(300);
    return mockDashboardStats;
  }

  // Issues
  async listIssues(params: IssueListRequest): Promise<Issue[]> {
    await delay(400);
    
    let filteredIssues = enhanceIssuesWithDefaults([...mockIssues]);
    
    // Filter by department
    if (params.departmentId) {
      filteredIssues = filteredIssues.filter(issue => issue.departmentId === params.departmentId);
    }
    
    // Filter by status
    if (params.status) {
      filteredIssues = filteredIssues.filter(issue => issue.status === params.status);
    }
    
    // Filter by priority
    if (params.priority) {
      filteredIssues = filteredIssues.filter(issue => issue.priority === params.priority);
    }
    
    // Apply limit
    if (params.limit) {
      filteredIssues = filteredIssues.slice(0, params.limit);
    }
    
    return filteredIssues;
  }

  async updateIssue(params: IssueUpdateRequest): Promise<Issue> {
    await delay(300);
    
    const issueIndex = mockIssues.findIndex(issue => issue.id === params.id);
    
    if (issueIndex === -1) {
      throw new Error('Issue not found');
    }
    
    // Update the issue
    const updatedIssue = {
      ...mockIssues[issueIndex],
      ...(params.status && { status: params.status }),
      ...(params.assignedTo && { assignedTo: params.assignedTo }),
      ...(params.notes && { notes: params.notes })
    };
    
    // Update the mock data (in real app this would be persisted)
    mockIssues[issueIndex] = updatedIssue as Issue;
    
    return updatedIssue as Issue;
  }

  // Issue Actions
  async assignIssue(params: { issueId: string; assignedTo: string; performedBy: string; reason?: string }): Promise<Issue> {
    await delay(300);
    
    const issueIndex = mockIssues.findIndex(issue => issue.id === params.issueId);
    if (issueIndex === -1) throw new Error('Issue not found');
    
    const issue = mockIssues[issueIndex];
    const action: IssueAction = {
      id: `action_${Date.now()}`,
      type: issue.assignedTo ? 'reassign' : 'assign',
      performedBy: params.performedBy,
      performedAt: new Date().toISOString(),
      description: `Issue ${issue.assignedTo ? 'reassigned' : 'assigned'} to ${params.assignedTo}`,
      metadata: {
        reason: params.reason,
        assignedFrom: issue.assignedTo,
        assignedTo: params.assignedTo
      }
    };
    
    const updatedIssue = {
      ...issue,
      assignedTo: params.assignedTo,
      lastUpdated: new Date().toISOString(),
      updatedBy: params.performedBy,
      status: 'in_progress' as const,
      history: [...(issue.history || []), action]
    };
    
    mockIssues[issueIndex] = updatedIssue as Issue;
    return enhanceIssuesWithDefaults([updatedIssue])[0];
  }

  async assignTeam(params: { issueId: string; teamId: string; performedBy: string; reason?: string }): Promise<Issue> {
    await delay(300);
    
    const issueIndex = mockIssues.findIndex(issue => issue.id === params.issueId);
    if (issueIndex === -1) throw new Error('Issue not found');
    
    const team = mockTeams.find(t => t.id === params.teamId);
    if (!team) throw new Error('Team not found');
    
    const issue = mockIssues[issueIndex];
    const action: IssueAction = {
      id: `action_${Date.now()}`,
      type: 'team_assign',
      performedBy: params.performedBy,
      performedAt: new Date().toISOString(),
      description: `Issue assigned to team: ${team.name}`,
      metadata: {
        reason: params.reason,
        teamId: params.teamId,
        teamName: team.name
      }
    };
    
    const updatedIssue = {
      ...issue,
      assignedTeam: team.members,
      assignedTo: team.lead,
      lastUpdated: new Date().toISOString(),
      updatedBy: params.performedBy,
      status: 'in_progress' as const,
      history: [...(issue.history || []), action]
    };
    
    mockIssues[issueIndex] = updatedIssue as Issue;
    return enhanceIssuesWithDefaults([updatedIssue])[0];
  }

  async pauseIssue(params: { issueId: string; performedBy: string; reason: string }): Promise<Issue> {
    await delay(300);
    
    const issueIndex = mockIssues.findIndex(issue => issue.id === params.issueId);
    if (issueIndex === -1) throw new Error('Issue not found');
    
    const issue = mockIssues[issueIndex];
    const action: IssueAction = {
      id: `action_${Date.now()}`,
      type: 'pause',
      performedBy: params.performedBy,
      performedAt: new Date().toISOString(),
      description: `Issue paused: ${params.reason}`,
      metadata: {
        reason: params.reason,
        statusFrom: issue.status
      }
    };
    
    const updatedIssue = {
      ...issue,
      status: 'paused' as const,
      lastUpdated: new Date().toISOString(),
      updatedBy: params.performedBy,
      history: [...(issue.history || []), action]
    };
    
    mockIssues[issueIndex] = updatedIssue as Issue;
    return enhanceIssuesWithDefaults([updatedIssue])[0];
  }

  async rollbackIssue(params: { issueId: string; performedBy: string; targetActionId?: string }): Promise<Issue> {
    await delay(300);
    
    const issueIndex = mockIssues.findIndex(issue => issue.id === params.issueId);
    if (issueIndex === -1) throw new Error('Issue not found');
    
    const issue = mockIssues[issueIndex];
    const history = issue.history || [];
    
    // Find the last status change or use the last action
    const lastStatusChange = [...history].reverse().find(h => h.type === 'status_change') || history[history.length - 2];
    const previousStatus = lastStatusChange?.metadata?.statusFrom || 'open';
    
    const action: IssueAction = {
      id: `action_${Date.now()}`,
      type: 'rollback',
      performedBy: params.performedBy,
      performedAt: new Date().toISOString(),
      description: `Issue rolled back to previous status: ${previousStatus}`,
      metadata: {
        statusFrom: issue.status,
        statusTo: previousStatus,
        rolledBackFrom: params.targetActionId
      }
    };
    
    const updatedIssue = {
      ...issue,
      status: previousStatus as Issue['status'],
      lastUpdated: new Date().toISOString(),
      updatedBy: params.performedBy,
      history: [...history, action]
    };
    
    mockIssues[issueIndex] = updatedIssue as Issue;
    return enhanceIssuesWithDefaults([updatedIssue])[0];
  }

  async editIssue(params: {
    issueId: string;
    updates: Partial<Pick<Issue, 'title' | 'description' | 'priority' | 'category' | 'dueDate' | 'tags'>>;
    performedBy: string;
  }): Promise<Issue> {
    await delay(300);
    
    const issueIndex = mockIssues.findIndex(issue => issue.id === params.issueId);
    if (issueIndex === -1) throw new Error('Issue not found');
    
    const issue = mockIssues[issueIndex];
    const changes = Object.entries(params.updates).filter(([_, value]) => value !== undefined);
    
    const action: IssueAction = {
      id: `action_${Date.now()}`,
      type: 'edit',
      performedBy: params.performedBy,
      performedAt: new Date().toISOString(),
      description: `Issue updated: ${changes.map(([key, value]) => `${key} changed`).join(', ')}`,
      metadata: {
        changes: Object.fromEntries(changes.map(([key, value]) => [key, { from: (issue as any)[key], to: value }]))
      }
    };
    
    const updatedIssue = {
      ...issue,
      ...params.updates,
      lastUpdated: new Date().toISOString(),
      updatedBy: params.performedBy,
      history: [...(issue.history || []), action]
    };
    
    mockIssues[issueIndex] = updatedIssue as Issue;
    return enhanceIssuesWithDefaults([updatedIssue])[0];
  }

  async createSupportRequest(params: {
    issueId: string;
    type: SupportRequest['type'];
    priority: SupportRequest['priority'];
    description: string;
    requestedBy: string;
    requestedFrom: string;
    requestedTo: string;
  }): Promise<SupportRequest> {
    await delay(300);
    
    const supportRequest: SupportRequest = {
      id: `support_${Date.now()}`,
      requestedBy: params.requestedBy,
      requestedFrom: params.requestedFrom,
      requestedTo: params.requestedTo,
      type: params.type,
      priority: params.priority,
      description: params.description,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    
    // Add to issue's support requests
    const issueIndex = mockIssues.findIndex(issue => issue.id === params.issueId);
    if (issueIndex !== -1) {
      const issue = mockIssues[issueIndex];
      const action: IssueAction = {
        id: `action_${Date.now()}`,
        type: 'support_request',
        performedBy: params.requestedBy,
        performedAt: new Date().toISOString(),
        description: `Support requested: ${params.type}`,
        metadata: {
          supportRequestId: supportRequest.id,
          requestedTo: params.requestedTo
        }
      };
      
      const updatedIssue = {
        ...issue,
        supportRequests: [...(issue.supportRequests || []), supportRequest],
        lastUpdated: new Date().toISOString(),
        updatedBy: params.requestedBy,
        history: [...(issue.history || []), action]
      };
      
      mockIssues[issueIndex] = updatedIssue as Issue;
    }
    
    return supportRequest;
  }

  async takeAction(params: {
    issueId: string;
    actionType: 'start' | 'complete' | 'verify' | 'close';
    performedBy: string;
    notes?: string;
  }): Promise<Issue> {
    await delay(300);
    
    const issueIndex = mockIssues.findIndex(issue => issue.id === params.issueId);
    if (issueIndex === -1) throw new Error('Issue not found');
    
    const issue = mockIssues[issueIndex];
    const statusMap = {
      start: 'in_progress' as const,
      complete: 'resolved' as const,
      verify: 'resolved' as const,
      close: 'closed' as const
    };
    
    const action: IssueAction = {
      id: `action_${Date.now()}`,
      type: 'status_change',
      performedBy: params.performedBy,
      performedAt: new Date().toISOString(),
      description: `Action taken: ${params.actionType}${params.notes ? ` - ${params.notes}` : ''}`,
      metadata: {
        statusFrom: issue.status,
        statusTo: statusMap[params.actionType],
        actionType: params.actionType,
        notes: params.notes
      }
    };
    
    const updatedIssue = {
      ...issue,
      status: statusMap[params.actionType],
      notes: params.notes ? `${issue.notes ? issue.notes + '\n' : ''}${params.notes}` : issue.notes,
      lastUpdated: new Date().toISOString(),
      updatedBy: params.performedBy,
      history: [...(issue.history || []), action]
    };
    
    mockIssues[issueIndex] = updatedIssue as Issue;
    return enhanceIssuesWithDefaults([updatedIssue])[0];
  }

  // Teams
  async listTeams(departmentId?: string): Promise<Team[]> {
    await delay(200);
    
    if (departmentId) {
      return mockTeams.filter(team => team.departmentId === departmentId);
    }
    
    return mockTeams;
  }

  // Notifications
  async listNotifications(userId?: string): Promise<Notification[]> {
    await delay(200);
    
    if (userId) {
      return mockNotifications.filter(notification => notification.userId === userId);
    }
    
    return mockNotifications;
  }

  async markNotificationRead(notificationId: string): Promise<void> {
    await delay(100);
    
    const notification = mockNotifications.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
    }
  }

  // Users
  async listUsers(departmentId?: string): Promise<User[]> {
    await delay(200);
    
    if (departmentId) {
      return mockUsers.filter(user => user.departmentId === departmentId);
    }
    
    return mockUsers;
  }

  // Departments
  async listDepartments() {
    await delay(100);
    return mockDepartments;
  }
}

// Create a singleton instance
export const mockApi = new MockApiService();

// Export for compatibility with existing backend client usage
export default {
  auth: {
    login: mockApi.login.bind(mockApi)
  },
  analytics: {
    getDashboardStats: mockApi.getDashboardStats.bind(mockApi)
  },
  issue: {
    list: mockApi.listIssues.bind(mockApi),
    update: mockApi.updateIssue.bind(mockApi),
    assign: mockApi.assignIssue.bind(mockApi),
    assignTeam: mockApi.assignTeam.bind(mockApi),
    pause: mockApi.pauseIssue.bind(mockApi),
    rollback: mockApi.rollbackIssue.bind(mockApi),
    edit: mockApi.editIssue.bind(mockApi),
    takeAction: mockApi.takeAction.bind(mockApi),
    createSupportRequest: mockApi.createSupportRequest.bind(mockApi)
  },
  team: {
    list: mockApi.listTeams.bind(mockApi)
  },
  notification: {
    list: mockApi.listNotifications.bind(mockApi),
    markRead: mockApi.markNotificationRead.bind(mockApi)
  },
  user: {
    list: mockApi.listUsers.bind(mockApi)
  },
  departments: {
    list: mockApi.listDepartments.bind(mockApi)
  }
};
