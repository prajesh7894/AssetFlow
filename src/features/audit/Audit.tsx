import { ShieldCheck } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Badge } from "../../components/ui/badge";

export default function Audit() {
  // We don't have an audit collection in the dummy data yet, we can simulate or fetch from a new collection if seeded.
  // Using static for now with the reusable components to ensure it meets requirements.
  const auditLogs = [
    { id: "au-1", assetId: "asset-1", reportedLocation: "London", verification: "Match", timestamp: new Date(Date.now() - 86400000).toISOString() },
    { id: "au-2", assetId: "asset-2", reportedLocation: "NY Floor 3", verification: "Mismatch", timestamp: new Date(Date.now() - 172800000).toISOString() },
  ];

  return (
    <div className="max-w-6xl flex flex-col h-full">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-semibold">Audit & Verification</h2>
          <p className="text-sm text-muted-foreground mt-1">Review physical audits and discrepancy logs</p>
        </div>
        <Button>
          <ShieldCheck className="mr-2 h-4 w-4" />
          Start New Audit
        </Button>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden flex flex-col">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Audit ID</TableHead>
              <TableHead>Asset ID</TableHead>
              <TableHead>Reported Location</TableHead>
              <TableHead>Verification Status</TableHead>
              <TableHead>Timestamp</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {auditLogs.map((log) => (
              <TableRow key={log.id}>
                <TableCell className="font-medium">{log.id}</TableCell>
                <TableCell>{log.assetId}</TableCell>
                <TableCell>{log.reportedLocation}</TableCell>
                <TableCell>
                  <Badge variant={log.verification === "Match" ? "success" : "destructive"}>
                    {log.verification}
                  </Badge>
                </TableCell>
                <TableCell>{new Date(log.timestamp).toLocaleDateString()}</TableCell>
                <TableCell className="text-right space-x-2">
                  <button className="text-xs font-medium text-primary hover:underline">Review</button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
