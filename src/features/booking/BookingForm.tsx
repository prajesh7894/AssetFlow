import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";

const bookingSchema = z.object({
  title: z.string().min(2, "Title is required"),
  resourceId: z.string().min(1, "Please select a resource"),
  date: z.string().min(1, "Date is required"),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
}).refine((data) => {
  return data.startTime < data.endTime;
}, {
  message: "End time must be after start time",
  path: ["endTime"],
});

type BookingFormValues = z.infer<typeof bookingSchema>;

interface BookingFormProps {
  resources: any[];
  existingBookings: any[];
  onSubmit: (data: any) => void;
  isSubmitting: boolean;
  initialData?: any;
}

export function BookingForm({ resources, existingBookings, onSubmit, isSubmitting, initialData }: BookingFormProps) {
  const [conflictError, setConflictError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      title: initialData?.title || "",
      resourceId: initialData?.resourceId || "",
      date: initialData?.date || new Date().toISOString().split('T')[0],
      startTime: initialData?.startTime || "09:00",
      endTime: initialData?.endTime || "10:00",
    }
  });

  const checkOverlap = (data: BookingFormValues) => {
    const relevantBookings = existingBookings.filter(
      b => b.resourceId === data.resourceId && b.date === data.date && b.status !== "Cancelled"
    );

    for (const booking of relevantBookings) {
      // Overlap logic: newStart < existingEnd && newEnd > existingStart
      if (data.startTime < booking.endTime && data.endTime > booking.startTime) {
        return `Conflict: This resource is already booked by ${booking.bookedBy} from ${booking.startTime} to ${booking.endTime}.`;
      }
    }
    return null;
  };

  const handleFormSubmit = (data: BookingFormValues) => {
    setConflictError(null);
    const conflict = checkOverlap(data);
    
    if (conflict) {
      setConflictError(conflict);
      return;
    }

    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      {conflictError && (
        <div className="bg-destructive/10 border border-destructive text-destructive p-3 rounded-md text-sm">
          {conflictError}
        </div>
      )}

      <div className="space-y-2">
        <Label>Booking Title</Label>
        <Input {...register("title")} placeholder="e.g. Quarterly Review Meeting" />
        {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
      </div>

      <div className="space-y-2">
        <Label>Resource</Label>
        <select 
          {...register("resourceId")}
          className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          <option value="">Select a resource...</option>
          {resources.map(res => (
            <option key={res.id} value={res.id} disabled={res.status === "Maintenance"}>
              {res.name} ({res.type}) {res.status === "Maintenance" && "- Under Maintenance"}
            </option>
          ))}
        </select>
        {errors.resourceId && <p className="text-xs text-destructive">{errors.resourceId.message}</p>}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Date</Label>
          <Input type="date" {...register("date")} />
          {errors.date && <p className="text-xs text-destructive">{errors.date.message}</p>}
        </div>
        
        <div className="space-y-2">
          <Label>Start Time</Label>
          <Input type="time" {...register("startTime")} />
          {errors.startTime && <p className="text-xs text-destructive">{errors.startTime.message}</p>}
        </div>

        <div className="space-y-2">
          <Label>End Time</Label>
          <Input type="time" {...register("endTime")} />
          {errors.endTime && <p className="text-xs text-destructive">{errors.endTime.message}</p>}
        </div>
      </div>
      <p className="text-xs text-muted-foreground mt-1 mb-4">Note: Adjacent bookings (e.g., 09:00-10:00 and 10:00-11:00) are allowed.</p>

      <div className="pt-2 flex justify-end gap-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Processing..." : "Confirm Booking"}
        </Button>
      </div>
    </form>
  );
}
