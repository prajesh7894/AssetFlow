import { Wrench } from "lucide-react";
import { useFirestoreQuery } from "../../hooks/useFirestoreQuery";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";

export default function Maintenance() {
  const { data: maintenance, loading } = useFirestoreQuery<any>("maintenance");

  return (
    <div className="max-w-6xl flex flex-col h-full">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-semibold">Maintenance</h2>
          <p className="text-sm text-muted-foreground mt-1">Manage repair tickets and maintenance schedules</p>
        </div>
        <Button>
          <Wrench className="mr-2 h-4 w-4" />
          New Ticket
        </Button>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Asset ID</TableHead>
              <TableHead>Issue Description</TableHead>
              <TableHead>Reported At</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">Loading maintenance tickets...</TableCell>
              </TableRow>
            ) : maintenance.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">No maintenance tickets.</TableCell>
              </TableRow>
            ) : (
              maintenance.map((ticket) => (
                <TableRow key={ticket.id}>
                  <TableCell className="font-medium text-foreground">{ticket.assetId}</TableCell>
                  <TableCell>{ticket.issue}</TableCell>
                  <TableCell>{new Date(ticket.reportedAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge variant={ticket.priority === "High" ? "destructive" : "secondary"}>
                      {ticket.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={ticket.status === "Pending" ? "outline" : "success"}>
                      {ticket.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <button className="text-xs font-medium text-primary hover:underline">View</button>
                    <button className="text-xs font-medium text-primary hover:underline">Resolve</button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
