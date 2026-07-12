import { toast } from "sonner";
import { Building2, Users, UserPlus, FolderPlus, MonitorSmartphone, Mail } from "lucide-react";
import { useState } from "react";
import { useFirestoreQuery } from "../../hooks/useFirestoreQuery";
import { useFirestoreMutation } from "../../hooks/useFirestoreMutation";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Dialog } from "../../components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { EmployeeForm } from "./EmployeeForm";
import { DepartmentForm } from "./DepartmentForm";

export default function Organization() {
  const [activeTab, setActiveTab] = useState<"Departments" | "Employees">("Departments");
  const [isDeptModalOpen, setIsDeptModalOpen] = useState(false);
  const [isEmpModalOpen, setIsEmpModalOpen] = useState(false);

  // Queries
  const { data: departments, loading: deptLoading } = useFirestoreQuery<any>("departments");
  const { data: employees, loading: empLoading } = useFirestoreQuery<any>("employees");
  const { data: assets, loading: assetsLoading } = useFirestoreQuery<any>("assets");

  // Mutations
  const { createRecord: createDept, mutating: mutatingDept } = useFirestoreMutation("departments");
  const { createRecord: createEmp, mutating: mutatingEmp } = useFirestoreMutation("employees");

  const isLoading = deptLoading || empLoading || assetsLoading;

  // Handlers
  const handleCreateDept = async (data: any) => {
    try {
      await createDept({ ...data, status: "Active" });
      setIsDeptModalOpen(false);
    } catch (err) {
      console.error(err);
      toast("Failed to create department");
    }
  };

  const handleCreateEmp = async (data: any) => {
    try {
      await createEmp({ ...data, status: "Active" });
      setIsEmpModalOpen(false);
      setActiveTab("Employees");
    } catch (err) {
      console.error(err);
      toast("Failed to create employee");
    }
  };

  // Helper functions
  const getDeptEmployees = (deptId: string) => employees.filter(e => e.departmentId === deptId);
  
  const getDeptAssets = (deptId: string) => {
    const deptEmployeeNames = getDeptEmployees(deptId).map(e => e.name);
    // Find assets assigned to anyone in this department
    return assets.filter(a => a.status === "Allocated" && deptEmployeeNames.includes(a.assignedTo));
  };

  const getDeptHeadName = (headId: string) => {
    if (!headId) return "No Head Assigned";
    const head = employees.find(e => e.empId === headId);
    return head ? head.name : headId;
  };

  const getDeptName = (deptId: string) => {
    const dept = departments.find(d => d.id === deptId);
    return dept ? dept.name : "Unknown Dept";
  };

  return (
    <div className="max-w-7xl flex flex-col h-full animate-in fade-in duration-500 pb-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-semibold">Organization Setup</h2>
          <p className="text-sm text-muted-foreground mt-1">Manage personnel, departments, and structure.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={() => setIsDeptModalOpen(true)}>
            <FolderPlus className="mr-2 h-4 w-4" /> New Department
          </Button>
          <Button onClick={() => setIsEmpModalOpen(true)}>
            <UserPlus className="mr-2 h-4 w-4" /> Onboard Employee
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-border">
        <button
          onClick={() => setActiveTab("Departments")}
          className={`pb-3 text-sm font-medium transition-colors relative flex items-center gap-2 ${
            activeTab === "Departments" ? "text-primary" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Building2 className="h-4 w-4" /> Departments
          {activeTab === "Departments" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full" />}
        </button>
        <button
          onClick={() => setActiveTab("Employees")}
          className={`pb-3 text-sm font-medium transition-colors relative flex items-center gap-2 ${
            activeTab === "Employees" ? "text-primary" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Users className="h-4 w-4" /> Employee Directory
          {activeTab === "Employees" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full" />}
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center p-20 animate-pulse text-muted-foreground">
          Loading organization data...
        </div>
      ) : (
        <div className="flex-1">
          {/* DEPARTMENTS VIEW */}
          {activeTab === "Departments" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {departments.map(dept => {
                const deptEmps = getDeptEmployees(dept.id);
                const deptAssets = getDeptAssets(dept.id);
                const headName = getDeptHeadName(dept.headId);

                return (
                  <div key={dept.id} className="bg-card border border-border rounded-xl p-5 shadow-sm hover:shadow-md transition-all group">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg text-primary">
                          <Building2 className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg leading-none">{dept.name}</h3>
                          <p className="text-xs text-muted-foreground mt-1">Head: {headName}</p>
                        </div>
                      </div>
                      <Badge variant={dept.status === "Active" ? "success" : "secondary"} className="text-[10px]">
                        {dept.status}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-border/50">
                      <div>
                        <div className="flex items-center text-xs text-muted-foreground mb-1">
                          <Users className="h-3 w-3 mr-1" /> Headcount
                        </div>
                        <p className="text-lg font-medium">{deptEmps.length}</p>
                      </div>
                      <div>
                        <div className="flex items-center text-xs text-muted-foreground mb-1">
                          <MonitorSmartphone className="h-3 w-3 mr-1" /> Deployed Assets
                        </div>
                        <p className="text-lg font-medium">{deptAssets.length}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
              {departments.length === 0 && (
                <div className="col-span-3 text-center p-10 text-muted-foreground border border-dashed rounded-xl">
                  No departments configured.
                </div>
              )}
            </div>
          )}

          {/* EMPLOYEES VIEW */}
          {activeTab === "Employees" && (
            <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
              <Table>
                <TableHeader className="bg-secondary/20">
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Job Title</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Assets Held</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {employees.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">No employees found.</TableCell>
                    </TableRow>
                  ) : (
                    employees.map(emp => {
                      const deptName = getDeptName(emp.departmentId);
                      const heldAssets = assets.filter(a => a.status === "Allocated" && a.assignedTo === emp.name);

                      return (
                        <TableRow key={emp.id} className="group hover:bg-secondary/10">
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-xs">
                                {emp.name.substring(0, 2).toUpperCase()}
                              </div>
                              <div className="flex flex-col">
                                <span className="font-semibold text-foreground">{emp.name}</span>
                                <span className="text-xs text-muted-foreground font-mono flex items-center gap-1">
                                  {emp.empId}
                                </span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span>{emp.title}</span>
                              <span className="text-[10px] text-muted-foreground flex items-center mt-0.5"><Mail className="h-3 w-3 mr-1" />{emp.email}</span>
                            </div>
                          </TableCell>
                          <TableCell className="font-medium text-primary/80">{deptName}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="font-mono">{heldAssets.length}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={emp.status === "Active" ? "success" : "secondary"}>
                              {emp.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      <Dialog isOpen={isDeptModalOpen} onClose={() => setIsDeptModalOpen(false)} title="Create Department">
        <DepartmentForm employees={employees} onSubmit={handleCreateDept} isSubmitting={mutatingDept} />
      </Dialog>

      <Dialog isOpen={isEmpModalOpen} onClose={() => setIsEmpModalOpen(false)} title="Onboard Employee">
        <EmployeeForm departments={departments} onSubmit={handleCreateEmp} isSubmitting={mutatingEmp} />
      </Dialog>
      
    </div>
  );
}
