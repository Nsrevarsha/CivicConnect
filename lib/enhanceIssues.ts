// Utility to enhance existing issues with new required fields
import { Issue } from './mockData';

export const enhanceIssuesWithDefaults = (issues: any[]): Issue[] => {
  return issues.map((issue, index) => ({
    ...issue,
    lastUpdated: issue.lastUpdated || issue.reportedAt,
    updatedBy: issue.updatedBy || issue.assignedTo || '1',
    history: issue.history || [{
      id: `h${index + 1}`,
      type: 'assign' as const,
      performedBy: issue.assignedTo || '1',
      performedAt: issue.reportedAt,
      description: `Issue initially assigned`,
      metadata: { assignedTo: issue.assignedTo }
    }],
    estimatedResolutionTime: issue.estimatedResolutionTime || (issue.priority === 'urgent' ? 4 : issue.priority === 'high' ? 24 : 72),
    tags: issue.tags || [issue.category?.toLowerCase().replace(' ', '-') || 'general'],
    dueDate: issue.dueDate || new Date(new Date(issue.reportedAt).getTime() + (issue.priority === 'urgent' ? 4 : issue.priority === 'high' ? 24 : 72) * 60 * 60 * 1000).toISOString()
  }));
};