import { Plus, Edit, Wrench, ShieldCheck, ArrowRightLeft, UploadCloud, Clock } from "lucide-react";
import { cn } from "../../lib/utils";

export interface TimelineEvent {
  date: string;
  action: string;
}

interface TimelineProps {
  events: TimelineEvent[];
}

const getActionDetails = (action: string) => {
  const lower = action.toLowerCase();
  if (lower.includes("registered") || lower.includes("created")) {
    return { icon: Plus, color: "text-success", bg: "bg-success/10", border: "border-success/20" };
  }
  if (lower.includes("updated") || lower.includes("edited")) {
    return { icon: Edit, color: "text-primary", bg: "bg-primary/10", border: "border-primary/20" };
  }
  if (lower.includes("maintain") || lower.includes("repaired")) {
    return {
      icon: Wrench,
      color: "text-warning",
      bg: "bg-warning/10",
      border: "border-warning/20",
    };
  }
  if (lower.includes("audit") || lower.includes("verified")) {
    return {
      icon: ShieldCheck,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
      border: "border-purple-500/20",
    };
  }
  if (lower.includes("allocat") || lower.includes("transfer") || lower.includes("assigned")) {
    return {
      icon: ArrowRightLeft,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
    };
  }
  if (lower.includes("import") || lower.includes("csv")) {
    return {
      icon: UploadCloud,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
    };
  }
  return {
    icon: Clock,
    color: "text-muted-foreground",
    bg: "bg-secondary",
    border: "border-border",
  };
};

export function Timeline({ events }: TimelineProps) {
  if (!events || events.length === 0) {
    return (
      <div className="text-center p-4 text-sm text-muted-foreground">No history available.</div>
    );
  }

  // Ensure newest events are first
  const sortedEvents = [...events].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="relative border-l border-border/60 ml-4 py-2 space-y-6">
      {sortedEvents.map((event, index) => {
        const { icon: Icon, color, bg, border } = getActionDetails(event.action);
        const dateObj = new Date(event.date);

        // Format relative time if today, else normal date
        const isToday = new Date().toDateString() === dateObj.toDateString();
        const dateString = isToday
          ? "Today, " + dateObj.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
          : dateObj.toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" });

        return (
          <div key={index} className="relative pl-6 group">
            {/* Timeline Line Connector Dot */}
            <div
              className={cn(
                "absolute -left-[1.1rem] top-1 h-8 w-8 rounded-full border-2 bg-card flex items-center justify-center transition-transform group-hover:scale-110",
                border,
                color
              )}
            >
              <Icon className={cn("h-4 w-4", color)} />
            </div>

            {/* Content Card */}
            <div className="flex flex-col space-y-1 group-hover:translate-x-1 transition-transform duration-200">
              <span className="text-[11px] font-medium text-muted-foreground tracking-wider uppercase">
                {dateString}
              </span>
              <div className={cn("inline-flex w-fit px-3 py-2 rounded-lg border", bg, border)}>
                <p className="text-sm font-medium text-foreground">{event.action}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
