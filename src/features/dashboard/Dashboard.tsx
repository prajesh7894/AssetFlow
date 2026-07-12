import { AlertCircle } from "lucide-react";

export default function Dashboard() {
  const stats = [
    { name: "Available Assets", value: "320" },
    { name: "In Transit", value: "45" },
    { name: "Available", value: "0" },
    { name: "Active Bookings", value: "8" },
    { name: "Pending Transfers", value: "12" },
    { name: "Opening Balance", value: "—" },
  ];

  return (
    <div className="max-w-5xl">
      <h2 className="text-2xl font-semibold mb-6">Dashboard</h2>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {stats.map((stat, i) => (
          <div key={i} className="bg-card border border-border p-4 rounded-lg shadow-sm flex flex-col justify-between">
            <p className="text-sm text-muted-foreground">{stat.name}</p>
            <p className="text-2xl font-semibold mt-2">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Alert */}
      <div className="bg-destructive/10 border border-destructive/50 text-destructive-foreground p-4 rounded-lg mb-6 flex items-center gap-3">
        <AlertCircle className="text-destructive h-5 w-5" />
        <span className="text-sm font-medium text-destructive">Urgent pending for approval - flag generated from log</span>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 mb-10">
        <button className="px-4 py-2 bg-primary/20 text-primary border border-primary/30 rounded-md text-sm font-medium hover:bg-primary/30 transition-colors">
          Generate report
        </button>
        <button className="px-4 py-2 bg-secondary text-secondary-foreground border border-border rounded-md text-sm font-medium hover:bg-secondary/80 transition-colors">
          Send reminder
        </button>
        <button className="px-4 py-2 bg-secondary text-secondary-foreground border border-border rounded-md text-sm font-medium hover:bg-secondary/80 transition-colors">
          View requests
        </button>
      </div>

      {/* Recent Activity */}
      <div>
        <h3 className="text-lg font-medium mb-4">Recent Activity</h3>
        <div className="space-y-4">
          <div className="text-sm">
            <p className="text-foreground">Equipment #001 allocated to New Dept - 10m ago</p>
          </div>
          <div className="text-sm">
            <p className="text-foreground">Asset #45 - Booking confirmed - 12/10/24 5:00 PM</p>
          </div>
          <div className="text-sm">
            <p className="text-foreground">Flagged - A#1022 maintenance required</p>
          </div>
        </div>
      </div>
    </div>
  );
}
