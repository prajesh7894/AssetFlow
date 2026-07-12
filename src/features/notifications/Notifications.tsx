import { Bell } from "lucide-react";
import { useFirestoreQuery } from "../../hooks/useFirestoreQuery";
import { Button } from "../../components/ui/button";

export default function Notifications() {
  const { data: notifications, loading } = useFirestoreQuery<any>("notifications");

  return (
    <div className="max-w-4xl flex flex-col h-full">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-semibold">Notifications</h2>
          <p className="text-sm text-muted-foreground mt-1">View system alerts and messages</p>
        </div>
        <Button variant="outline">Mark all as read</Button>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden flex flex-col">
        {loading ? (
          <div className="p-8 text-center text-muted-foreground">Loading notifications...</div>
        ) : notifications.length === 0 ? (
          <div className="p-8 flex flex-col items-center text-center text-muted-foreground">
            <Bell className="h-12 w-12 text-muted mb-4" />
            <p>No new notifications</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {notifications.map((notification) => (
              <div key={notification.id} className={`p-4 flex gap-4 ${!notification.read ? 'bg-secondary/20' : ''}`}>
                <div className="mt-1">
                  <div className={`w-2.5 h-2.5 rounded-full ${notification.type === 'alert' ? 'bg-destructive' : notification.type === 'approval' ? 'bg-primary' : 'bg-muted-foreground'}`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{notification.text}</p>
                  <p className="text-xs text-muted-foreground mt-1">{new Date(notification.timestamp).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
