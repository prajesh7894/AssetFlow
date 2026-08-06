import React, { useState, useRef } from "react";
import { UploadCloud, FileText, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "./button";
import { Dialog } from "./dialog";
import { toast } from "sonner";

interface CSVImportProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (data: any[]) => Promise<void>;
}

export function CSVImport({ isOpen, onClose, onImport }: CSVImportProps) {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [parsedData, setParsedData] = useState<any[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const parseCSV = (text: string) => {
    try {
      const lines = text.split(/\r?\n/).filter((line) => line.trim() !== "");
      if (lines.length < 2) {
        toast.error("CSV must contain headers and at least one row of data.");
        return;
      }

      // Basic CSV parser (splits by comma but ignores commas inside quotes)
      const splitRow = (row: string) => {
        const result = [];
        let cur = "";
        let inQuotes = false;
        for (let i = 0; i < row.length; i++) {
          const char = row[i];
          if (char === '"') {
            inQuotes = !inQuotes;
          } else if (char === "," && !inQuotes) {
            result.push(cur.trim());
            cur = "";
          } else {
            cur += char;
          }
        }
        result.push(cur.trim());
        return result.map((s) => s.replace(/^"|"$/g, "").trim());
      };

      const headers = splitRow(lines[0]).map((h) => h.toLowerCase());

      const data = [];
      for (let i = 1; i < lines.length; i++) {
        const row = splitRow(lines[i]);
        const obj: any = {};
        headers.forEach((header, index) => {
          if (header && row[index] !== undefined) {
            obj[header] = row[index];
          }
        });

        // Validation: Need at least a name
        if (obj.name) {
          data.push({
            name: obj.name,
            category: obj.category || "Hardware",
            location: obj.location || "HQ",
            status: obj.status || "Available",
            description: obj.description || "",
            value: obj.value ? parseFloat(obj.value) : 0,
            assignedTo: obj.assignedto || obj.assigned_to || null,
          });
        }
      }

      setParsedData(data);
      if (data.length === 0) {
        toast.error("Could not parse any valid assets. Ensure 'name' column exists.");
      } else {
        toast.success(`Successfully parsed ${data.length} assets ready for import.`);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to parse CSV file.");
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (selectedFile: File) => {
    if (selectedFile.type !== "text/csv" && !selectedFile.name.endsWith(".csv")) {
      toast.error("Please upload a valid CSV file.");
      return;
    }
    setFile(selectedFile);

    // Read the file
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      parseCSV(text);
    };
    reader.readAsText(selectedFile);
  };

  const reset = () => {
    setFile(null);
    setParsedData([]);
  };

  const handleImport = async () => {
    if (parsedData.length === 0) return;
    setIsProcessing(true);
    try {
      await onImport(parsedData);
      toast.success("Bulk import complete!");
      onClose();
      // Wait for dialog animation to finish before reset
      setTimeout(reset, 300);
    } catch (err) {
      console.error(err);
      toast.error("Failed to complete bulk import.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={() => {
        if (!isProcessing) {
          onClose();
          reset();
        }
      }}
      title="Bulk Import Assets"
    >
      <div className="space-y-6">
        {!file ? (
          <div
            className={`border-2 border-dashed rounded-xl p-10 text-center flex flex-col items-center justify-center transition-colors cursor-pointer ${
              dragActive ? "border-primary bg-primary/5" : "border-border hover:bg-secondary/20"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
          >
            <input
              ref={inputRef}
              type="file"
              accept=".csv"
              className="hidden"
              onChange={handleChange}
            />
            <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center mb-4">
              <UploadCloud className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-1">Click or drag CSV here</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Upload a .csv file containing your asset data.
            </p>
            <div className="text-xs text-muted-foreground text-left bg-card border border-border p-3 rounded-md w-full max-w-sm">
              <p className="font-medium mb-1">Required format:</p>
              <code className="bg-secondary px-1 py-0.5 rounded">
                name, category, status, location
              </code>
            </div>
          </div>
        ) : (
          <div className="border border-border rounded-xl p-6 bg-card flex flex-col items-center text-center">
            <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 relative">
              <FileText className="h-8 w-8 text-primary" />
              {parsedData.length > 0 && (
                <div className="absolute -bottom-1 -right-1 h-6 w-6 bg-background rounded-full flex items-center justify-center">
                  <CheckCircle2 className="h-5 w-5 text-success" />
                </div>
              )}
            </div>
            <h3 className="font-medium text-lg mb-1">{file.name}</h3>
            <p className="text-sm text-muted-foreground mb-6">
              {(file.size / 1024).toFixed(2)} KB &bull; {parsedData.length} valid rows found
            </p>

            {parsedData.length > 0 ? (
              <div className="w-full flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={reset}
                  disabled={isProcessing}
                >
                  Cancel
                </Button>
                <Button className="flex-1" onClick={handleImport} disabled={isProcessing}>
                  {isProcessing ? "Importing..." : `Import ${parsedData.length} Assets`}
                </Button>
              </div>
            ) : (
              <div className="w-full flex flex-col items-center">
                <div className="flex items-center gap-2 text-destructive mb-4 text-sm bg-destructive/10 px-3 py-2 rounded-md">
                  <AlertCircle className="h-4 w-4" />
                  Could not find any valid assets in this file.
                </div>
                <Button variant="outline" onClick={reset}>
                  Try another file
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </Dialog>
  );
}
