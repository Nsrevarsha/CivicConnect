// Mock data for the Civic Connect application

export interface User {
  id: string;
  email: string;
  role: 'super_admin' | 'department_admin' | 'supervisor';
  departmentId?: string;
  name: string;
  isActive?: boolean;
  lastLogin?: string;
}

export interface IssueAction {
  id: string;
  type: 'assign' | 'reassign' | 'status_change' | 'priority_change' | 'edit' | 'pause' | 'rollback' | 'comment' | 'support_request' | 'team_assign';
  performedBy: string;
  performedAt: string;
  description: string;
  oldValue?: any;
  newValue?: any;
  metadata?: {
    reason?: string;
    assignedFrom?: string;
    assignedTo?: string;
    statusFrom?: string;
    statusTo?: string;
    [key: string]: any;
  };
}

export interface SupportRequest {
  id: string;
  requestedBy: string;
  requestedFrom: string; // department ID
  requestedTo: string;   // department ID or user ID
  type: 'escalation' | 'consultation' | 'resource_request' | 'technical_support';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  description: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  createdAt: string;
  respondedAt?: string;
  response?: string;
}

export interface Team {
  id: string;
  name: string;
  departmentId: string;
  members: string[]; // user IDs
  lead: string; // user ID
  specializations: string[];
  isActive: boolean;
}

export interface Issue {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed' | 'paused' | 'escalated';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  latitude: number;
  longitude: number;
  address: string;
  reportedBy: string;
  reportedAt: string;
  assignedTo?: string;
  assignedTeam?: string[];
  departmentId: string;
  notes?: string;
  category: string;
  dueDate?: string;
  lastUpdated: string;
  updatedBy?: string;
  history: IssueAction[];
  supportRequests?: SupportRequest[];
  estimatedResolutionTime?: number;
  tags?: string[];
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  createdAt: string;
  read: boolean;
  userId: string;
}

export interface DashboardStats {
  totalIssues: number;
  openIssues: number;
  inProgressIssues: number;
  resolvedIssues: number;
  highPriorityIssues: number;
  slaCompliance?: number;
  recentActivity?: Array<{
    id: string;
    type: 'issue_created' | 'issue_updated' | 'issue_resolved';
    description: string;
    timestamp: string;
  }>;
  departmentStats?: {
    [departmentId: string]: {
      name: string;
      totalIssues: number;
      openIssues: number;
    };
  };
}

// Mock users
export const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@civic.gov',
    role: 'super_admin',
    name: 'Super Administrator',
    isActive: true,
    lastLogin: '2025-09-17T08:00:00Z'
  },
  {
    id: '2',
    email: 'public.works@civic.gov',
    role: 'department_admin',
    departmentId: 'public-works',
    name: 'Public Works Admin',
    isActive: true,
    lastLogin: '2025-09-16T16:30:00Z'
  },
  {
    id: '3',
    email: 'supervisor@civic.gov',
    role: 'supervisor',
    departmentId: 'public-works',
    name: 'Field Supervisor',
    isActive: true,
    lastLogin: '2025-09-17T07:45:00Z'
  },
  {
    id: '4',
    email: 'police.admin@civic.gov',
    role: 'department_admin',
    departmentId: 'police',
    name: 'Police Department Admin',
    isActive: false,
    lastLogin: '2025-09-15T12:00:00Z'
  }
];

// Mock teams
export const mockTeams: Team[] = [
  {
    id: 'team1',
    name: 'Road Maintenance Crew',
    departmentId: 'public-works',
    members: ['3', '5'],
    lead: '3',
    specializations: ['road-repair', 'asphalt', 'traffic-management'],
    isActive: true
  },
  {
    id: 'team2',
    name: 'Electrical Systems Team',
    departmentId: 'public-works',
    members: ['3', '6'],
    lead: '3',
    specializations: ['street-lighting', 'electrical-repair', 'wiring'],
    isActive: true
  },
  {
    id: 'team3',
    name: 'Emergency Response Unit',
    departmentId: 'police',
    members: ['4', '7'],
    lead: '4',
    specializations: ['emergency-response', 'crowd-control', 'investigation'],
    isActive: true
  }
];

