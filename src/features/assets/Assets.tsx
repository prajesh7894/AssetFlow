import { Search, Filter, Plus } from "lucide-react";
import { useState } from "react";

const filterTabs = ["Category", "Location", "Department"];

const assets = [
  { tag: "#A1002", name: "Dell Laptop", category: "Hardware", status: "Allocated", location: "London" },
  { tag: "#B4003", name: "Projector", category: "Hardware", status: "Maintenance", location: "NY Floor 2" },
  { tag: "#C8004", name: "Office Chair", category: "Furniture", status: "Available", location: "Warehouse" },
];

export default function Assets() {
  const [activeFilter, setActiveFilter] = useState("Category");

  return (
    <div className="max-w-6xl">
      <h2 className="text-2xl font-semibold mb-6">Assets directory</h2>

      <div className="flex items-center justify-between mb-6">
        <div className="flex-1 max-w-xl flex gap-4 flex-col sm:flex-row items-start sm:items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search assets by tag, name, or employee..."
              className="w-full pl-9 pr-4 py-2 bg-background border border-input rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div className="flex gap-2">
            {filterTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveFilter(tab)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md border transition-colors ${
                  activeFilter === tab
                    ? "bg-secondary border-border text-foreground"
                    : "bg-background border-transparent text-muted-foreground hover:bg-secondary/50"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
        
        <button className="flex items-center gap-2 bg-primary/20 text-primary border border-primary/30 px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/30 transition-colors">
          <Plus className="h-4 w-4" />
          Register Asset
        </button>
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-secondary/50 border-b border-border">
            <tr>
              <th className="px-4 py-3 font-medium">Tag</th>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Location</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {assets.map((asset) => (
              <tr key={asset.tag} className="hover:bg-secondary/30 transition-colors">
                <td className="px-4 py-3 font-medium text-foreground">{asset.tag}</td>
                <td className="px-4 py-3 text-muted-foreground">{asset.name}</td>
                <td className="px-4 py-3 text-muted-foreground">{asset.category}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${
                      asset.status === "Allocated"
                        ? "bg-secondary text-muted-foreground border-border"
                        : asset.status === "Available"
                        ? "bg-primary/20 text-primary border-primary/30"
                        : "bg-destructive/20 text-destructive border-destructive/30"
                    }`}
                  >
                    {asset.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{asset.location}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
