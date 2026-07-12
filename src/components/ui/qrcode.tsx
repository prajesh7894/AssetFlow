import { QrCode } from "lucide-react";

export function QRCodePlaceholder({ tag }: { tag: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-4 border border-dashed border-border rounded-lg bg-secondary/20">
      <div className="bg-white p-2 rounded-md shadow-sm mb-2">
        <QrCode className="h-16 w-16 text-black" strokeWidth={1.5} />
      </div>
      <p className="text-xs font-mono text-muted-foreground">{tag}</p>
    </div>
  );
}
