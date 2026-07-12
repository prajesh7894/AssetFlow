import { AlertCircle, Database } from "lucide-react";
import { useFirestoreQuery } from "../../hooks/useFirestoreQuery";
import { seedDatabase } from "../../lib/seedData";
import { useState } from "react";
import { Button } from "../../components/ui/button";

export default function Dashboard() {
  const { data: assets } = useFirestoreQuery<any>("assets");
  const { data: notifications } = useFirestoreQuery<any>("notifications");
  const [seeding, setSeeding] = useState(false);

  const handleSeed = async () => {
    setSeeding(true);
    try {
      await seedDatabase();
      alert("Database seeded successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to seed. Is Firebase Configured?");
    }
    setSeeding(false);
  };

  const availableAssets = assets.filter(a => a.status === "Available").length;
  const inTransit = assets.filter(a => a.status === "In Transit").length;
  const allocated = assets.filter(a => a.status === "Allocated").length;

  const stats = [
    { name: "Total Assets", value: assets.length || "0" },
    { name: "In Transit", value: inTransit },
    { name: "Available", value: availableAssets },
    { name: "Allocated", value: allocated },
    { name: "Pending Transfers", value: "—" },
    { name: "Maintenance", value: assets.filter(a => a.status === "Maintenance").length },
  ];

  return (
    <div className="max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Dashboard</h2>
        <Button variant="outline" size="sm" onClick={handleSeed} disabled={seeding}>
          <Database className="mr-2 h-4 w-4" />
          {seeding ? "Seeding..." : "Seed Dummy Data"}
        </Button>
      </div>
      
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
        <Button>Generate report</Button>
        <Button variant="secondary">Send reminder</Button>
        <Button variant="secondary">View requests</Button>
      </div>

      {/* Recent Activity */}
      <div>
        <h3 className="text-lg font-medium mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {notifications.slice(0, 5).map((n) => (
            <div key={n.id} className="text-sm flex gap-2">
              <span className={`w-2 h-2 mt-1.5 rounded-full flex-shrink-0 ${n.type === 'alert' ? 'bg-destructive' : n.type === 'approval' ? 'bg-primary' : 'bg-muted-foreground'}`}></span>
              <p className="text-foreground">{n.text} - <span className="text-muted-foreground">{new Date(n.timestamp).toLocaleString()}</span></p>
            </div>
          ))}
          {notifications.length === 0 && (
            <p className="text-sm text-muted-foreground">No recent activity. Try seeding the database!</p>
          )}
        </div>
      </div>
    </div>
  );
}
