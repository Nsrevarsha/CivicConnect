import { Routes, Route } from 'react-router-dom';
import { 
  BarChart3, 
  CheckSquare, 
  MessageSquare, 
  Bell,
  TrendingUp,
  ArrowUp
} from 'lucide-react';
import Layout from '../components/Layout';
import SupervisorOverview from './supervisor/Overview';
import TaskManagement from './supervisor/TaskManagement';
import Communication from './supervisor/Communication';
import SupervisorNotifications from './supervisor/Notifications';
import PersonalAnalytics from './supervisor/PersonalAnalytics';
import SupervisorEscalation from './supervisor/Escalation';

export default function SupervisorDashboard() {
  const sidebarItems = [
    { label: 'Dashboard', path: '/supervisor', icon: <BarChart3 className="h-5 w-5" /> },
    { label: 'My Tasks', path: '/supervisor/tasks', icon: <CheckSquare className="h-5 w-5" /> },
    { label: 'Communication', path: '/supervisor/communication', icon: <MessageSquare className="h-5 w-5" /> },
    { label: 'Notifications', path: '/supervisor/notifications', icon: <Bell className="h-5 w-5" /> },
    { label: 'My Analytics', path: '/supervisor/analytics', icon: <TrendingUp className="h-5 w-5" /> },
    { label: 'Escalate Issue', path: '/supervisor/escalate', icon: <ArrowUp className="h-5 w-5" /> },
  ];

  return (
    <Layout sidebarItems={sidebarItems}>
      <Routes>
        <Route index element={<SupervisorOverview />} />
        <Route path="tasks" element={<TaskManagement />} />
        <Route path="communication" element={<Communication />} />
        <Route path="notifications" element={<SupervisorNotifications />} />
        <Route path="analytics" element={<PersonalAnalytics />} />
        <Route path="escalate" element={<SupervisorEscalation />} />
      </Routes>
    </Layout>
  );
}
