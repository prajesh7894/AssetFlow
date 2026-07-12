import { toast } from "sonner";
import { Wrench, Plus, MessageSquare, Clock, AlertCircle } from "lucide-react";
import { useState } from "react";
import { useFirestoreQuery } from "../../hooks/useFirestoreQuery";
import { useFirestoreMutation } from "../../hooks/useFirestoreMutation";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Dialog } from "../../components/ui/dialog";
import { MaintenanceForm } from "./MaintenanceForm";

const KANBAN_COLUMNS = [
  "Pending",
  "Approved",
  "Technician Assigned",
  "In Progress",
  "Resolved",
  "Rejected"
];

export default function Maintenance() {
  const { data: tickets, loading } = useFirestoreQuery<any>("maintenance");
  const { createRecord, updateRecord, mutating } = useFirestoreMutation("maintenance");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // --- Handlers ---
  const handleCreateSubmit = async (formData: any) => {
    try {
      await createRecord({
        ...formData,
        status: "Pending",
        reportedAt: new Date().toISOString(),
        history: [{ date: new Date().toISOString(), action: "Ticket Created" }]
      });
      setIsFormOpen(false);
    } catch (err) {
      console.error(err);
      toast("Failed to submit ticket.");
    }
  };

  const handleUpdateStatus = async (ticket: any, newStatus: string) => {
    try {
      await updateRecord(ticket.id, {
        status: newStatus,
        history: [...(ticket.history || []), { date: new Date().toISOString(), action: `Moved to ${newStatus}` }]
      });
      setIsDetailOpen(false);
    } catch (err) {
      console.error(err);
      toast("Failed to update status.");
    }
  };

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case "Critical": return "bg-destructive text-destructive-foreground border-destructive";
      case "High": return "bg-orange-500/20 text-orange-500 border-orange-500/50";
      case "Medium": return "bg-blue-500/20 text-blue-500 border-blue-500/50";
      case "Low": return "bg-secondary text-muted-foreground border-border";
      default: return "bg-secondary text-foreground";
    }
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-shrink-0">
        <div>
          <h2 className="text-2xl font-semibold">Maintenance Board</h2>
          <p className="text-sm text-muted-foreground mt-1">Kanban workflow for repair tracking.</p>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Ticket
        </Button>
      </div>

      {/* Kanban Board Area */}
      <div className="flex-1 overflow-x-auto pb-4">
        <div className="flex gap-4 min-w-max h-full">
          
          {loading ? (
            <div className="flex items-center justify-center w-full h-64 text-muted-foreground animate-pulse">
              Loading board...
            </div>
          ) : (
            KANBAN_COLUMNS.map((column) => {
              const colTickets = tickets.filter(t => t.status === column);
              
              return (
                <div key={column} className="w-80 flex flex-col bg-secondary/10 border border-border/50 rounded-xl overflow-hidden h-full">
                  {/* Column Header */}
                  <div className="p-3 border-b border-border/50 bg-secondary/30 flex items-center justify-between">
                    <h3 className="font-semibold text-sm text-foreground">{column}</h3>
                    <Badge variant="outline" className="text-xs">{colTickets.length}</Badge>
                  </div>

                  {/* Column Body */}
                  <div className="flex-1 overflow-y-auto p-3 space-y-3">
                    {colTickets.map(ticket => (
                      <div 
                        key={ticket.id} 
                        className="bg-card border border-border rounded-lg p-3 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer group"
                        onClick={() => { setSelectedTicket(ticket); setIsDetailOpen(true); }}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-xs font-mono text-muted-foreground bg-secondary px-1.5 py-0.5 rounded">{ticket.assetId}</span>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded border ${getPriorityColor(ticket.priority)}`}>
                            {ticket.priority}
                          </span>
                        </div>
                        <h4 className="font-medium text-sm text-foreground mb-1 line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                          {ticket.title}
                        </h4>
                        
                        {ticket.image && (
                          <div className="mt-2 mb-2 w-full h-16 bg-secondary/50 rounded-md overflow-hidden">
                            <img src={ticket.image} alt="Ticket" className="w-full h-full object-cover opacity-80" />
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {new Date(ticket.reportedAt).toLocaleDateString()}
                          </div>
                          {ticket.technician && (
                            <div className="flex items-center gap-1">
                              <Wrench className="h-3 w-3" />
                              <span className="truncate max-w-[80px]">{ticket.technician}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    
                    {colTickets.length === 0 && (
                      <div className="h-20 border-2 border-dashed border-border/50 rounded-lg flex items-center justify-center text-xs text-muted-foreground/50">
                        Drop zone
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* New Ticket Modal */}
      <Dialog isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title="Submit Maintenance Ticket">
        <MaintenanceForm onSubmit={handleCreateSubmit} isSubmitting={mutating} />
      </Dialog>

      {/* Ticket Details Modal */}
      <Dialog isOpen={isDetailOpen} onClose={() => setIsDetailOpen(false)} title={`Ticket: ${selectedTicket?.title}`}>
        {selectedTicket && (
          <div className="flex flex-col md:flex-row gap-6">
            
            {/* Left: Info */}
            <div className="flex-1 space-y-4">
              <div className="flex items-center gap-2">
                <span className="bg-secondary text-muted-foreground px-2 py-1 rounded-md text-xs font-mono">{selectedTicket.assetId}</span>
                <span className={`text-xs px-2 py-1 rounded border ${getPriorityColor(selectedTicket.priority)}`}>{selectedTicket.priority} Priority</span>
                <span className="bg-primary/20 text-primary border border-primary/50 px-2 py-1 rounded text-xs">{selectedTicket.status}</span>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">Issue Description</h4>
                <div className="bg-secondary/30 p-3 rounded-md border border-border text-sm text-foreground whitespace-pre-wrap">
                  {selectedTicket.issue}
                </div>
              </div>

              {selectedTicket.image && (
                <div>
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">Photo Evidence</h4>
                  <img src={selectedTicket.image} alt="Evidence" className="rounded-md border border-border max-h-48 object-contain bg-secondary/20" />
                </div>
              )}

              {/* Status Actions */}
              <div className="pt-4 border-t border-border">
                <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Move to Column</h4>
                <div className="flex flex-wrap gap-2">
                  {KANBAN_COLUMNS.filter(c => c !== selectedTicket.status).map(col => (
                    <Button 
                      key={col} 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleUpdateStatus(selectedTicket, col)}
                      disabled={mutating}
                    >
                      {col}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: History Timeline */}
            <div className="w-full md:w-56 border-t md:border-t-0 md:border-l border-border pt-4 md:pt-0 md:pl-6 flex flex-col">
              <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2 mb-4">
                <AlertCircle className="h-4 w-4" /> Timeline
              </h4>
              <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                {selectedTicket.history?.map((h: any, i: number) => (
                  <div key={i} className="relative pl-4 border-l-2 border-primary/30">
                    <div className="absolute w-2 h-2 rounded-full bg-primary -left-[5px] top-1.5" />
                    <p className="text-[10px] text-muted-foreground font-mono">{new Date(h.date).toLocaleString()}</p>
                    <p className="text-sm font-medium text-foreground mt-0.5">{h.action}</p>
                  </div>
                )).reverse()}
              </div>
            </div>

          </div>
        )}
      </Dialog>
    </div>
  );
}
