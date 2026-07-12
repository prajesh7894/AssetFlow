import { toast } from "sonner";
import { ShieldCheck, ScanBarcode, CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import { useState } from "react";
import { useFirestoreQuery } from "../../hooks/useFirestoreQuery";
import { useFirestoreMutation } from "../../hooks/useFirestoreMutation";
import { useAuth } from "../../context/AuthContext";
import { ScannerSimulator } from "./ScannerSimulator";
import { Dialog } from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";

export default function Audit() {
  const { user } = useAuth();
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [selectedLog, setSelectedLog] = useState<any>(null);
  const [isResolveModalOpen, setIsResolveModalOpen] = useState(false);

  // Queries
  const { data: assets, loading: assetsLoading } = useFirestoreQuery<any>("assets");
  const { data: auditLogs, loading: logsLoading } = useFirestoreQuery<any>("auditLogs");

  // Mutations
  const { createRecord: createAuditLog, loading: mutatingAudit } = useFirestoreMutation("auditLogs");
  const { updateRecord: updateAsset } = useFirestoreMutation("assets");
  const { updateRecord: updateLog } = useFirestoreMutation("auditLogs");

  // Handlers
  const handleLogAudit = async (data: any) => {
    try {
      await createAuditLog({ 
        ...data, 
        timestamp: new Date().toISOString(),
        auditor: user?.displayName || user?.email || "Admin",
      });
      toast.success(`Audit logged successfully: ${data.status}`);
      setIsScannerOpen(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to log audit.");
    }
  };

  const handleResolveDiscrepancy = async (action: "Update Location" | "Mark Missing") => {
    if (!selectedLog) return;
    
    try {
      const assetToUpdate = assets.find((a: any) => a.tag === selectedLog.assetTag);
      if (assetToUpdate) {
        
        if (action === "Update Location") {
          // Update the asset's location to where it was actually scanned
          await updateAsset(assetToUpdate.id, {
            location: selectedLog.scannedLocation,
            history: [...(assetToUpdate.history || []), { date: new Date().toISOString(), action: `Audit resolution: Location updated to ${selectedLog.scannedLocation}` }]
          });
        } else if (action === "Mark Missing") {
          // Mark asset as missing
          await updateAsset(assetToUpdate.id, {
            status: "Missing",
            history: [...(assetToUpdate.history || []), { date: new Date().toISOString(), action: `Audit resolution: Marked as Missing` }]
          });
        }
      }

      // Update the audit log status to Resolved
      await updateLog(selectedLog.id, { status: "Resolved" });

      setIsResolveModalOpen(false);
      setSelectedLog(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to resolve discrepancy.");
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case "Match": return <CheckCircle2 className="h-4 w-4 text-emerald-500 mr-2" />;
      case "Mismatch": return <AlertTriangle className="h-4 w-4 text-amber-500 mr-2" />;
      case "Missing": return <XCircle className="h-4 w-4 text-destructive mr-2" />;
      case "Resolved": return <ShieldCheck className="h-4 w-4 text-primary mr-2" />;
      default: return null;
    }
  };

  return (
    <div className="max-w-7xl flex flex-col h-full animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-semibold">Audit & Verification</h2>
          <p className="text-sm text-muted-foreground mt-1">Physical inventory reconciliation and compliance tracking.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => setIsScannerOpen(true)}>
            <ScanBarcode className="mr-2 h-4 w-4" />
            Scanner Simulator
          </Button>
          <Button>
            <ShieldCheck className="mr-2 h-4 w-4" />
            Export Compliance Report
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
          <p className="text-sm text-muted-foreground mb-1">Total Scans</p>
          <p className="text-2xl font-bold">{auditLogs.length}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
          <p className="text-sm text-muted-foreground mb-1">Verified Matches</p>
          <p className="text-2xl font-bold text-emerald-500">
            {auditLogs.filter((a: any) => a.status === "Match" || a.status === "Resolved").length}
          </p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
          <p className="text-sm text-muted-foreground mb-1">Discrepancies</p>
          <p className="text-2xl font-bold text-amber-500">
            {auditLogs.filter((a: any) => a.status === "Mismatch").length}
          </p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
          <p className="text-sm text-muted-foreground mb-1">Missing Assets</p>
          <p className="text-2xl font-bold text-destructive">
            {auditLogs.filter((a: any) => a.status === "Missing").length}
          </p>
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden flex-1">
        <Table>
          <TableHeader className="bg-secondary/20">
            <TableRow>
              <TableHead>Asset Tag</TableHead>
              <TableHead>Expected Location</TableHead>
              <TableHead>Scanned Location</TableHead>
              <TableHead>Auditor</TableHead>
              <TableHead>Timestamp</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logsLoading || assetsLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10 text-muted-foreground animate-pulse">Loading audit logs...</TableCell>
              </TableRow>
            ) : auditLogs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">No audits recorded yet.</TableCell>
              </TableRow>
            ) : (
              // Sort by newest first
              [...auditLogs].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).map((log: any) => (
                <TableRow key={log.id} className="group">
                  <TableCell className="font-medium font-mono">{log.assetTag}</TableCell>
                  <TableCell>{log.expectedLocation}</TableCell>
                  <TableCell className={log.expectedLocation !== log.scannedLocation ? "text-amber-500 font-medium" : ""}>
                    {log.scannedLocation}
                  </TableCell>
                  <TableCell>{log.auditor}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{new Date(log.timestamp).toLocaleString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {getStatusIcon(log.status)}
                      <span className="font-medium text-sm">{log.status}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    {log.status === "Mismatch" || log.status === "Missing" ? (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="border-amber-500/50 text-amber-500 hover:bg-amber-500/10"
                        onClick={() => { setSelectedLog(log); setIsResolveModalOpen(true); }}
                      >
                        Resolve
                      </Button>
                    ) : (
                      <span className="text-xs text-muted-foreground/50 italic px-4">Locked</span>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Modals */}
      <Dialog isOpen={isScannerOpen} onClose={() => setIsScannerOpen(false)} title="Continuous Audit Scanner">
        <ScannerSimulator 
          assets={assets} 
          onLogAudit={handleLogAudit}
          isSubmitting={mutatingAudit} 
        />
      </Dialog>

      <Dialog isOpen={isResolveModalOpen} onClose={() => setIsResolveModalOpen(false)} title="Resolve Discrepancy">
        {selectedLog && (
          <div className="space-y-6">
            <div className="bg-amber-500/10 border border-amber-500/50 p-4 rounded-xl text-amber-600">
              <h4 className="font-semibold flex items-center mb-2">
                <AlertTriangle className="h-5 w-5 mr-2" />
                Location Mismatch Detected
              </h4>
              <p className="text-sm opacity-90">
                Asset <span className="font-mono font-bold">{selectedLog.assetTag}</span> was expected in <b>{selectedLog.expectedLocation}</b> but was physically scanned in <b>{selectedLog.scannedLocation}</b>.
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-foreground">How would you like to resolve this?</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div 
                  className="border border-border rounded-xl p-4 hover:border-primary/50 hover:bg-primary/5 cursor-pointer transition-all"
                  onClick={() => handleResolveDiscrepancy("Update Location")}
                >
                  <h5 className="font-semibold text-primary mb-1">Update Asset Location</h5>
                  <p className="text-xs text-muted-foreground">
                    Accept the scanned location as the new truth. This updates the asset registry permanently.
                  </p>
                </div>

                <div 
                  className="border border-border rounded-xl p-4 hover:border-destructive/50 hover:bg-destructive/5 cursor-pointer transition-all"
                  onClick={() => handleResolveDiscrepancy("Mark Missing")}
                >
                  <h5 className="font-semibold text-destructive mb-1">Mark Asset as Missing</h5>
                  <p className="text-xs text-muted-foreground">
                    Flag this asset for investigation. It will be marked as 'Missing' in the database.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
}
