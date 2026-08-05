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
  Search,
  User,
  Moon,
  Sun,
  Laptop,
  Menu,
  X,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { useState, useEffect } from "react";
import { GlobalSearch } from "./GlobalSearch";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "../ui/dropdown-menu";
import { useTheme } from "../../context/ThemeProvider";
import { useAuth } from "../../context/AuthContext";
import { auth } from "../../lib/firebase";

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const { user } = useAuth();

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

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Mobile overlay backdrop */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "w-64 flex-shrink-0 border-r border-border bg-card flex flex-col z-50 transition-transform duration-300 ease-in-out fixed inset-y-0 left-0 md:relative md:translate-x-0",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="h-16 flex items-center justify-between px-6 border-b border-border/50">
          <div className="flex items-center gap-2">
            <Box className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold text-foreground tracking-tight">AssetFlow</h1>
          </div>
          <button
            className="md:hidden text-muted-foreground hover:text-foreground"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4">
          <nav className="space-y-1 px-3">
            {navigation
              .filter((item) => {
                // If user is employee, hide Organization Setup, Maintenance, Audit, Reports
                if (user?.role === "employee") {
                  return !["Organization Setup", "Maintenance", "Audit", "Reports"].includes(
                    item.name
                  );
                }
                return true;
              })
              .map((item) => {
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
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden relative min-w-0">
        {/* Top Header */}
        <header className="h-16 border-b border-border/50 bg-background/80 backdrop-blur-md flex items-center justify-between px-4 md:px-6 z-10 shrink-0">
          <div className="flex items-center">
            <button
              className="mr-4 md:hidden text-muted-foreground hover:text-foreground"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
          <div className="flex-1" />

          {/* Global Search Trigger */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="hidden md:flex items-center justify-between w-64 px-3 py-2 text-sm text-muted-foreground bg-secondary/30 hover:bg-secondary/50 border border-border/50 rounded-lg transition-colors group mr-4"
          >
            <span className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Search...
            </span>
            <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded border border-border/50 bg-background px-1.5 font-mono text-[10px] font-medium text-muted-foreground group-hover:bg-muted opacity-70">
              <span className="text-xs">⌘</span>K
            </kbd>
          </button>

          <button
            className="md:hidden mr-4 text-muted-foreground hover:text-foreground"
            onClick={() => setIsSearchOpen(true)}
          >
            <Search className="h-5 w-5" />
          </button>

          {/* User Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger>
              <div className="h-9 w-9 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center hover:ring-2 ring-primary/50 transition-all">
                <User className="h-5 w-5 text-primary" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 p-2">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user?.displayName || "Admin User"}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email || "admin@assetflow.local"}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="p-2">
                <p className="text-xs font-semibold text-muted-foreground mb-2">Theme</p>
                <div className="flex items-center gap-1 bg-secondary/50 p-1 rounded-md">
                  <button
                    onClick={() => setTheme("light")}
                    className={cn(
                      "flex-1 flex justify-center py-1.5 rounded-sm transition-colors",
                      theme === "light"
                        ? "bg-background shadow-sm text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <Sun className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setTheme("dark")}
                    className={cn(
                      "flex-1 flex justify-center py-1.5 rounded-sm transition-colors",
                      theme === "dark"
                        ? "bg-background shadow-sm text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <Moon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setTheme("system")}
                    className={cn(
                      "flex-1 flex justify-center py-1.5 rounded-sm transition-colors",
                      theme === "system"
                        ? "bg-background shadow-sm text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <Laptop className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  sessionStorage.clear();
                  auth.signOut();
                  window.location.href = "/login";
                }}
                className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        <main className="flex-1 overflow-y-auto p-6 relative">
          <Outlet />
        </main>
      </div>

      {/* Global Command Palette */}
      <GlobalSearch
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        navigation={navigation.filter((item) => {
          if (user?.role === "employee") {
            return !["Organization Setup", "Maintenance", "Audit", "Reports"].includes(item.name);
          }
          return true;
        })}
      />
    </div>
  );
}
