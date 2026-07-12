import { ArrowRightLeft } from "lucide-react";
import { useFirestoreQuery } from "../../hooks/useFirestoreQuery";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";

export default function Allocation() {
  const { data: assets, loading } = useFirestoreQuery<any>("assets");

  const allocations = assets.filter(a => a.status === "Allocated" || a.status === "In Transit");

  return (
    <div className="max-w-6xl flex flex-col h-full">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-semibold">Asset Allocation</h2>
          <p className="text-sm text-muted-foreground mt-1">Manage assignments and track transfers</p>
        </div>
        <Button>
          <ArrowRightLeft className="mr-2 h-4 w-4" />
          Transfer Asset
        </Button>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Asset Tag</TableHead>
              <TableHead>Asset Name</TableHead>
              <TableHead>Assigned To</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">Loading allocations...</TableCell>
              </TableRow>
            ) : allocations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">No assigned assets.</TableCell>
              </TableRow>
            ) : (
              allocations.map((asset) => (
                <TableRow key={asset.id}>
                  <TableCell className="font-medium text-foreground">{asset.tag}</TableCell>
                  <TableCell>{asset.name}</TableCell>
                  <TableCell>{asset.assignedTo || "Unassigned"}</TableCell>
                  <TableCell>{asset.location}</TableCell>
                  <TableCell>
                    <Badge variant={asset.status === "In Transit" ? "secondary" : "default"}>
                      {asset.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <button className="text-xs font-medium text-primary hover:underline">Revoke</button>
                    <button className="text-xs font-medium text-primary hover:underline">Re-assign</button>
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
