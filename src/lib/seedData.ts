import { writeBatch, doc } from "firebase/firestore";
import { db } from "./firebase";

export const seedDatabase = async () => {
  const batch = writeBatch(db);

  // Departments
  const departments = [
    { id: "dept-1", name: "Engineering", headId: "user-1", parentId: null, status: "Active" },
    { id: "dept-2", name: "HR", headId: "user-2", parentId: null, status: "Active" },
    { id: "dept-3", name: "Design Team A", headId: "user-3", parentId: "dept-1", status: "Inactive" },
  ];
  departments.forEach((dept) => {
    const ref = doc(db, "departments", dept.id);
    batch.set(ref, dept);
  });

  // Assets
  const assets = [
    { id: "asset-1", tag: "#A1002", name: "Dell Laptop", category: "Hardware", status: "Allocated", location: "London", assignedTo: "user-1" },
    { id: "asset-2", tag: "#B4003", name: "Projector 400x", category: "Hardware", status: "Maintenance", location: "NY Floor 2", assignedTo: null },
    { id: "asset-3", tag: "#C8004", name: "Office Chair", category: "Furniture", status: "Available", location: "Warehouse", assignedTo: null },
    { id: "asset-4", tag: "#1003", name: "Macbook Pro", category: "Hardware", status: "Allocated", location: "Dept HR", assignedTo: "user-2" },
    { id: "asset-5", tag: "#A2000", name: "Monitor", category: "Hardware", status: "Allocated", location: "Dept HR", assignedTo: "user-2" },
    { id: "asset-6", tag: "#1100", name: "Server X002", category: "Hardware", status: "In Transit", location: "Dept IT", assignedTo: null },
  ];
  assets.forEach((asset) => {
    const ref = doc(db, "assets", asset.id);
    batch.set(ref, asset);
  });

  // Maintenance
  const maintenance = [
    { id: "m-1", assetId: "asset-2", issue: "bulb warning msg", priority: "High", status: "Pending", reportedAt: new Date().toISOString() },
    { id: "m-2", assetId: "asset-3", issue: "assembly request", priority: "Low", status: "Approved", reportedAt: new Date().toISOString() },
    { id: "m-3", assetId: "asset-6", issue: "heading to IT", priority: "High", status: "In transit", reportedAt: new Date().toISOString() },
  ];
  maintenance.forEach((m) => {
    const ref = doc(db, "maintenance", m.id);
    batch.set(ref, m);
  });

  // Notifications
  const notifications = [
    { id: "n-1", userId: "user-1", text: "System AF-000 completed run #7 success", type: "system", timestamp: new Date(Date.now() - 120000).toISOString(), read: false },
    { id: "n-2", userId: "user-1", text: "Asset transfer req by John H. approved", type: "approval", timestamp: new Date(Date.now() - 3600000).toISOString(), read: false },
    { id: "n-3", userId: "user-1", text: "Warning message for asset AF-001 (not charging)", type: "alert", timestamp: new Date(Date.now() - 10800000).toISOString(), read: false },
  ];
  notifications.forEach((n) => {
    const ref = doc(db, "notifications", n.id);
    batch.set(ref, n);
  });

  await batch.commit();
  console.log("Database seeded successfully!");
};
