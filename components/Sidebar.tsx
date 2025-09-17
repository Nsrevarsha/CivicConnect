import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface SidebarItem {
  label: string;
  path: string;
  icon: ReactNode;
}

interface SidebarProps {
  items: SidebarItem[];
}

export default function Sidebar({ items }: SidebarProps) {
  const location = useLocation();

  return (
    <div className="bg-white w-64 min-h-screen shadow-lg">
      <div className="p-6">
        <h1 className="text-xl font-bold text-primary">City Portal</h1>
      </div>
      
      <nav className="mt-6">
        {items.map((item) => {
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center px-6 py-3 text-primary hover:bg-primary/10 hover:text-primary-800 transition-colors",
                isActive && "bg-primary text-primary-foreground hover:bg-primary/90"
              )}
            >
              <span className="mr-3">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
