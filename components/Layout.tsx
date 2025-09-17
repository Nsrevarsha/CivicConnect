import { ReactNode } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

interface LayoutProps {
  children: ReactNode;
  sidebarItems: Array<{
    label: string;
    path: string;
    icon: ReactNode;
  }>;
}

export default function Layout({ children, sidebarItems }: LayoutProps) {
  return (
    <div className="flex h-screen bg-white">
      <Sidebar items={sidebarItems} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-white p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
