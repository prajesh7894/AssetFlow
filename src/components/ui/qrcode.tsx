import { useRef } from "react";
import { Download } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "./button";

export function QRCodePlaceholder({ tag }: { tag: string }) {
  const svgRef = useRef<SVGSVGElement>(null);

  const handleDownload = () => {
    if (!svgRef.current) return;
    const svgNode = svgRef.current;
    const svgData = new XMLSerializer().serializeToString(svgNode);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    // Scale up for better resolution
    const scale = 4;
    const width = 128 * scale;
    const height = 128 * scale;
    canvas.width = width;
    canvas.height = height;

    const img = new Image();
    // Add white background instead of transparent
    const svgWithBg = svgData.replace("<svg", '<svg style="background-color: white;"');
    img.src = "data:image/svg+xml;base64," + btoa(svgWithBg);

    img.onload = () => {
      if (ctx) {
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        const pngFile = canvas.toDataURL("image/png");
        const downloadLink = document.createElement("a");
        downloadLink.download = `${tag}_QRCode.png`;
        downloadLink.href = `${pngFile}`;
        downloadLink.click();
      }
    };
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 border border-dashed border-border rounded-lg bg-secondary/20">
      <div className="bg-white p-2 rounded-md shadow-sm mb-3">
        <QRCodeSVG value={tag} size={128} level="M" includeMargin={false} ref={svgRef} />
      </div>
      <p className="text-xs font-mono text-muted-foreground mb-3">{tag}</p>
      <Button
        variant="outline"
        size="sm"
        className="w-full h-8 text-xs flex items-center justify-center"
        onClick={handleDownload}
        disabled={tag === "AF-XXXX"}
      >
        <Download className="mr-2 h-3 w-3" />
        Download Label
      </Button>
    </div>
  );
}
