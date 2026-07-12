import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState, useRef } from "react";
import { Upload, X } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";

const maintenanceSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  assetId: z.string().min(1, "Asset ID is required"),
  issue: z.string().min(10, "Please provide a detailed description of the issue"),
  priority: z.enum(["Low", "Medium", "High", "Critical"]),
});

type MaintenanceFormValues = z.infer<typeof maintenanceSchema>;

interface MaintenanceFormProps {
  initialData?: any;
  onSubmit: (data: any) => void;
  isSubmitting: boolean;
}

export function MaintenanceForm({ initialData, onSubmit, isSubmitting }: MaintenanceFormProps) {
  const [imageBase64, setImageBase64] = useState<string | null>(initialData?.image || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<MaintenanceFormValues>({
    resolver: zodResolver(maintenanceSchema),
    defaultValues: {
      title: initialData?.title || "",
      assetId: initialData?.assetId || "",
      issue: initialData?.issue || "",
      priority: initialData?.priority || "Medium",
    }
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFormSubmit = (data: MaintenanceFormValues) => {
    onSubmit({ ...data, image: imageBase64 });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      {/* Image Upload Area */}
      <div className="space-y-2">
        <Label>Photo Evidence (Optional)</Label>
        <div 
          className="border-2 border-dashed border-border rounded-lg p-6 flex flex-col items-center justify-center relative hover:bg-secondary/20 transition-colors cursor-pointer min-h-[120px]"
          onClick={() => !imageBase64 && fileInputRef.current?.click()}
        >
          {imageBase64 ? (
            <div className="relative w-full flex justify-center">
              <img src={imageBase64} alt="Issue preview" className="max-h-32 rounded-md object-contain" />
              <button 
                type="button" 
                onClick={(e) => { e.stopPropagation(); setImageBase64(null); }}
                className="absolute -top-2 -right-2 bg-destructive text-white rounded-full p-1 shadow-md hover:bg-destructive/90"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <>
              <Upload className="h-6 w-6 text-muted-foreground mb-2" />
              <p className="text-xs text-muted-foreground">Click to upload photo</p>
            </>
          )}
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*" 
            onChange={handleImageUpload}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Ticket Title</Label>
        <Input {...register("title")} placeholder="e.g. Printer Jammed" />
        {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Asset Tag / ID</Label>
          <Input {...register("assetId")} placeholder="e.g. AF-0012" />
          {errors.assetId && <p className="text-xs text-destructive">{errors.assetId.message}</p>}
        </div>
        
        <div className="space-y-2">
          <Label>Priority</Label>
          <select 
            {...register("priority")}
            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Critical">Critical</option>
          </select>
          {errors.priority && <p className="text-xs text-destructive">{errors.priority.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Detailed Issue Description</Label>
        <textarea 
          {...register("issue")} 
          placeholder="Describe the problem in detail..."
          className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        />
        {errors.issue && <p className="text-xs text-destructive">{errors.issue.message}</p>}
      </div>

      <div className="pt-2 flex justify-end gap-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : initialData ? "Update Ticket" : "Submit Ticket"}
        </Button>
      </div>
    </form>
  );
}
