import { useState } from "react";

const tabs = ["Departments", "Categories", "Roles", "Users"];

const departments = [
  { id: 1, name: "Engineering", head: "Alice W.", parent: "—", status: "Active" },
  { id: 2, name: "HR", head: "Bob M.", parent: "—", status: "Active" },
  { id: 3, name: "Design Team A", head: "Charlie D.", parent: "Design", status: "Inactive" },
];

export default function Organization() {
  const [activeTab, setActiveTab] = useState("Departments");

  return (
    <div className="max-w-5xl">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Organization Setup</h2>
        <span className="text-sm text-muted-foreground bg-secondary px-2 py-1 rounded">Admin only</span>
      </div>

      <div className="flex space-x-2 border-b border-border mb-6">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "Departments" && (
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-secondary/50 border-b border-border">
              <tr>
                <th className="px-4 py-3 font-medium">Department Name</th>
                <th className="px-4 py-3 font-medium">Head</th>
                <th className="px-4 py-3 font-medium">Parent Dept</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {departments.map((dept) => (
                <tr key={dept.id} className="hover:bg-secondary/30 transition-colors">
                  <td className="px-4 py-3 text-foreground">{dept.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{dept.head}</td>
                  <td className="px-4 py-3 text-muted-foreground">{dept.parent}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${
                        dept.status === "Active"
                          ? "bg-primary/20 text-primary border-primary/30"
                          : "bg-secondary text-muted-foreground border-border"
                      }`}
                    >
                      {dept.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="p-4 text-xs text-muted-foreground border-t border-border">
            Add a department, sub-department or select to deactivate it.
          </div>
        </div>
      )}
    </div>
  );
}
