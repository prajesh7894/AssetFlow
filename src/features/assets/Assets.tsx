import { toast } from "sonner";
import { Search, Plus, Edit, Trash2, ChevronLeft, ChevronRight, ArrowUpDown } from "lucide-react";
import { useState, useMemo } from "react";
import { useFirestoreQuery } from "../../hooks/useFirestoreQuery";
import { useFirestoreMutation } from "../../hooks/useFirestoreMutation";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Dialog } from "../../components/ui/dialog";
import { AssetForm } from "./AssetForm";
import { QRCodePlaceholder } from "../../components/ui/qrcode";

const filterTabs = ["All", "Hardware", "Software", "Furniture", "Vehicles"];
const ITEMS_PER_PAGE = 5;

export default function Assets() {
  // State
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<any>(null);

  // Queries & Mutations
  const { data: assets, loading } = useFirestoreQuery<any>("assets");
  const { createRecord, updateRecord, deleteRecord, loading: mutating } = useFirestoreMutation("assets");

  // --- Logic: Auto Asset Tag ---
  const generateNextTag = () => {
    if (!assets || assets.length === 0) return "AF-0001";
    // Find highest AF-XXXX
    let max = 0;
    assets.forEach(a => {
      const match = a.tag.match(/AF-(\d+)/);
      if (match) {
        const num = parseInt(match[1], 10);
        if (num > max) max = num;
      }
    });
    return `AF-${String(max + 1).padStart(4, '0')}`;
  };

  // --- Handlers ---
  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleOpenCreate = () => {
    setEditingAsset(null);
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (asset: any) => {
    setEditingAsset(asset);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this asset?")) {
      await deleteRecord(id);
    }
  };

  const handleSubmit = async (formData: any) => {
    try {
      if (editingAsset) {
        await updateRecord(editingAsset.id, {
          ...formData,
          history: [...(editingAsset.history || []), { date: new Date().toISOString(), action: "Asset details updated" }]
        });
      } else {
        const newTag = generateNextTag();
        await createRecord({
          ...formData,
          tag: newTag,
          assignedTo: null,
          history: [{ date: new Date().toISOString(), action: "Asset registered" }]
        });
      }
      setIsDialogOpen(false);
    } catch (err) {
      console.error(err);
      toast("Failed to save asset.");
    }
  };

  // --- Data Processing (Search, Filter, Sort, Paginate) ---
  const processedData = useMemo(() => {
    let result = [...assets];

    // Filter
    if (activeFilter !== "All") {
      result = result.filter(a => a.category === activeFilter);
    }

    // Search
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      result = result.filter(a => 
        a.name.toLowerCase().includes(lower) || 
        a.tag.toLowerCase().includes(lower) ||
        a.location.toLowerCase().includes(lower)
      );
    }

    // Sort
    if (sortConfig) {
      result.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [assets, activeFilter, searchTerm, sortConfig]);

  // Pagination
  const totalPages = Math.ceil(processedData.length / ITEMS_PER_PAGE);
  const paginatedData = processedData.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div className="max-w-6xl flex flex-col h-full animate-in fade-in duration-500">
      <h2 className="text-2xl font-semibold mb-6">Asset Management</h2>

      {/* Top Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex gap-2 bg-secondary/30 p-1 rounded-lg border border-border">
          {filterTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => { setActiveFilter(tab); setCurrentPage(1); }}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                activeFilter === tab
                  ? "bg-background border-border shadow-sm text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        
        <Button onClick={handleOpenCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Register Asset
        </Button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search by tag, name, or location..."
          className="pl-9 bg-card border-border"
          value={searchTerm}
          onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
        />
      </div>

      {/* Enterprise Table */}
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden flex flex-col">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px] cursor-pointer hover:bg-secondary/50" onClick={() => handleSort('tag')}>
                <div className="flex items-center">Tag <ArrowUpDown className="ml-2 h-3 w-3" /></div>
              </TableHead>
              <TableHead className="cursor-pointer hover:bg-secondary/50" onClick={() => handleSort('name')}>
                <div className="flex items-center">Asset Name <ArrowUpDown className="ml-2 h-3 w-3" /></div>
              </TableHead>
              <TableHead className="cursor-pointer hover:bg-secondary/50" onClick={() => handleSort('category')}>
                <div className="flex items-center">Category <ArrowUpDown className="ml-2 h-3 w-3" /></div>
              </TableHead>
              <TableHead className="cursor-pointer hover:bg-secondary/50" onClick={() => handleSort('status')}>
                <div className="flex items-center">Status <ArrowUpDown className="ml-2 h-3 w-3" /></div>
              </TableHead>
              <TableHead className="cursor-pointer hover:bg-secondary/50" onClick={() => handleSort('location')}>
                <div className="flex items-center">Location <ArrowUpDown className="ml-2 h-3 w-3" /></div>
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-muted-foreground animate-pulse">Loading directory...</TableCell>
              </TableRow>
            ) : paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">No assets found.</TableCell>
              </TableRow>
            ) : (
              paginatedData.map((asset) => (
                <TableRow key={asset.id} className="group">
                  <TableCell className="font-medium text-foreground">{asset.tag}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {asset.image ? (
                        <img src={asset.image} alt={asset.name} className="w-8 h-8 rounded-md object-cover border border-border" />
                      ) : (
                        <div className="w-8 h-8 rounded-md bg-secondary/50 border border-border flex items-center justify-center text-xs font-medium text-muted-foreground">
                          {asset.name.substring(0, 2).toUpperCase()}
                        </div>
                      )}
                      {asset.name}
                    </div>
                  </TableCell>
                  <TableCell>{asset.category}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={
                        asset.status === "Allocated" ? "secondary" : 
                        asset.status === "Available" ? "success" : 
                        asset.status === "In Transit" ? "outline" : "destructive"
                      }
                    >
                      {asset.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{asset.location}</TableCell>
                  <TableCell className="text-right space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(asset)}>
                      <Edit className="h-4 w-4 text-muted-foreground" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(asset.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Pagination Footer */}
        {!loading && processedData.length > 0 && (
          <div className="p-4 border-t border-border flex items-center justify-between bg-secondary/20">
            <span className="text-sm text-muted-foreground">
              Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, processedData.length)} of {processedData.length} entries
            </span>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Form Dialog */}
      <Dialog 
        isOpen={isDialogOpen} 
        onClose={() => setIsDialogOpen(false)} 
        title={editingAsset ? `Edit Asset: ${editingAsset.tag}` : "Register New Asset"}
      >
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <AssetForm 
              initialData={editingAsset} 
              onSubmit={handleSubmit} 
              isSubmitting={mutating} 
            />
          </div>
          {/* Sidebar for Dialog: QR Code & History */}
          <div className="w-full md:w-48 flex flex-col gap-4 border-t md:border-t-0 md:border-l border-border pt-4 md:pt-0 md:pl-6">
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Asset Tag</h4>
              <QRCodePlaceholder tag={editingAsset ? editingAsset.tag : "AF-XXXX"} />
            </div>
            
            {editingAsset && editingAsset.history && (
              <div className="space-y-2 flex-1 overflow-hidden flex flex-col">
                <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">History</h4>
                <div className="flex-1 overflow-y-auto space-y-3 pr-2 text-sm">
                  {editingAsset.history.map((h: any, i: number) => (
                    <div key={i} className="border-l-2 border-primary/50 pl-2">
                      <p className="text-xs text-muted-foreground">{new Date(h.date).toLocaleDateString()}</p>
                      <p className="font-medium text-foreground">{h.action}</p>
                    </div>
                  )).reverse()}
                </div>
              </div>
            )}
          </div>
        </div>
      </Dialog>
    </div>
  );
}
