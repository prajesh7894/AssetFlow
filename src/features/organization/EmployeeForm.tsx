import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";

const employeeSchema = z.object({
  empId: z.string().min(2, "Employee ID is required"),
  name: z.string().min(2, "Name is required"),
  title: z.string().min(2, "Job title is required"),
  email: z.string().email("Invalid email address"),
  departmentId: z.string().min(1, "Please select a department"),
});

type EmployeeFormValues = z.infer<typeof employeeSchema>;

interface EmployeeFormProps {
  departments: any[];
  onSubmit: (data: any) => void;
  isSubmitting: boolean;
}

export function EmployeeForm({ departments, onSubmit, isSubmitting }: EmployeeFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      empId: "",
      name: "",
      title: "",
      email: "",
      departmentId: "",
    }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Employee ID</Label>
          <Input {...register("empId")} placeholder="e.g. EMP-042" />
          {errors.empId && <p className="text-xs text-destructive">{errors.empId.message}</p>}
        </div>
        
        <div className="space-y-2">
          <Label>Full Name</Label>
          <Input {...register("name")} placeholder="e.g. Sarah Connor" />
          {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Job Title</Label>
          <Input {...register("title")} placeholder="e.g. Senior Developer" />
          {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
        </div>

        <div className="space-y-2">
          <Label>Email Address</Label>
          <Input {...register("email")} type="email" placeholder="e.g. sarah@company.com" />
          {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Department Assignment</Label>
        <select 
          {...register("departmentId")}
          className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          <option value="">Select a department...</option>
          {departments.map(dept => (
            <option key={dept.id} value={dept.id}>{dept.name}</option>
          ))}
        </select>
        {errors.departmentId && <p className="text-xs text-destructive">{errors.departmentId.message}</p>}
      </div>

      <div className="pt-2 flex justify-end gap-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Onboarding..." : "Onboard Employee"}
        </Button>
      </div>
    </form>
  );
}
