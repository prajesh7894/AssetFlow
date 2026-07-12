import { Search } from "lucide-react";

const auditLogs = [
  { id: "#1003", name: "Laptop", location: "Dept HR", verification: "Match" },
  { id: "#A2000", name: "Monitor", location: "Dept HR", verification: "Match" },
  { id: "#1100", name: "Server", location: "Dept IT", verification: "Mismatch" },
];

export default function Audit() {
  return (
    <div className="max-w-5xl">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Asset Audit</h2>
        <span className="text-sm text-muted-foreground bg-secondary px-2 py-1 rounded">Audit logs, checks, auto-generated discrepancy report</span>
      </div>

      <div className="relative max-w-xl mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search tag, location or owner..."
          className="w-full pl-9 pr-4 py-2 bg-background border border-input rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden mb-8">
        <table className="w-full text-left text-sm">
          <thead className="bg-secondary/50 border-b border-border">
            <tr>
              <th className="px-4 py-3 font-medium">Asset</th>
              <th className="px-4 py-3 font-medium">Reported location</th>
              <th className="px-4 py-3 font-medium">Verification</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {auditLogs.map((log) => (
              <tr key={log.id} className="hover:bg-secondary/30 transition-colors">
                <td className="px-4 py-3 font-medium text-foreground">{log.id} {log.name}</td>
                <td className="px-4 py-3 text-muted-foreground">{log.location}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${
                      log.verification === "Match"
                        ? "bg-primary/20 text-primary border-primary/30"
                        : "bg-destructive/20 text-destructive border-destructive/30"
                    }`}
                  >
                    {log.verification}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-secondary/30 border border-border p-4 rounded-lg flex items-center justify-between">
        <p className="text-sm font-medium">Audit & Report - discrepancy report generated automatically</p>
        <button className="bg-primary/20 text-primary border border-primary/30 hover:bg-primary/30 px-4 py-2 rounded-md font-medium text-sm transition-colors">
          View audit report
        </button>
      </div>
    </div>
  );
}
