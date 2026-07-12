import { toast } from "sonner";
import { ArrowRightLeft, UserX, CheckCircle, PackageSearch } from "lucide-react";
import { useState } from "react";
import { useFirestoreQuery } from "../../hooks/useFirestoreQuery";
import { useFirestoreMutation } from "../../hooks/useFirestoreMutation";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Dialog } from "../../components/ui/dialog";
import { AllocationForm } from "./AllocationForm";

export default function Allocation() {
  // Data
  const { data: assets, loading } = useFirestoreQuery<any>("assets");
  const { updateRecord, mutating } = useFirestoreMutation("assets");

  // UI State
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedAssetId, setSelectedAssetId] = useState<string | undefined>(undefined);
  const [activeTab, setActiveTab] = useState<"Active" | "Transit">("Active");

  // Filters
  const activeAllocations = assets.filter(a => a.status === "Allocated");
  const transitAllocations = assets.filter(a => a.status === "In Transit");

  // Handlers
  const handleOpenAssign = (assetId?: string) => {
    setSelectedAssetId(assetId);
    setIsAssignModalOpen(true);
  };

  const handleProcessAllocation = async (formData: any) => {
    try {
      const asset = assets.find(a => a.id === formData.assetId);
      if (!asset) return;

      const actionText = formData.status === "In Transit" 
        ? `Shipped to ${formData.location} for ${formData.assignedTo}` 
        : `Assigned to ${formData.assignedTo} at ${formData.location}`;

      await updateRecord(asset.id, {
        assignedTo: formData.assignedTo,
        location: formData.location,
        status: formData.status,
        history: [...(asset.history || []), { date: new Date().toISOString(), action: actionText }]
      });
      setIsAssignModalOpen(false);
    } catch (err) {
      console.error(err);
      toast("Failed to process allocation.");
    }
  };

  const handleRevoke = async (asset: any) => {
    if (confirm(`Are you sure you want to revoke ${asset.name} from ${asset.assignedTo}?`)) {
      try {
        await updateRecord(asset.id, {
          assignedTo: null,
          status: "Available",
          history: [...(asset.history || []), { date: new Date().toISOString(), action: `Revoked from ${asset.assignedTo}` }]
        });
      } catch (err) {
        console.error(err);
        toast("Failed to revoke asset.");
      }
    }
  };

  const handleAcceptTransfer = async (asset: any) => {
    try {
      await updateRecord(asset.id, {
        status: "Allocated",
        history: [...(asset.history || []), { date: new Date().toISOString(), action: `Transfer accepted by ${asset.assignedTo}` }]
      });
    } catch (err) {
      console.error(err);
      toast("Failed to accept transfer.");
    }
  };

  return (
    <div className="max-w-6xl flex flex-col h-full animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-semibold">Asset Allocation & Transfers</h2>
          <p className="text-sm text-muted-foreground mt-1">Manage chain of custody and transfer workflows.</p>
        </div>
        <Button onClick={() => handleOpenAssign()}>
          <ArrowRightLeft className="mr-2 h-4 w-4" />
          New Assignment / Transfer
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-border">
        <button
          onClick={() => setActiveTab("Active")}
          className={`pb-3 text-sm font-medium transition-colors relative ${
            activeTab === "Active" ? "text-primary" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Active Allocations ({activeAllocations.length})
          {activeTab === "Active" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full" />}
        </button>
        <button
          onClick={() => setActiveTab("Transit")}
          className={`pb-3 text-sm font-medium transition-colors relative flex items-center gap-2 ${
            activeTab === "Transit" ? "text-amber-500" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          In Transit
          {transitAllocations.length > 0 && (
            <span className="bg-amber-500/20 text-amber-500 text-[10px] px-1.5 py-0.5 rounded-full">
              {transitAllocations.length} Pending
            </span>
          )}
          {activeTab === "Transit" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500 rounded-t-full" />}
        </button>
      </div>

      {/* Tables */}
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden flex-1">
        
        {/* ACTIVE ALLOCATIONS VIEW */}
        {activeTab === "Active" && (
          <Table>
            <TableHeader className="bg-secondary/20">
              <TableRow>
                <TableHead>Asset Details</TableHead>
                <TableHead>Assigned Employee</TableHead>
                <TableHead>Current Location</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-10 text-muted-foreground animate-pulse">Loading allocations...</TableCell>
                </TableRow>
              ) : activeAllocations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-10 text-muted-foreground">
                    <UserX className="mx-auto h-8 w-8 text-muted-foreground/50 mb-3" />
                    No active allocations found.
                  </TableCell>
                </TableRow>
              ) : (
                activeAllocations.map((asset) => (
                  <TableRow key={asset.id} className="group">
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-semibold text-foreground">{asset.name}</span>
                        <span className="text-xs text-muted-foreground font-mono">{asset.tag}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium text-primary">
                      {asset.assignedTo}
                    </TableCell>
                    <TableCell>{asset.location}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleOpenAssign(asset.id)}>
                        Transfer
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleRevoke(asset)} disabled={mutating}>
                        Revoke
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}

        {/* IN TRANSIT VIEW */}
        {activeTab === "Transit" && (
          <Table>
            <TableHeader className="bg-amber-500/5">
              <TableRow>
                <TableHead>Asset Details</TableHead>
                <TableHead>Destination Employee</TableHead>
                <TableHead>Destination Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10 text-muted-foreground animate-pulse">Loading transfers...</TableCell>
                </TableRow>
              ) : transitAllocations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                    <PackageSearch className="mx-auto h-8 w-8 text-muted-foreground/50 mb-3" />
                    No assets currently in transit.
                  </TableCell>
                </TableRow>
              ) : (
                transitAllocations.map((asset) => (
                  <TableRow key={asset.id}>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-semibold text-foreground">{asset.name}</span>
                        <span className="text-xs text-muted-foreground font-mono">{asset.tag}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{asset.assignedTo}</TableCell>
                    <TableCell>{asset.location}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-amber-500 border-amber-500/50 bg-amber-500/10">
                        In Transit
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleRevoke(asset)} disabled={mutating}>
                        Cancel Transfer
                      </Button>
                      <Button 
                        variant="default" 
                        size="sm" 
                        className="bg-emerald-600 hover:bg-emerald-700 text-white"
                        onClick={() => handleAcceptTransfer(asset)} 
                        disabled={mutating}
                      >
                        <CheckCircle className="mr-1.5 h-3.5 w-3.5" /> Accept
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}

      </div>

      <Dialog 
        isOpen={isAssignModalOpen} 
        onClose={() => setIsAssignModalOpen(false)} 
        title="Asset Assignment & Transfer"
      >
        <AllocationForm 
          assets={assets}
          preselectedAssetId={selectedAssetId}
          onSubmit={handleProcessAllocation}
          isSubmitting={mutating}
        />
      </Dialog>

    </div>
  );
}
