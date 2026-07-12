import { Search, Plus } from "lucide-react";
import { useState } from "react";
import { useFirestoreQuery } from "../../hooks/useFirestoreQuery";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";

const filterTabs = ["Category", "Location", "Department"];

export default function Assets() {
  const [activeFilter, setActiveFilter] = useState("Category");
  const [searchTerm, setSearchTerm] = useState("");
  const { data: assets, loading } = useFirestoreQuery<any>("assets");

  const filteredAssets = assets.filter(asset => 
    asset.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    asset.tag.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl flex flex-col h-full">
      <h2 className="text-2xl font-semibold mb-6">Assets directory</h2>

      <div className="flex items-center justify-between mb-6">
        <div className="flex-1 max-w-xl flex gap-4 flex-col sm:flex-row items-start sm:items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search assets by tag, name..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
        
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Register Asset
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tag</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Location</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">Loading assets...</TableCell>
            </TableRow>
          ) : filteredAssets.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">No assets found.</TableCell>
            </TableRow>
          ) : (
            filteredAssets.map((asset) => (
              <TableRow key={asset.id}>
                <TableCell className="font-medium text-foreground">{asset.tag}</TableCell>
                <TableCell>{asset.name}</TableCell>
                <TableCell>{asset.category}</TableCell>
                <TableCell>
                  <Badge 
                    variant={
                      asset.status === "Allocated" ? "secondary" : 
                      asset.status === "Available" ? "success" : "destructive"
                    }
                  >
                    {asset.status}
                  </Badge>
                </TableCell>
                <TableCell>{asset.location}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
