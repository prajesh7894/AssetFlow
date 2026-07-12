import { Plus } from "lucide-react";
import { useFirestoreQuery } from "../../hooks/useFirestoreQuery";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";

export default function Organization() {
  const { data: departments, loading } = useFirestoreQuery<any>("departments");

  return (
    <div className="max-w-4xl flex flex-col h-full">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-semibold">Organization Setup</h2>
          <p className="text-sm text-muted-foreground mt-1">Manage departments, roles, and hierarchy</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Department
        </Button>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Department Name</TableHead>
              <TableHead>Head of Dept.</TableHead>
              <TableHead>Employees</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">Loading departments...</TableCell>
              </TableRow>
            ) : departments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">No departments found.</TableCell>
              </TableRow>
            ) : (
              departments.map((dept) => (
                <TableRow key={dept.id}>
                  <TableCell className="font-medium text-foreground">{dept.name}</TableCell>
                  <TableCell>{dept.headId}</TableCell>
                  <TableCell>--</TableCell>
                  <TableCell>
                    <Badge variant={dept.status === "Active" ? "success" : "secondary"}>
                      {dept.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <button className="text-xs font-medium text-primary hover:underline">Edit</button>
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