// Mock issues - Simplified structure
export const mockIssues: any[] = [
  {
    id: '1',
    title: 'Pothole on Main Street',
    description: 'Large pothole causing traffic issues and potential vehicle damage',
    status: 'open',
    priority: 'high',
    latitude: 40.7128,
    longitude: -74.0060,
    address: '123 Main Street, New York, NY',
    reportedBy: 'citizen@email.com',
    reportedAt: '2025-09-15T10:30:00Z',
    assignedTo: '3',
    departmentId: 'public-works',
    category: 'Road Maintenance',
    tags: ['urgent', 'road-safety']
  },
  {
    id: '2',
    title: 'Broken Street Light',
    description: 'Street light is completely out, creating safety hazard at night',
    status: 'in_progress',
    priority: 'medium',
    latitude: 40.7500,
    longitude: -73.9876,
    address: '456 Oak Avenue, New York, NY',
    reportedBy: 'resident@email.com',
    reportedAt: '2025-09-14T14:20:00Z',
    assignedTo: '3',
    departmentId: 'public-works',
    notes: 'Replacement parts ordered, scheduled for Monday',
    category: 'Street Lighting',
    tags: ['lighting', 'safety']
  },
  {
    id: '3',
    title: 'Noise Complaint',
    description: 'Loud music from commercial establishment after hours',
    status: 'resolved',
    priority: 'low',
    latitude: 40.7300,
    longitude: -74.0100,
    address: '789 Park Street, New York, NY',
    reportedBy: 'neighbor@email.com',
    reportedAt: '2025-09-13T22:45:00Z',
    assignedTo: '4',
    departmentId: 'police',
    notes: 'Warning issued to establishment owner',
    category: 'Noise Control',
    tags: ['noise', 'residential']
  },
  {
    id: '4',
    title: 'Water Main Break',
    description: 'Water flooding the street from broken main',
    status: 'open',
    priority: 'urgent',
    latitude: 40.7400,
    longitude: -73.9900,
    address: '321 Water Street, New York, NY',
    reportedBy: 'emergency@civic.gov',
    reportedAt: '2025-09-17T08:15:00Z',
    departmentId: 'public-works',
    category: 'Water & Sewer',
    tags: ['emergency', 'water', 'urgent']
  },
  {
    id: '5',
    title: 'Graffiti on Public Building',
    description: 'Vandalism on the side of city hall building',
    status: 'open',
    priority: 'medium',
    latitude: 40.7200,
    longitude: -74.0050,
    address: 'City Hall, New York, NY',
    reportedBy: 'staff@civic.gov',
    reportedAt: '2025-09-16T16:30:00Z',
    departmentId: 'public-works',
    category: 'Vandalism',
    tags: ['vandalism', 'cleanup']
  },
  {
    id: '6',
    title: 'Parking Meter Out of Order',
    description: 'Parking meter not accepting payment or giving change',
    status: 'in_progress',
    priority: 'low',
    latitude: 40.7350,
    longitude: -73.9950,
    address: '555 Commerce Street, New York, NY',
    reportedBy: 'driver@email.com',
    reportedAt: '2025-09-15T12:00:00Z',
    assignedTo: '3',
    departmentId: 'public-works',
    category: 'Parking',
    tags: ['parking', 'maintenance']
  }
];

// Mock notifications
export const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'New High Priority Issue',
    message: 'Water main break reported on Water Street - requires immediate attention',
    type: 'error',
    createdAt: '2025-09-17T08:16:00Z',
    read: false,
    userId: '2'
  },
  {
    id: '2',
    title: 'Issue Assigned',
    message: 'Pothole on Main Street has been assigned to your team',
    type: 'info',
    createdAt: '2025-09-15T10:35:00Z',
    read: true,
    userId: '3'
  },
  {
    id: '3',
    title: 'Issue Resolved',
    message: 'Noise complaint on Park Street has been successfully resolved',
    type: 'success',
    createdAt: '2025-09-14T09:20:00Z',
    read: true,
    userId: '4'
  },
  {
    id: '4',
    title: 'System Maintenance',
    message: 'Scheduled system maintenance tonight from 11 PM to 2 AM',
    type: 'warning',
    createdAt: '2025-09-16T14:00:00Z',
    read: false,
    userId: '1'
  }
];

// Mock dashboard stats
export const mockDashboardStats: DashboardStats = {
  totalIssues: 6,
  openIssues: 3,
  inProgressIssues: 2,
  resolvedIssues: 1,
  highPriorityIssues: 2,
  slaCompliance: 85,
  recentActivity: [
    {
      id: '1',
      type: 'issue_created',
      description: 'New water main break reported on Water Street',
      timestamp: '2025-09-17T08:15:00Z'
    },
    {
      id: '2',
      type: 'issue_updated',
      description: 'Street light repair scheduled for Monday',
      timestamp: '2025-09-16T14:30:00Z'
    },
    {
      id: '3',
      type: 'issue_resolved',
      description: 'Noise complaint on Park Street resolved',
      timestamp: '2025-09-16T09:20:00Z'
    }
  ],
  departmentStats: {
    'public-works': {
      name: 'Public Works',
      totalIssues: 5,
      openIssues: 3
    },
    'police': {
      name: 'Police Department',
      totalIssues: 1,
      openIssues: 0
    }
  }
};

// Department list
export const mockDepartments = [
  { id: 'public-works', name: 'Public Works' },
  { id: 'police', name: 'Police Department' },
  { id: 'fire', name: 'Fire Department' },
  { id: 'parks', name: 'Parks & Recreation' }
];