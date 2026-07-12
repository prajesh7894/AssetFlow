import { Link, Outlet, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Settings,
  Box,
  ArrowRightLeft,
  Calendar,
  Wrench,
  ShieldCheck,
  BarChart3,
  Bell,
  LogOut,
  Search
} from "lucide-react";
import { cn } from "../../lib/utils";
import { useState, useEffect } from "react";
import { GlobalSearch } from "./GlobalSearch";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Organization Setup", href: "/organization", icon: Settings },
  { name: "Assets", href: "/assets", icon: Box },
  { name: "Allocation & Transfer", href: "/allocation", icon: ArrowRightLeft },
  { name: "Resource Booking", href: "/booking", icon: Calendar },
  { name: "Maintenance", href: "/maintenance", icon: Wrench },
  { name: "Audit", href: "/audit", icon: ShieldCheck },
  { name: "Reports", href: "/reports", icon: BarChart3 },
  { name: "Notifications", href: "/notifications", icon: Bell },
];

export default function MainLayout() {
  const location = useLocation();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen((open) => !open);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="w-64 flex-shrink-0 border-r border-border bg-card flex flex-col z-20">
        <div className="h-16 flex items-center px-6 border-b border-border/50">
          <div className="flex items-center gap-2">
            <Box className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold text-foreground tracking-tight">AssetFlow</h1>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="space-y-1 px-3">
            {navigation.map((item) => {
              const isActive = location.pathname.startsWith(item.href);
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                  )}
                >
                  <item.icon
                    className={cn(
                      "mr-3 flex-shrink-0 h-5 w-5 transition-colors",
                      isActive ? "text-primary" : "text-muted-foreground"
                    )}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
        
        <div className="p-4 border-t border-border/50">
          <button className="flex items-center w-full px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive rounded-md transition-colors">
            <LogOut className="mr-3 h-5 w-5" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        
        {/* Top Header */}
        <header className="h-16 border-b border-border/50 bg-background/80 backdrop-blur-md flex items-center justify-between px-6 z-10">
          <div className="flex-1" />
          
          {/* Global Search Trigger */}
          <button 
            onClick={() => setIsSearchOpen(true)}
            className="flex items-center justify-between w-64 px-3 py-2 text-sm text-muted-foreground bg-secondary/30 hover:bg-secondary/50 border border-border/50 rounded-lg transition-colors group"
          >
            <span className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Search...
            </span>
            <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded border border-border/50 bg-background px-1.5 font-mono text-[10px] font-medium text-muted-foreground group-hover:bg-muted opacity-70">
              <span className="text-xs">⌘</span>K
            </kbd>
          </button>
        </header>

        <main className="flex-1 overflow-y-auto p-6 relative">
          <Outlet />
        </main>
      </div>

      {/* Global Command Palette */}
      <GlobalSearch 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
        navigation={navigation} 
      />
    </div>
  );
}
