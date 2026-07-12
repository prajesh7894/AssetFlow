import { toast } from "sonner";
import { Calendar, Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Dialog } from "../../components/ui/dialog";
import { BookingForm } from "./BookingForm";
import { useFirestoreQuery } from "../../hooks/useFirestoreQuery";
import { useFirestoreMutation } from "../../hooks/useFirestoreMutation";
import { useAuth } from "../../context/AuthContext";

export default function Booking() {
  const { user } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Data
  const { data: resources, loading: resLoading } = useFirestoreQuery<any>("resources");
  const { data: allBookings, loading: bookLoading } = useFirestoreQuery<any>("bookings");
  const { createRecord: createBooking, loading: mutating } = useFirestoreMutation("bookings");
  const { createRecord: createNotification } = useFirestoreMutation("notifications");

  // Timeline Configuration (09:00 to 18:00)
  const START_HOUR = 9;
  const END_HOUR = 18;
  const TOTAL_HOURS = END_HOUR - START_HOUR;
  const timeSlots = Array.from({ length: TOTAL_HOURS }, (_, i) => `${String(START_HOUR + i).padStart(2, '0')}:00`);

  // Filter bookings for the selected date
  const todaysBookings = allBookings.filter(b => b.date === selectedDate);

  // Handlers
  const handleBookingSubmit = async (formData: any) => {
    try {
      // 1. Create Booking
      await createBooking({
        ...formData,
        bookedBy: user?.displayName || user?.email || "Admin",
        status: "Upcoming"
      });

      // 2. Create Reminder Notification
      const resource = resources.find(r => r.id === formData.resourceId);
      await createNotification({
        userId: user?.uid || "admin",
        text: `Reminder: Booking for ${resource?.name} starts at ${formData.startTime} on ${formData.date}.`,
        type: "system",
        timestamp: new Date().toISOString(),
        read: false
      });

      setIsDialogOpen(false);
    } catch (err) {
      console.error(err);
      toast("Failed to create booking.");
    }
  };

  // Timeline Math Helpers
  const parseHour = (timeStr: string) => {
    const [h, m] = timeStr.split(':').map(Number);
    return h + (m / 60);
  };

  const getStyleForBooking = (startTime: string, endTime: string) => {
    const start = parseHour(startTime);
    const end = parseHour(endTime);
    
    // Clamp to timeline bounds
    const clampedStart = Math.max(START_HOUR, Math.min(END_HOUR, start));
    const clampedEnd = Math.max(START_HOUR, Math.min(END_HOUR, end));
    
    const leftPercent = ((clampedStart - START_HOUR) / TOTAL_HOURS) * 100;
    const widthPercent = ((clampedEnd - clampedStart) / TOTAL_HOURS) * 100;

    return {
      left: `${leftPercent}%`,
      width: `${widthPercent}%`,
    };
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case "Ongoing": return "bg-emerald-500/20 border-emerald-500/50 text-emerald-500";
      case "Upcoming": return "bg-primary/20 border-primary/50 text-primary";
      case "Completed": return "bg-secondary border-border text-muted-foreground";
      case "Cancelled": return "bg-destructive/20 border-destructive/50 text-destructive line-through";
      default: return "bg-primary/20 border-primary/50 text-primary";
    }
  };

  return (
    <div className="max-w-7xl flex flex-col h-full animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-semibold">Resource Booking</h2>
          <p className="text-sm text-muted-foreground mt-1">Timeline view for shared spaces and equipment.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <input 
            type="date" 
            value={selectedDate} 
            onChange={(e) => setSelectedDate(e.target.value)}
            className="flex h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Booking
          </Button>
        </div>
      </div>

      <Card className="flex-1 overflow-hidden flex flex-col shadow-sm border-border">
        <CardContent className="p-0 flex-1 overflow-auto bg-card">
          <div className="min-w-[1000px]">
            {/* Timeline Header */}
            <div className="grid grid-cols-[250px_1fr] border-b border-border bg-secondary/30 sticky top-0 z-20">
              <div className="p-4 font-semibold text-sm border-r border-border flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-primary" /> Resources
              </div>
              <div className="relative flex">
                {timeSlots.map((time) => (
                  <div key={time} className="flex-1 border-r border-border/50 p-2 text-center text-xs font-medium text-muted-foreground">
                    {time}
                  </div>
                ))}
              </div>
            </div>

            {/* Resources & Bookings */}
            <div className="divide-y divide-border">
              {resLoading || bookLoading ? (
                <div className="p-10 text-center text-muted-foreground animate-pulse">Loading timeline...</div>
              ) : resources.length === 0 ? (
                <div className="p-10 text-center text-muted-foreground">No resources available.</div>
              ) : (
                resources.map((resource: any) => {
                  const resourceBookings = todaysBookings.filter(b => b.resourceId === resource.id);

                  return (
                    <div key={resource.id} className="grid grid-cols-[250px_1fr] group">
                      <div className="p-4 border-r border-border flex flex-col justify-center bg-card group-hover:bg-secondary/20 transition-colors">
                        <span className="font-medium text-sm text-foreground">{resource.name}</span>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-muted-foreground">{resource.type}</span>
                          {resource.status === "Maintenance" && (
                            <span className="text-[10px] bg-destructive/10 text-destructive px-1.5 py-0.5 rounded-sm">Maintenance</span>
                          )}
                        </div>
                      </div>
                      
                      {/* Timeline Grid for Resource */}
                      <div className="relative flex group-hover:bg-secondary/10 transition-colors cursor-pointer" onClick={() => setIsDialogOpen(true)}>
                        {/* Background Grid Lines */}
                        {timeSlots.map((time) => (
                          <div key={`${resource.id}-${time}`} className="flex-1 border-r border-border/20 h-16" />
                        ))}

                        {/* Render Bookings Overlays */}
                        {resourceBookings.map((booking: any) => {
                          const style = getStyleForBooking(booking.startTime, booking.endTime);
                          
                          return (
                            <div 
                              key={booking.id}
                              style={style}
                              className={`absolute top-2 bottom-2 border rounded-md p-1.5 px-2 overflow-hidden text-xs z-10 shadow-sm transition-transform hover:scale-[1.02] hover:z-20 cursor-default ${getStatusColor(booking.status)}`}
                              onClick={(e) => e.stopPropagation()} // Prevent opening dialog when clicking a booking
                              title={`${booking.title} (${booking.startTime} - ${booking.endTime}) by ${booking.bookedBy}`}
                            >
                              <div className="font-semibold truncate">{booking.title}</div>
                              <div className="truncate opacity-80 mt-0.5 flex justify-between">
                                <span>{booking.bookedBy}</span>
                                <span className="font-mono">{booking.startTime}-{booking.endTime}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog 
        isOpen={isDialogOpen} 
        onClose={() => setIsDialogOpen(false)} 
        title="Schedule Resource"
      >
        <BookingForm 
          resources={resources}
          existingBookings={allBookings}
          onSubmit={handleBookingSubmit}
          isSubmitting={mutating}
        />
      </Dialog>
    </div>
  );
}
