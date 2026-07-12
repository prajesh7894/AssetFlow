import { writeBatch, doc } from "firebase/firestore";
import { db, isDemoMode } from "./firebase";

export const seedDatabase = async () => {
  // Departments
  const departments = [
    { id: "dept-1", name: "Engineering", headId: "user-1", parentId: null, status: "Active" },
    { id: "dept-2", name: "HR", headId: "user-2", parentId: null, status: "Active" },
    { id: "dept-3", name: "Design Team A", headId: "user-3", parentId: "dept-1", status: "Inactive" },
  ];

  // Assets
  const assets = [
    { id: "asset-1", tag: "#A1002", name: "Dell Laptop", category: "Hardware", status: "Allocated", location: "London", assignedTo: "user-1" },
    { id: "asset-2", tag: "#B4003", name: "Projector 400x", category: "Hardware", status: "Maintenance", location: "NY Floor 2", assignedTo: null },
    { id: "asset-3", tag: "#C8004", name: "Office Chair", category: "Furniture", status: "Available", location: "Warehouse", assignedTo: null },
    { id: "asset-4", tag: "#1003", name: "Macbook Pro", category: "Hardware", status: "Allocated", location: "Dept HR", assignedTo: "user-2" },
    { id: "asset-5", tag: "#A2000", name: "Monitor", category: "Hardware", status: "Allocated", location: "Dept HR", assignedTo: "user-2" },
    { id: "asset-6", tag: "#1100", name: "Server X002", category: "Hardware", status: "In Transit", location: "Dept IT", assignedTo: null },
    { id: "asset-7", tag: "#S001", name: "Adobe CC License", category: "Software", status: "Available", location: "Digital", assignedTo: null },
  ];

  // Maintenance
  const maintenance = [
    { id: "m-1", assetId: "asset-2", issue: "bulb warning msg", priority: "High", status: "Pending", reportedAt: new Date().toISOString() },
    { id: "m-2", assetId: "asset-3", issue: "assembly request", priority: "Low", status: "Approved", reportedAt: new Date().toISOString() },
    { id: "m-3", assetId: "asset-6", issue: "heading to IT", priority: "High", status: "In transit", reportedAt: new Date().toISOString() },
  ];

  // Notifications
  const notifications = [
    { id: "n-1", userId: "user-1", text: "System AF-000 completed run #7 success", type: "system", timestamp: new Date(Date.now() - 120000).toISOString(), read: false },
    { id: "n-2", userId: "user-1", text: "Asset transfer req by John H. approved", type: "approval", timestamp: new Date(Date.now() - 3600000).toISOString(), read: false },
    { id: "n-3", userId: "user-1", text: "Warning message for asset AF-001 (not charging)", type: "alert", timestamp: new Date(Date.now() - 10800000).toISOString(), read: false },
  ];

  if (isDemoMode) {
    // Write directly to local storage to bypass Firebase
    localStorage.setItem("demo_departments", JSON.stringify(departments));
    localStorage.setItem("demo_assets", JSON.stringify(assets));
    localStorage.setItem("demo_maintenance", JSON.stringify(maintenance));
    localStorage.setItem("demo_notifications", JSON.stringify(notifications));
    // Trigger custom event so the hook re-renders
    window.dispatchEvent(new Event("demo_db_update"));
    console.log("Local Sandbox seeded successfully!");
    return;
  }

  // Real Firebase Mode
  const batch = writeBatch(db);
  departments.forEach((dept) => batch.set(doc(db, "departments", dept.id), dept));
  assets.forEach((asset) => batch.set(doc(db, "assets", asset.id), asset));
  maintenance.forEach((m) => batch.set(doc(db, "maintenance", m.id), m));
  notifications.forEach((n) => batch.set(doc(db, "notifications", n.id), n));

  await batch.commit();
  console.log("Database seeded successfully!");
};
