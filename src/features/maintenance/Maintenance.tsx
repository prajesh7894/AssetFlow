export default function Maintenance() {
  return (
    <div className="max-w-7xl h-full flex flex-col">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Maintenance Management</h2>
        <span className="text-sm text-muted-foreground bg-secondary px-2 py-1 rounded">Manage/track repairs and routine checks</span>
      </div>

      <div className="flex-1 overflow-x-auto">
        <div className="flex gap-6 min-w-max h-full pb-4">
          
          {/* Pending */}
          <div className="w-80 flex flex-col bg-card border border-border rounded-xl overflow-hidden">
            <div className="p-4 border-b border-border bg-secondary/30">
              <h3 className="font-medium text-sm">Pending</h3>
            </div>
            <div className="p-3 flex-1 space-y-3">
              <div className="bg-background border border-border p-3 rounded-lg shadow-sm">
                <p className="text-sm font-medium">AF-B4003 Projector 400x</p>
                <p className="text-xs text-muted-foreground mt-1">bulb warning msg</p>
              </div>
            </div>
          </div>

          {/* Approved */}
          <div className="w-80 flex flex-col bg-card border border-border rounded-xl overflow-hidden">
            <div className="p-4 border-b border-border bg-secondary/30">
              <h3 className="font-medium text-sm">Approved</h3>
            </div>
            <div className="p-3 flex-1 space-y-3">
              <div className="bg-background border border-border p-3 rounded-lg shadow-sm">
                <p className="text-sm font-medium">12 Chairs</p>
                <p className="text-xs text-muted-foreground mt-1">assembly request</p>
              </div>
            </div>
          </div>

          {/* In progress */}
          <div className="w-80 flex flex-col bg-card border border-border rounded-xl overflow-hidden">
            <div className="p-4 border-b border-border bg-secondary/30">
              <h3 className="font-medium text-sm">In progress</h3>
            </div>
            <div className="p-3 flex-1 space-y-3">
              <div className="bg-background border border-border p-3 rounded-lg shadow-sm">
                <p className="text-sm font-medium">Cabinet #804</p>
                <p className="text-xs text-muted-foreground mt-1">handle ordered</p>
              </div>
            </div>
          </div>

          {/* In transit */}
          <div className="w-80 flex flex-col bg-card border border-border rounded-xl overflow-hidden">
            <div className="p-4 border-b border-border bg-secondary/30">
              <h3 className="font-medium text-sm">In transit</h3>
            </div>
            <div className="p-3 flex-1 space-y-3">
              <div className="bg-primary/10 border border-primary/30 p-3 rounded-lg shadow-sm">
                <p className="text-sm font-medium text-primary">Server X002</p>
                <p className="text-xs text-primary/80 mt-1">heading to IT</p>
              </div>
            </div>
          </div>

        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-border">
        <p className="text-xs text-muted-foreground text-center">Drag & drop asset cards. Maintenance record linked to item log automatically on resolution.</p>
      </div>
    </div>
  );
}
