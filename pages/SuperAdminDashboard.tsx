import { Routes, Route } from 'react-router-dom';
import { 
  BarChart3, 
  Users, 
  Settings, 
  AlertTriangle, 
  FileText,
  MessageSquare,
  Shield,
  Activity
} from 'lucide-react';
import Layout from '../components/Layout';
import SuperAdminOverview from './super-admin/Overview';
import AIRoutingManager from './super-admin/AIRoutingManager';
import IssueAssignment from './super-admin/IssueAssignment';
import UserManagement from './super-admin/UserManagement';
import NotificationCenter from './super-admin/NotificationCenter';
import Analytics from './super-admin/Analytics';
import EscalationInbox from './super-admin/EscalationInbox';
import SupportLogs from './super-admin/SupportLogs';

export default function SuperAdminDashboard() {
  const sidebarItems = [
    { label: 'Dashboard', path: '/super-admin', icon: <BarChart3 className="h-5 w-5" /> },
    { label: 'AI Routing', path: '/super-admin/ai-routing', icon: <Settings className="h-5 w-5" /> },
    { label: 'Issue Assignment', path: '/super-admin/issues', icon: <AlertTriangle className="h-5 w-5" /> },
    { label: 'User Management', path: '/super-admin/users', icon: <Users className="h-5 w-5" /> },
    { label: 'Notifications', path: '/super-admin/notifications', icon: <MessageSquare className="h-5 w-5" /> },
    { label: 'Analytics', path: '/super-admin/analytics', icon: <FileText className="h-5 w-5" /> },
    { label: 'Escalations', path: '/super-admin/escalations', icon: <AlertTriangle className="h-5 w-5" /> },
    { label: 'Support & Logs', path: '/super-admin/support', icon: <Shield className="h-5 w-5" /> },
  ];

  return (
    <Layout sidebarItems={sidebarItems}>
      <Routes>
        <Route index element={<SuperAdminOverview />} />
        <Route path="ai-routing" element={<AIRoutingManager />} />
        <Route path="issues" element={<IssueAssignment />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="notifications" element={<NotificationCenter />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="escalations" element={<EscalationInbox />} />
        <Route path="support" element={<SupportLogs />} />
      </Routes>
    </Layout>
  );
}
