import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";

const allocationSchema = z.object({
  assetId: z.string().min(1, "Please select an asset"),
  assignedTo: z.string().min(2, "Employee name or ID is required"),
  location: z.string().min(2, "Destination location is required"),
  transferType: z.enum(["Direct Assign", "Ship / Transit"]),
});

type AllocationFormValues = z.infer<typeof allocationSchema>;

interface AllocationFormProps {
  assets: any[];
  onSubmit: (data: any) => void;
  isSubmitting: boolean;
  preselectedAssetId?: string;
}

export function AllocationForm({ assets, onSubmit, isSubmitting, preselectedAssetId }: AllocationFormProps) {
  // Only allow assigning/transferring assets that are Available or already Allocated (to transfer them)
  const eligibleAssets = assets.filter(a => a.status === "Available" || a.status === "Allocated");

  const { register, handleSubmit, watch, formState: { errors } } = useForm<AllocationFormValues>({
    resolver: zodResolver(allocationSchema),
    defaultValues: {
      assetId: preselectedAssetId || "",
      assignedTo: "",
      location: "",
      transferType: "Direct Assign",
    }
  });

  const selectedAssetId = watch("assetId");
  const selectedAsset = assets.find(a => a.id === selectedAssetId);

  const handleFormSubmit = (data: AllocationFormValues) => {
    onSubmit({
      ...data,
      // If shipping, it goes into "In Transit", else it is instantly "Allocated"
      status: data.transferType === "Ship / Transit" ? "In Transit" : "Allocated"
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label>Select Asset</Label>
        <select 
          {...register("assetId")}
          disabled={!!preselectedAssetId}
          className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50"
        >
          <option value="">Choose an eligible asset...</option>
          {eligibleAssets.map(asset => (
            <option key={asset.id} value={asset.id}>
              {asset.tag} - {asset.name} ({asset.status})
            </option>
          ))}
        </select>
        {errors.assetId && <p className="text-xs text-destructive">{errors.assetId.message}</p>}
      </div>

      {selectedAsset && (
        <div className="bg-secondary/30 p-3 rounded-md border border-border text-xs mb-4">
          <span className="font-semibold text-muted-foreground uppercase">Current State:</span>
          <p className="mt-1 text-foreground">
            {selectedAsset.status === "Allocated" 
              ? `Currently assigned to ${selectedAsset.assignedTo} at ${selectedAsset.location}` 
              : `Currently available at ${selectedAsset.location}`
            }
          </p>
        </div>
      )}

      <div className="space-y-2">
        <Label>Assign To (Employee / Dept)</Label>
        <Input {...register("assignedTo")} placeholder="e.g. John Doe or HR Dept" />
        {errors.assignedTo && <p className="text-xs text-destructive">{errors.assignedTo.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Destination Location</Label>
          <Input {...register("location")} placeholder="e.g. NY Office Floor 3" />
          {errors.location && <p className="text-xs text-destructive">{errors.location.message}</p>}
        </div>
        
        <div className="space-y-2">
          <Label>Transfer Method</Label>
          <select 
            {...register("transferType")}
            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="Direct Assign">Direct Assign (Instant)</option>
            <option value="Ship / Transit">Ship / Transit (Requires Acceptance)</option>
          </select>
          {errors.transferType && <p className="text-xs text-destructive">{errors.transferType.message}</p>}
        </div>
      </div>

      <div className="pt-4 flex justify-end gap-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Processing..." : "Process Allocation"}
        </Button>
      </div>
    </form>
  );
}
