import { writeBatch, doc } from "firebase/firestore";
import { db, isDemoMode } from "./firebase";

export const seedDatabase = async () => {
  // Departments
  const departments = [
    { id: "dept-1", name: "Engineering", headId: "EMP-001", status: "Active" },
    { id: "dept-2", name: "Human Resources", headId: "EMP-003", status: "Active" },
    { id: "dept-3", name: "Sales & Marketing", headId: "EMP-004", status: "Active" },
  ];

  // Employees
  const employees = [
    { id: "emp-1", empId: "EMP-001", name: "John Doe", title: "VP of Engineering", departmentId: "dept-1", email: "john@example.com", status: "Active" },
    { id: "emp-2", empId: "EMP-002", name: "Alex Chen", title: "Senior Developer", departmentId: "dept-1", email: "alex@example.com", status: "Active" },
    { id: "emp-3", empId: "EMP-003", name: "Jane Smith", title: "HR Director", departmentId: "dept-2", email: "jane@example.com", status: "Active" },
    { id: "emp-4", empId: "EMP-004", name: "Sarah W", title: "Head of Sales", departmentId: "dept-3", email: "sarah@example.com", status: "Active" },
  ];

  // Assets
  const assets = [
    { id: "asset-1", tag: "AF-0001", name: "Dell XPS 15", category: "Laptops", status: "Allocated", location: "NY Office Floor 3", assignedTo: "John Doe", cost: 1800 },
    { id: "asset-2", tag: "AF-0002", name: "Epson Projector X", category: "Equipment", status: "Maintenance", location: "NY Office Floor 4", assignedTo: null, cost: 650 },
    { id: "asset-3", tag: "AF-0003", name: "Herman Miller Chair", category: "Furniture", status: "Available", location: "London Office", assignedTo: null, cost: 1200 },
    { id: "asset-4", tag: "AF-0004", name: "MacBook Pro 16", category: "Laptops", status: "In Transit", location: "Warehouse B", assignedTo: "Jane Smith", cost: 2400 },
    { id: "asset-5", tag: "AF-0005", name: "Standing Desk", category: "Furniture", status: "Allocated", location: "London Office", assignedTo: "Alex Chen", cost: 800 },
    { id: "asset-6", tag: "AF-0006", name: "Cisco Switch", category: "Networking", status: "Available", location: "Server Room A", assignedTo: null, cost: 3500 },
    { id: "asset-7", tag: "#S001", name: "Adobe CC License", category: "Software", status: "Available", location: "Digital", assignedTo: null, cost: 600 },
  ];

  // Maintenance Tickets
  const maintenance = [
    { 
      id: "m-1", assetId: "AF-0002", title: "Projector bulb replacement", issue: "Bulb warning msg, dim light", 
      priority: "Medium", status: "In Progress", technician: "Tech Dave", reportedAt: new Date(Date.now() - 86400000).toISOString(),
      history: [{ date: new Date(Date.now() - 86400000).toISOString(), action: "Ticket Created" }, { date: new Date(Date.now() - 40000000).toISOString(), action: "Assigned to Tech Dave" }]
    },
    { 
      id: "m-2", assetId: "AF-0003", title: "Chair assembly required", issue: "Delivered in box", 
      priority: "Low", status: "Approved", technician: null, reportedAt: new Date(Date.now() - 172800000).toISOString(),
      history: [{ date: new Date(Date.now() - 172800000).toISOString(), action: "Ticket Created" }, { date: new Date(Date.now() - 100000000).toISOString(), action: "Approved by Admin" }]
    },
    { 
      id: "m-3", assetId: "AF-0006", title: "Server offline", issue: "Power supply failed, needs immediate replacement", 
      priority: "Critical", status: "Pending", technician: null, reportedAt: new Date().toISOString(),
      history: [{ date: new Date().toISOString(), action: "Ticket Created" }]
    },
    { 
      id: "m-4", assetId: "AF-0001", title: "Keyboard replacement", issue: "Keys sticking", 
      priority: "Low", status: "Resolved", technician: "Tech Dave", reportedAt: new Date(Date.now() - 600000000).toISOString(),
      history: [{ date: new Date(Date.now() - 600000000).toISOString(), action: "Ticket Created" }, { date: new Date(Date.now() - 500000000).toISOString(), action: "Resolved by Tech Dave" }]
    },
  ];

  // Notifications
  const notifications = [
    { id: "n-1", userId: "user-1", text: "System AF-000 completed run #7 success", type: "system", timestamp: new Date(Date.now() - 120000).toISOString(), read: false },
    { id: "n-2", userId: "user-1", text: "Asset transfer req by John H. approved", type: "approval", timestamp: new Date(Date.now() - 3600000).toISOString(), read: false },
    { id: "n-3", userId: "user-1", text: "Warning message for asset AF-001 (not charging)", type: "alert", timestamp: new Date(Date.now() - 10800000).toISOString(), read: false },
  ];

  // Booking Resources
  const resources = [
    { id: "res-1", name: "Conference Room A", type: "Meeting Room", capacity: 10, status: "Active" },
    { id: "res-2", name: "Projector 400x", type: "Projector", capacity: null, status: "Active" },
    { id: "res-3", name: "Company Van", type: "Vehicle", capacity: 7, status: "Active" },
    { id: "res-4", name: "Boardroom", type: "Meeting Room", capacity: 20, status: "Maintenance" },
  ];

  // Bookings (Using today's date for timeline demo)
  const today = new Date().toISOString().split('T')[0];
  const bookings = [
    { id: "bk-1", resourceId: "res-1", title: "Quarterly Planning", bookedBy: "Jane Smith", date: today, startTime: "09:00", endTime: "11:00", status: "Completed" },
    { id: "bk-2", resourceId: "res-1", title: "Design Sync", bookedBy: "Alex Chen", date: today, startTime: "13:30", endTime: "15:00", status: "Ongoing" },
    { id: "bk-3", resourceId: "res-3", title: "Client Site Visit", bookedBy: "Mike R", date: today, startTime: "10:00", endTime: "14:00", status: "Upcoming" },
    { id: "bk-4", resourceId: "res-2", title: "Presentation", bookedBy: "Sarah W", date: today, startTime: "15:00", endTime: "16:30", status: "Cancelled" },
  ];

  // Audit Logs
  const auditLogs = [
    { id: "au-1", assetTag: "AF-0001", expectedLocation: "NY Office Floor 3", scannedLocation: "NY Office Floor 3", status: "Match", timestamp: new Date(Date.now() - 3600000).toISOString(), auditor: "Admin" },
    { id: "au-2", assetTag: "AF-0002", expectedLocation: "NY Office Floor 4", scannedLocation: "London Office", status: "Mismatch", timestamp: new Date(Date.now() - 7200000).toISOString(), auditor: "Admin" },
    { id: "au-3", assetTag: "AF-0004", expectedLocation: "Warehouse B", scannedLocation: "Missing", status: "Missing", timestamp: new Date(Date.now() - 86400000).toISOString(), auditor: "Jane Smith" },
  ];

  if (isDemoMode) {
    // Write directly to local storage to bypass Firebase
    localStorage.setItem("demo_departments", JSON.stringify(departments));
    localStorage.setItem("demo_employees", JSON.stringify(employees));
    localStorage.setItem("demo_assets", JSON.stringify(assets));
    localStorage.setItem("demo_maintenance", JSON.stringify(maintenance));
    localStorage.setItem("demo_notifications", JSON.stringify(notifications));
    localStorage.setItem("demo_resources", JSON.stringify(resources));
    localStorage.setItem("demo_bookings", JSON.stringify(bookings));
    localStorage.setItem("demo_auditLogs", JSON.stringify(auditLogs));
    // Trigger custom event so the hook re-renders
    window.dispatchEvent(new Event("demo_db_update"));
    console.log("Local Sandbox seeded successfully!");
    return;
  }

  // Real Firebase Mode
  const batch = writeBatch(db);
  departments.forEach((dept) => batch.set(doc(db, "departments", dept.id), dept));
  employees.forEach((emp) => batch.set(doc(db, "employees", emp.id), emp));
  assets.forEach((asset) => batch.set(doc(db, "assets", asset.id), asset));
  maintenance.forEach((m) => batch.set(doc(db, "maintenance", m.id), m));
  notifications.forEach((n) => batch.set(doc(db, "notifications", n.id), n));
  resources.forEach((r) => batch.set(doc(db, "resources", r.id), r));
  bookings.forEach((b) => batch.set(doc(db, "bookings", b.id), b));
  auditLogs.forEach((a) => batch.set(doc(db, "auditLogs", a.id), a));

  await batch.commit();
  console.log("Database seeded successfully!");
};
