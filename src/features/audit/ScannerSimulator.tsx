import { useState } from "react";
import { ScanBarcode, AlertTriangle, CheckCircle, Search } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";

interface ScannerSimulatorProps {
  assets: any[];
  onLogAudit: (data: { assetTag: string, expectedLocation: string, scannedLocation: string, status: "Match" | "Mismatch" | "Missing" }) => void;
  isSubmitting: boolean;
}

export function ScannerSimulator({ assets, onLogAudit, isSubmitting }: ScannerSimulatorProps) {
  const [assetTag, setAssetTag] = useState("");
  const [scannedLocation, setScannedLocation] = useState("");
  
  const [scanResult, setScanResult] = useState<{ asset: any, status: "Match" | "Mismatch" | "Not Found" } | null>(null);

  const handleScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assetTag || !scannedLocation) return;

    const foundAsset = assets.find(a => a.tag.toUpperCase() === assetTag.toUpperCase());

    if (!foundAsset) {
      setScanResult({ asset: null, status: "Not Found" });
      return;
    }

    const isMatch = foundAsset.location.toLowerCase().trim() === scannedLocation.toLowerCase().trim();
    
    setScanResult({
      asset: foundAsset,
      status: isMatch ? "Match" : "Mismatch"
    });
  };

  const handleCommitLog = () => {
    if (!scanResult || scanResult.status === "Not Found") return;

    onLogAudit({
      assetTag: scanResult.asset.tag,
      expectedLocation: scanResult.asset.location,
      scannedLocation,
      status: scanResult.status
    });
    
    // Reset scanner for next item
    setAssetTag("");
    setScanResult(null);
  };

  return (
    <div className="space-y-6">
      <div className="bg-secondary/20 p-4 rounded-xl border border-border flex items-start gap-4">
        <div className="bg-primary/20 p-2 rounded-lg shrink-0">
          <ScanBarcode className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h4 className="font-semibold text-sm">Scanner Simulator</h4>
          <p className="text-xs text-muted-foreground mt-1">
            In a real environment, this connects to a hardware Bluetooth RFID or Barcode scanner. 
            For the demo, manually enter the Asset Tag and the location you are physically standing in.
          </p>
        </div>
      </div>

      <form onSubmit={handleScan} className="space-y-4">
        <div className="space-y-2">
          <Label>Your Physical Location (Auditor Location)</Label>
          <Input 
            required
            value={scannedLocation} 
            onChange={e => setScannedLocation(e.target.value)} 
            placeholder="e.g. NY Office Floor 3" 
            className="font-medium"
          />
        </div>

        <div className="space-y-2">
          <Label>Scan Asset Tag (Barcode)</Label>
          <div className="flex gap-2">
            <Input 
              required
              value={assetTag} 
              onChange={e => {
                setAssetTag(e.target.value);
                setScanResult(null);
              }} 
              placeholder="e.g. AF-0001" 
              className="uppercase font-mono tracking-wider"
            />
            <Button type="submit" variant="secondary">
              <Search className="h-4 w-4 mr-2" /> Verify
            </Button>
          </div>
        </div>
      </form>

      {/* Result UI */}
      {scanResult && (
        <div className={`p-4 rounded-xl border ${
          scanResult.status === "Match" ? "bg-emerald-500/10 border-emerald-500/50" :
          scanResult.status === "Mismatch" ? "bg-amber-500/10 border-amber-500/50" :
          "bg-destructive/10 border-destructive/50"
        } animate-in fade-in zoom-in-95 duration-200`}>
          
          {scanResult.status === "Not Found" ? (
            <div className="flex items-center text-destructive">
              <AlertTriangle className="h-5 w-5 mr-2" />
              <span className="font-semibold text-sm">Asset Not Found in Database.</span>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="font-semibold text-sm text-foreground">{scanResult.asset.name}</span>
                  <span className="text-xs text-muted-foreground font-mono">{scanResult.asset.tag}</span>
                </div>
                
                {scanResult.status === "Match" ? (
                  <span className="flex items-center text-emerald-500 font-bold text-sm">
                    <CheckCircle className="h-4 w-4 mr-1" /> Verified
                  </span>
                ) : (
                  <span className="flex items-center text-amber-500 font-bold text-sm">
                    <AlertTriangle className="h-4 w-4 mr-1" /> Mismatch
                  </span>
                )}
              </div>

              <div className="text-xs bg-background/50 p-2 rounded border border-border/50 grid grid-cols-2 gap-4">
                <div>
                  <span className="text-muted-foreground block mb-0.5">Expected Location:</span>
                  <span className={`font-medium ${scanResult.status === "Mismatch" ? "line-through opacity-70" : ""}`}>
                    {scanResult.asset.location}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block mb-0.5">Scanned At:</span>
                  <span className="font-medium">{scannedLocation}</span>
                </div>
              </div>

              <Button 
                className="w-full mt-2" 
                variant={scanResult.status === "Match" ? "default" : "secondary"}
                onClick={handleCommitLog}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Logging..." : "Log Audit Record"}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
