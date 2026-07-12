import { useState } from "react";

const tabs = ["All", "Alerts", "Approvals", "System"];

const notifications = [
  { id: 1, text: "System AF-000 completed run #7 success", time: "2m ago", type: "system" },
  { id: 2, text: "Asset transfer req by John H. approved", time: "1h ago", type: "approval" },
  { id: 3, text: "Warning message for asset AF-001 (not charging)", time: "3h ago", type: "alert" },
  { id: 4, text: "New user registered: sarah.m@company.com", time: "1d ago", type: "system" },
  { id: 5, text: "Approval required: OP-2231 tool transfer request", time: "2d ago", type: "approval" },
  { id: 6, text: "Auto-discrepancy flagged - AF-0110 missing (2)", time: "2d ago", type: "alert" },
];

export default function Notifications() {
  const [activeTab, setActiveTab] = useState("All");

  return (
    <div className="max-w-4xl">
      <h2 className="text-2xl font-semibold mb-6">Activity logs & Notifications</h2>

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

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <ul className="divide-y divide-border">
          {notifications.map((notif) => (
            <li key={notif.id} className="p-4 flex items-start justify-between hover:bg-secondary/30 transition-colors">
              <div className="flex items-center gap-3">
                <span
                  className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    notif.type === "alert"
                      ? "bg-destructive"
                      : notif.type === "approval"
                      ? "bg-primary"
                      : "bg-muted-foreground"
                  }`}
                ></span>
                <p className="text-sm text-foreground">{notif.text}</p>
              </div>
              <span className="text-xs text-muted-foreground whitespace-nowrap ml-4">{notif.time}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
