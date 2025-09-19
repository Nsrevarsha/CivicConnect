import { ReactNode, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Menu, X } from 'lucide-react';

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
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const toggleMobileSidebar = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  const closeMobileSidebar = () => {
    setIsMobileOpen(false);
  };

  // Close sidebar on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when mobile sidebar is open
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileOpen]);

  return (
    <>
      {/* Mobile Menu Button - Always visible on mobile */}
      <div className="lg:hidden">
        <button
          onClick={toggleMobileSidebar}
          className="fixed top-4 left-4 z-[60] p-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-lg"
          aria-label="Toggle mobile menu"
        >
          {isMobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Overlay */}
      <div 
        className={cn(
          "lg:hidden fixed inset-0 bg-black transition-opacity duration-300 z-[40]",
          isMobileOpen 
            ? "opacity-50 pointer-events-auto" 
            : "opacity-0 pointer-events-none"
        )}
        onClick={closeMobileSidebar}
      />

      {/* Sidebar */}
      <aside className={cn(
        "bg-white shadow-lg transition-transform duration-300 ease-in-out",
        // Desktop styles - always visible
        "lg:block lg:w-64 lg:min-h-screen lg:relative lg:translate-x-0",
        // Mobile styles - slide in/out
        "lg:block fixed inset-y-0 left-0 w-64 min-h-screen z-[50]",
        // Mobile transform
        isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="p-6 pt-16 lg:pt-6">
          <h1 className="text-xl font-bold text-primary ml-4">City Portal</h1>
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
                <span className="mr-3 flex-shrink-0">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}