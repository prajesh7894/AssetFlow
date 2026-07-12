import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";

const departmentSchema = z.object({
  name: z.string().min(2, "Department name is required"),
  headId: z.string().optional(),
});

type DepartmentFormValues = z.infer<typeof departmentSchema>;

interface DepartmentFormProps {
  employees: any[];
  onSubmit: (data: any) => void;
  isSubmitting: boolean;
}

export function DepartmentForm({ employees, onSubmit, isSubmitting }: DepartmentFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<DepartmentFormValues>({
    resolver: zodResolver(departmentSchema),
    defaultValues: {
      name: "",
      headId: "",
    }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label>Department Name</Label>
        <Input {...register("name")} placeholder="e.g. Quality Assurance" />
        {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
      </div>

      <div className="space-y-2">
        <Label>Department Head (Optional)</Label>
        <select 
          {...register("headId")}
          className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          <option value="">Select an employee...</option>
          {employees.map(emp => (
            <option key={emp.id} value={emp.empId}>{emp.name} ({emp.title})</option>
          ))}
        </select>
        {errors.headId && <p className="text-xs text-destructive">{errors.headId.message}</p>}
      </div>

      <div className="pt-2 flex justify-end gap-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Department"}
        </Button>
      </div>
    </form>
  );
}
