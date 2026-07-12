import { toast } from "sonner";
import { 
  Database, 
  Box, 
  ArrowRightLeft, 
  Wrench, 
  Calendar, 
  Clock, 
  RotateCcw,
  Plus,
  FileText,
  AlertCircle,
  Bell
} from "lucide-react";
import { useState } from "react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell 
} from 'recharts';
import { useFirestoreQuery } from "../../hooks/useFirestoreQuery";
import { seedDatabase } from "../../lib/seedData";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";

const PIE_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function Dashboard() {
  const { data: assets, loading: assetsLoading } = useFirestoreQuery<any>("assets");
  const { data: notifications, loading: notifLoading } = useFirestoreQuery<any>("notifications");
  const [seeding, setSeeding] = useState(false);

  const handleSeed = async () => {
    setSeeding(true);
    try {
      await seedDatabase();
      toast.success("Database seeded successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to seed. Is Firebase Configured?");
    }
    setSeeding(false);
  };

  // --- KPI Metrics ---
  const availableAssets = assets.filter(a => a.status === "Available").length;
  const allocatedAssets = assets.filter(a => a.status === "Allocated").length;
  const maintenanceCount = assets.filter(a => a.status === "Maintenance").length;
  const inTransit = assets.filter(a => a.status === "In Transit").length;
  
  // Dummy metrics for bookings & returns for now since they are derived from other collections
  const activeBookings = 12;
  const upcomingReturns = 3;

  const kpis = [
    { name: "Available", value: availableAssets, icon: Box, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { name: "Allocated", value: allocatedAssets, icon: ArrowRightLeft, color: "text-blue-500", bg: "bg-blue-500/10" },
    { name: "Maintenance", value: maintenanceCount, icon: Wrench, color: "text-rose-500", bg: "bg-rose-500/10" },
    { name: "Bookings", value: activeBookings, icon: Calendar, color: "text-purple-500", bg: "bg-purple-500/10" },
    { name: "In Transit", value: inTransit, icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10" },
    { name: "Returns", value: upcomingReturns, icon: RotateCcw, color: "text-indigo-500", bg: "bg-indigo-500/10" },
  ];

  // --- Chart Data ---
  const categoryData = assets.reduce((acc: any, asset: any) => {
    const existing = acc.find((x: any) => x.name === asset.category);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: asset.category, value: 1 });
    }
    return acc;
  }, []);

  const statusData = assets.reduce((acc: any, asset: any) => {
    const existing = acc.find((x: any) => x.name === asset.status);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: asset.status, value: 1 });
    }
    return acc;
  }, []);

  // Show loading skeleton if fetching
  if (assetsLoading || notifLoading) {
    return <div className="h-full flex items-center justify-center text-muted-foreground animate-pulse">Loading dashboard telemetry...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto flex flex-col space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Overview</h2>
          <p className="text-muted-foreground mt-1">Real-time enterprise telemetry and operations.</p>
        </div>
        <Button variant="outline" onClick={handleSeed} disabled={seeding} className="group transition-all">
          <Database className="mr-2 h-4 w-4 group-hover:text-primary transition-colors" />
          {seeding ? "Syncing..." : "Seed Sandbox Data"}
        </Button>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {kpis.map((kpi, idx) => (
          <div 
            key={idx} 
            className="group relative overflow-hidden bg-card border border-border rounded-xl p-5 shadow-sm transition-all hover:shadow-md hover:-translate-y-1 hover:border-primary/50"
          >
            <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full opacity-20 blur-2xl transition-all group-hover:opacity-40 ${kpi.bg}`}></div>
            <div className="flex items-center justify-between mb-4 relative z-10">
              <div className={`p-2 rounded-lg ${kpi.bg}`}>
                <kpi.icon className={`h-5 w-5 ${kpi.color}`} />
              </div>
            </div>
            <div className="relative z-10">
              <h3 className="text-3xl font-bold tracking-tighter">{kpi.value}</h3>
              <p className="text-sm font-medium text-muted-foreground mt-1">{kpi.name}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Analytics & Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-sm border-border">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Box className="h-4 w-4 text-primary" /> Asset Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                  <XAxis dataKey="name" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                  <Tooltip 
                    cursor={{ fill: 'rgba(255,255,255,0.05)' }} 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px', color: 'hsl(var(--foreground))' }} 
                  />
                  <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} animationDuration={1500} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">No data available</div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-sm border-border">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <RotateCcw className="h-4 w-4 text-primary" /> Status Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            {statusData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    animationDuration={1500}
                  >
                    {statusData.map((_entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} stroke="hsl(var(--card))" strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px', color: 'hsl(var(--foreground))' }} 
                    itemStyle={{ color: 'hsl(var(--foreground))' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">No data available</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Activity */}
        <Card className="lg:col-span-2 shadow-sm border-border flex flex-col">
          <CardHeader className="border-b border-border bg-secondary/20">
            <CardTitle className="text-lg font-semibold flex items-center justify-between">
              <span className="flex items-center gap-2"><Bell className="h-4 w-4 text-primary" /> Live Operations Stream</span>
              <Badge variant="outline" className="font-normal text-xs">{notifications.length} alerts</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 flex-1">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">No operations logged recently.</div>
            ) : (
              <div className="divide-y divide-border">
                {notifications.slice(0, 6).map((notif: any) => (
                  <div key={notif.id} className="p-4 hover:bg-secondary/30 transition-colors flex gap-4 items-start group">
                    <div className={`mt-1 rounded-full p-1 border flex-shrink-0 transition-transform group-hover:scale-110
                      ${notif.type === 'alert' ? 'bg-destructive/10 border-destructive/20 text-destructive' : 
                        notif.type === 'approval' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 
                        'bg-blue-500/10 border-blue-500/20 text-blue-500'}`}
                    >
                      <AlertCircle className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{notif.text}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{new Date(notif.timestamp).toLocaleString()}</p>
                    </div>
                    {!notif.read && <div className="w-2 h-2 rounded-full bg-primary mt-2 animate-pulse"></div>}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="space-y-6">
          <Card className="shadow-sm border-border bg-gradient-to-b from-card to-secondary/20">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start font-medium" variant="default">
                <Plus className="mr-2 h-4 w-4" /> Register New Asset
              </Button>
              <Button className="w-full justify-start font-medium" variant="outline">
                <ArrowRightLeft className="mr-2 h-4 w-4" /> Transfer Request
              </Button>
              <Button className="w-full justify-start font-medium" variant="outline">
                <Wrench className="mr-2 h-4 w-4" /> Report Maintenance
              </Button>
              <Button className="w-full justify-start font-medium" variant="outline">
                <FileText className="mr-2 h-4 w-4" /> Generate Audit Log
              </Button>
            </CardContent>
          </Card>
          
          {/* Urgent Alert Banner */}
          <div className="bg-destructive/10 border border-destructive/30 rounded-xl p-4 flex gap-3 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-destructive"></div>
            <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 animate-pulse" />
            <div>
              <h4 className="text-sm font-semibold text-destructive">Action Required</h4>
              <p className="text-xs text-destructive/80 mt-1">2 high-priority maintenance tickets pending approval.</p>
              <button className="text-xs font-bold text-destructive mt-2 hover:underline">Review Tickets &rarr;</button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
