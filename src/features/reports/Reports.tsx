import { toast } from "sonner";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Download, PieChart as PieChartIcon, Activity, ShieldCheck, DollarSign } from "lucide-react";
import { useFirestoreQuery } from "../../hooks/useFirestoreQuery";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function Reports() {
  // Fetch multiple collections
  const { data: assets, loading: assetsLoading } = useFirestoreQuery<any>("assets");
  const { data: maintenance, loading: maintLoading } = useFirestoreQuery<any>("maintenance");
  const { data: auditLogs, loading: auditLoading } = useFirestoreQuery<any>("auditLogs");

  const isLoading = assetsLoading || maintLoading || auditLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-pulse text-muted-foreground flex flex-col items-center">
          <Activity className="h-8 w-8 mb-4 animate-spin opacity-50" />
          <p>Compiling analytics engine...</p>
        </div>
      </div>
    );
  }

  // --- KPI Calculations ---
  const totalAssetValue = assets.reduce((sum: number, asset: any) => sum + (Number(asset.cost) || 0), 0);
  
  const openTickets = maintenance.filter((t: any) => t.status !== "Resolved" && t.status !== "Rejected").length;
  const maintLoad = maintenance.length > 0 ? (openTickets / maintenance.length) * 100 : 0;

  const totalAudits = auditLogs.length;
  const verifiedAudits = auditLogs.filter((a: any) => a.status === "Match" || a.status === "Resolved").length;
  const complianceRate = totalAudits > 0 ? (verifiedAudits / totalAudits) * 100 : 100;

  // --- Chart Data Preparation ---
  const statusData = assets.reduce((acc: any, asset: any) => {
    const existing = acc.find((x: any) => x.name === asset.status);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: asset.status, value: 1 });
    }
    return acc;
  }, []);

  const maintPriorityData = maintenance.reduce((acc: any, ticket: any) => {
    const existing = acc.find((x: any) => x.name === ticket.priority);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: ticket.priority, value: 1 });
    }
    return acc;
  }, []);

  // Ensure sorting for priorities if they exist
  const priorityOrder: Record<string, number> = { "Critical": 1, "High": 2, "Medium": 3, "Low": 4 };
  maintPriorityData.sort((a: any, b: any) => (priorityOrder[a.name] || 99) - (priorityOrder[b.name] || 99));

  // --- CSV Export Engine ---
  const exportToCSV = (filename: string, rows: any[]) => {
    if (!rows || !rows.length) {
      toast("No data available to export.");
      return;
    }

    // Extract headers
    const headers = Object.keys(rows[0]).filter(key => key !== 'image' && key !== 'history');
    
    // Convert rows
    const csvContent = [
      headers.join(','),
      ...rows.map(row => 
        headers.map(header => {
          let val = row[header];
          if (val === null || val === undefined) val = "";
          // Escape quotes and wrap in quotes for CSV safety
          return `"${String(val).replace(/"/g, '""')}"`;
        }).join(',')
      )
    ].join('\n');

    // Trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl flex flex-col h-full space-y-6 animate-in fade-in duration-500 pb-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-semibold flex items-center">
            <PieChartIcon className="mr-2 h-6 w-6 text-primary" />
            Reports & Analytics
          </h2>
          <p className="text-sm text-muted-foreground mt-1">Cross-module insights and data exports.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => exportToCSV('Asset_Registry', assets)}>
            <Download className="mr-2 h-4 w-4" /> Export Assets
          </Button>
          <Button variant="outline" onClick={() => exportToCSV('Maintenance_Logs', maintenance)}>
            <Download className="mr-2 h-4 w-4" /> Export Maintenance
          </Button>
        </div>
      </div>

      {/* Advanced KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-card to-card/50 border-border/50 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Total Asset Value</p>
                <h3 className="text-3xl font-bold tracking-tight">${totalAssetValue.toLocaleString()}</h3>
              </div>
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-card to-card/50 border-border/50 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Audit Compliance Rate</p>
                <h3 className="text-3xl font-bold tracking-tight text-emerald-500">{complianceRate.toFixed(1)}%</h3>
              </div>
              <div className="h-12 w-12 bg-emerald-500/10 rounded-full flex items-center justify-center">
                <ShieldCheck className="h-6 w-6 text-emerald-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-card to-card/50 border-border/50 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Maintenance Load</p>
                <h3 className="text-3xl font-bold tracking-tight text-amber-500">{maintLoad.toFixed(1)}%</h3>
              </div>
              <div className="h-12 w-12 bg-amber-500/10 rounded-full flex items-center justify-center">
                <Activity className="h-6 w-6 text-amber-500" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-4">{openTickets} active tickets pending resolution.</p>
          </CardContent>
        </Card>
      </div>

      {/* Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Asset Distribution Pie Chart */}
        <Card className="border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Overall Fleet Status</CardTitle>
          </CardHeader>
          <CardContent className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {statusData.map((_entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', borderRadius: '8px', color: '#fff' }} 
                  itemStyle={{ color: '#fff' }}
                />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Maintenance Priority Bar Chart */}
        <Card className="border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Maintenance Pipeline by Priority</CardTitle>
          </CardHeader>
          <CardContent className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={maintPriorityData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                <XAxis dataKey="name" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }} 
                  contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', borderRadius: '8px', color: '#fff' }} 
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {maintPriorityData.map((entry: any, index: number) => {
                    let color = '#3b82f6'; // Default
                    if (entry.name === 'Critical') color = '#ef4444';
                    if (entry.name === 'High') color = '#f97316';
                    if (entry.name === 'Medium') color = '#3b82f6';
                    if (entry.name === 'Low') color = '#9ca3af';
                    return <Cell key={`cell-${index}`} fill={color} />;
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
