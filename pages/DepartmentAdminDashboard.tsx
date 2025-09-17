import { Routes, Route } from 'react-router-dom';
import { 
  BarChart3, 
  Users, 
  AlertTriangle, 
  FileText,
  MessageSquare,
  TrendingUp
} from 'lucide-react';
import Layout from '../components/Layout';
import DepartmentOverview from './department-admin/Overview';
import IssueManagement from './department-admin/IssueManagement';
import SupervisorManagement from './department-admin/SupervisorManagement';
import DepartmentNotifications from './department-admin/Notifications';
import DepartmentAnalytics from './department-admin/Analytics';
import DepartmentEscalations from './department-admin/Escalations';

export default function DepartmentAdminDashboard() {
  const sidebarItems = [
    { label: 'Dashboard', path: '/department-admin', icon: <BarChart3 className="h-5 w-5" /> },
    { label: 'Issue Management', path: '/department-admin/issues', icon: <AlertTriangle className="h-5 w-5" /> },
    { label: 'Supervisors', path: '/department-admin/supervisors', icon: <Users className="h-5 w-5" /> },
    { label: 'Notifications', path: '/department-admin/notifications', icon: <MessageSquare className="h-5 w-5" /> },
    { label: 'Analytics', path: '/department-admin/analytics', icon: <FileText className="h-5 w-5" /> },
    { label: 'Escalations', path: '/department-admin/escalations', icon: <TrendingUp className="h-5 w-5" /> },
  ];

  return (
    <Layout sidebarItems={sidebarItems}>
      <Routes>
        <Route index element={<DepartmentOverview />} />
        <Route path="issues" element={<IssueManagement />} />
        <Route path="supervisors" element={<SupervisorManagement />} />
        <Route path="notifications" element={<DepartmentNotifications />} />
        <Route path="analytics" element={<DepartmentAnalytics />} />
        <Route path="escalations" element={<DepartmentEscalations />} />
      </Routes>
    </Layout>
  );
}
