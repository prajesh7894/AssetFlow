import { AlertCircle } from "lucide-react";
import { useState } from "react";

export default function Allocation() {
  const [assetId, setAssetId] = useState("A005 - Invalide");

  return (
    <div className="max-w-3xl">
      <h2 className="text-2xl font-semibold mb-6">Allocation & Transfer</h2>

      <div className="bg-card border border-border rounded-xl p-6">
        <form className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Asset ID</label>
            <input
              type="text"
              value={assetId}
              onChange={(e) => setAssetId(e.target.value)}
              className="w-full max-w-sm px-3 py-2 bg-background border border-destructive rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-destructive"
            />
            <p className="text-xs text-destructive">Asset ID not found in valid list</p>
          </div>

          <div className="bg-destructive/10 border border-destructive/50 text-destructive-foreground p-3 rounded-md flex items-start gap-3">
            <AlertCircle className="text-destructive h-5 w-5 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-destructive">Transfer target missing/not valid.</p>
              <p className="text-xs text-destructive/80 mt-1">Please select an employee or department to assign asset to.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">From</label>
              <select className="w-full px-3 py-2 bg-background border border-input rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary appearance-none">
                <option>New Asset</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">To</label>
              <select className="w-full px-3 py-2 bg-background border border-input rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary appearance-none">
                <option>Select Employee</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Reason</label>
            <textarea
              rows={4}
              className="w-full px-3 py-2 bg-background border border-input rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary resize-none"
              placeholder="Enter transfer reason..."
            ></textarea>
          </div>

          <button
            type="button"
            className="bg-primary/20 text-primary border border-primary/30 hover:bg-primary/30 px-6 py-2 rounded-md font-medium text-sm transition-colors"
          >
            Submit Request
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-border">
          <h3 className="text-sm font-medium mb-2">Allocation history</h3>
          <p className="text-xs text-muted-foreground">
            See allocation history for this asset. History for asset 000 will be shown below here once assigned.
          </p>
        </div>
      </div>
    </div>
  );
}
