import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MonitorSmartphone, Users, ArrowRight, CornerDownLeft, Box } from "lucide-react";
import { useFirestoreQuery } from "../../hooks/useFirestoreQuery";

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
  navigation: Array<{ name: string; href: string; icon: any }>;
}

export function GlobalSearch({ isOpen, onClose, navigation }: GlobalSearchProps) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Queries
  const { data: assets } = useFirestoreQuery<any>("assets");
  const { data: employees } = useFirestoreQuery<any>("employees");

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery("");
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Handle outside click to close
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const searchQuery = query.toLowerCase().trim();

  // 1. Filter Navigation
  const filteredNav = navigation.filter(n => n.name.toLowerCase().includes(searchQuery));
  
  // 2. Filter Assets
  const filteredAssets = assets
    .filter((a: any) => 
      (a.name && a.name.toLowerCase().includes(searchQuery)) || 
      (a.tag && a.tag.toLowerCase().includes(searchQuery))
    )
    .slice(0, 3); // Max 3

  // 3. Filter Employees
  const filteredEmployees = employees
    .filter((e: any) => 
      (e.name && e.name.toLowerCase().includes(searchQuery)) ||
      (e.email && e.email.toLowerCase().includes(searchQuery))
    )
    .slice(0, 3);

  // Flatten results for keyboard navigation
  const flatResults = [
    ...filteredNav.map(n => ({ type: 'nav', data: n, href: n.href })),
    ...filteredAssets.map(a => ({ type: 'asset', data: a, href: '/assets' })), // Routes to assets for now
    ...filteredEmployees.map(e => ({ type: 'employee', data: e, href: '/organization' })) // Routes to org
  ];

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(flatResults.length, 1));
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + flatResults.length) % Math.max(flatResults.length, 1));
    }
    if (e.key === "Enter") {
      e.preventDefault();
      if (flatResults[selectedIndex]) {
        navigate(flatResults[selectedIndex].href);
        onClose();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-background/80 backdrop-blur-sm animate-in fade-in" 
        onClick={onClose}
      />
      
      {/* Search Modal */}
      <div className="relative z-[101] w-full max-w-2xl bg-card border border-border shadow-2xl rounded-2xl flex flex-col max-h-[70vh] overflow-hidden animate-in slide-in-from-top-4 fade-in duration-200">
        
        {/* Search Input */}
        <div className="flex items-center px-4 border-b border-border/50">
          <Search className="h-5 w-5 text-muted-foreground mr-3 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            className="flex-1 bg-transparent border-0 h-14 focus:ring-0 text-lg placeholder:text-muted-foreground/60 outline-none w-full"
            placeholder="Search assets, employees, or modules..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
          />
          <div className="hidden sm:flex items-center gap-1 text-[10px] text-muted-foreground font-mono bg-secondary/50 px-2 py-1 rounded-md border border-border/50">
            <span>ESC</span>
          </div>
        </div>

        {/* Results Container */}
        <div className="flex-1 overflow-y-auto p-2">
          {flatResults.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground text-sm">
              No results found for "{query}"
            </div>
          ) : (
            <div className="space-y-4">
              
              {/* Navigation Results */}
              {filteredNav.length > 0 && (
                <div>
                  <h3 className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Navigation</h3>
                  <div className="space-y-1">
                    {filteredNav.map((item) => {
                      const globalIdx = flatResults.findIndex(r => r.data === item);
                      const isSelected = globalIdx === selectedIndex;
                      return (
                        <div 
                          key={item.name}
                          onClick={() => { navigate(item.href); onClose(); }}
                          onMouseEnter={() => setSelectedIndex(globalIdx)}
                          className={`flex items-center justify-between px-3 py-3 rounded-xl cursor-pointer transition-colors ${
                            isSelected ? "bg-primary text-primary-foreground shadow-sm" : "hover:bg-secondary/50 text-foreground"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <item.icon className={`h-5 w-5 ${isSelected ? "text-primary-foreground/80" : "text-muted-foreground"}`} />
                            <span className="font-medium">{item.name}</span>
                          </div>
                          {isSelected && <CornerDownLeft className="h-4 w-4 opacity-50" />}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Asset Results */}
              {filteredAssets.length > 0 && (
                <div>
                  <h3 className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Assets</h3>
                  <div className="space-y-1">
                    {filteredAssets.map((asset) => {
                      const globalIdx = flatResults.findIndex(r => r.data === asset);
                      const isSelected = globalIdx === selectedIndex;
                      return (
                        <div 
                          key={asset.id}
                          onClick={() => { navigate('/assets'); onClose(); }}
                          onMouseEnter={() => setSelectedIndex(globalIdx)}
                          className={`flex items-center justify-between px-3 py-3 rounded-xl cursor-pointer transition-colors ${
                            isSelected ? "bg-primary text-primary-foreground shadow-sm" : "hover:bg-secondary/50 text-foreground"
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <Box className={`h-5 w-5 flex-shrink-0 ${isSelected ? "text-primary-foreground/80" : "text-muted-foreground"}`} />
                            <div className="flex flex-col min-w-0">
                              <span className="font-medium truncate">{asset.name}</span>
                              <span className={`text-xs ${isSelected ? "text-primary-foreground/70" : "text-muted-foreground"} font-mono truncate`}>
                                {asset.tag} &bull; {asset.status}
                              </span>
                            </div>
                          </div>
                          <ArrowRight className={`h-4 w-4 ${isSelected ? "opacity-100" : "opacity-0 text-muted-foreground"} transition-opacity`} />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Employee Results */}
              {filteredEmployees.length > 0 && (
                <div>
                  <h3 className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Employees</h3>
                  <div className="space-y-1">
                    {filteredEmployees.map((emp) => {
                      const globalIdx = flatResults.findIndex(r => r.data === emp);
                      const isSelected = globalIdx === selectedIndex;
                      return (
                        <div 
                          key={emp.id}
                          onClick={() => { navigate('/organization'); onClose(); }}
                          onMouseEnter={() => setSelectedIndex(globalIdx)}
                          className={`flex items-center justify-between px-3 py-3 rounded-xl cursor-pointer transition-colors ${
                            isSelected ? "bg-primary text-primary-foreground shadow-sm" : "hover:bg-secondary/50 text-foreground"
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <Users className={`h-5 w-5 flex-shrink-0 ${isSelected ? "text-primary-foreground/80" : "text-muted-foreground"}`} />
                            <div className="flex flex-col min-w-0">
                              <span className="font-medium truncate">{emp.name}</span>
                              <span className={`text-xs ${isSelected ? "text-primary-foreground/70" : "text-muted-foreground"} truncate`}>
                                {emp.email} &bull; {emp.department}
                              </span>
                            </div>
                          </div>
                          <ArrowRight className={`h-4 w-4 ${isSelected ? "opacity-100" : "opacity-0 text-muted-foreground"} transition-opacity`} />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-border/50 bg-secondary/20">
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><MonitorSmartphone className="h-3 w-3" /> Navigation</span>
            <span className="flex items-center gap-1"><Box className="h-3 w-3" /> Assets</span>
            <span className="flex items-center gap-1"><Users className="h-3 w-3" /> Personnel</span>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-[10px] text-muted-foreground font-medium flex items-center gap-1">
              <kbd className="font-mono bg-secondary/50 px-1.5 py-0.5 rounded border border-border/50">&uarr;</kbd>
              <kbd className="font-mono bg-secondary/50 px-1.5 py-0.5 rounded border border-border/50">&darr;</kbd>
              to navigate
            </span>
            <span className="text-[10px] text-muted-foreground font-medium flex items-center gap-1">
              <kbd className="font-mono bg-secondary/50 px-1.5 py-0.5 rounded border border-border/50">&crarr;</kbd>
              to select
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
