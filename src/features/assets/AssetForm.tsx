import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState, useRef } from "react";
import { Upload, X } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";

const assetSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  category: z.string().min(2, "Category is required"),
  location: z.string().min(2, "Location is required"),
  status: z.enum(["Available", "Allocated", "Maintenance", "In Transit"]),
});

type AssetFormValues = z.infer<typeof assetSchema>;

interface AssetFormProps {
  initialData?: any;
  onSubmit: (data: any) => void;
  isSubmitting: boolean;
}

export function AssetForm({ initialData, onSubmit, isSubmitting }: AssetFormProps) {
  const [imageBase64, setImageBase64] = useState<string | null>(initialData?.image || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<AssetFormValues>({
    resolver: zodResolver(assetSchema),
    defaultValues: {
      name: initialData?.name || "",
      category: initialData?.category || "",
      location: initialData?.location || "",
      status: initialData?.status || "Available",
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

  const handleFormSubmit = (data: AssetFormValues) => {
    onSubmit({ ...data, image: imageBase64 });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      {/* Image Upload Area */}
      <div className="space-y-2">
        <Label>Asset Image</Label>
        <div 
          className="border-2 border-dashed border-border rounded-lg p-6 flex flex-col items-center justify-center relative hover:bg-secondary/20 transition-colors cursor-pointer"
          onClick={() => !imageBase64 && fileInputRef.current?.click()}
        >
          {imageBase64 ? (
            <div className="relative w-full flex justify-center">
              <img src={imageBase64} alt="Asset preview" className="max-h-40 rounded-md object-contain" />
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
              <Upload className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">Click to upload image</p>
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

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Asset Name</Label>
          <Input {...register("name")} placeholder="e.g. MacBook Pro M3" />
          {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
        </div>
        
        <div className="space-y-2">
          <Label>Category</Label>
          <select 
            {...register("category")}
            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="">Select category...</option>
            <option value="Hardware">Hardware</option>
            <option value="Software">Software</option>
            <option value="Furniture">Furniture</option>
            <option value="Vehicles">Vehicles</option>
          </select>
          {errors.category && <p className="text-xs text-destructive">{errors.category.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Location</Label>
          <Input {...register("location")} placeholder="e.g. NY Floor 2" />
          {errors.location && <p className="text-xs text-destructive">{errors.location.message}</p>}
        </div>
        
        <div className="space-y-2">
          <Label>Status</Label>
          <select 
            {...register("status")}
            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="Available">Available</option>
            <option value="Allocated">Allocated</option>
            <option value="Maintenance">Maintenance</option>
            <option value="In Transit">In Transit</option>
          </select>
          {errors.status && <p className="text-xs text-destructive">{errors.status.message}</p>}
        </div>
      </div>

      <div className="pt-4 flex justify-end gap-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : initialData ? "Update Asset" : "Register Asset"}
        </Button>
      </div>
    </form>
  );
}
