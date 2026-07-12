import { Calendar } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";

export default function Booking() {
  const timeSlots = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"];
  const resources = [
    { id: 1, name: "Conference Room A" },
    { id: 2, name: "Projector #1" },
    { id: 3, name: "Company Vehicle #4" },
  ];

  return (
    <div className="max-w-6xl flex flex-col h-full">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-semibold">Resource Booking</h2>
          <p className="text-sm text-muted-foreground mt-1">Reserve shared assets and spaces</p>
        </div>
        <Button>
          <Calendar className="mr-2 h-4 w-4" />
          New Booking
        </Button>
      </div>

      <Card className="flex-1 overflow-hidden flex flex-col">
        <CardContent className="p-0 flex-1 overflow-auto">
          <div className="min-w-[800px]">
            <div className="grid grid-cols-[200px_1fr] border-b border-border bg-secondary/30">
              <div className="p-4 font-semibold text-sm border-r border-border">Resource</div>
              <div className="grid grid-cols-9 divide-x divide-border">
                {timeSlots.map((time) => (
                  <div key={time} className="p-2 text-center text-xs font-medium text-muted-foreground">
                    {time}
                  </div>
                ))}
              </div>
            </div>

            <div className="divide-y divide-border">
              {resources.map((resource) => (
                <div key={resource.id} className="grid grid-cols-[200px_1fr]">
                  <div className="p-4 font-medium text-sm border-r border-border flex items-center">
                    {resource.name}
                  </div>
                  <div className="grid grid-cols-9 divide-x divide-border relative">
                    {/* Dummy Bookings Overlay */}
                    {resource.id === 1 && (
                      <div className="absolute top-2 bottom-2 left-[22.22%] w-[22.22%] bg-primary/20 border border-primary/50 rounded-md p-1 px-2 overflow-hidden text-xs text-primary z-10 mx-1">
                        Team Sync
                      </div>
                    )}
                    {resource.id === 3 && (
                      <div className="absolute top-2 bottom-2 left-[55.55%] w-[33.33%] bg-destructive/20 border border-destructive/50 rounded-md p-1 px-2 overflow-hidden text-xs text-destructive z-10 mx-1">
                        Client Visit
                      </div>
                    )}
                    
                    {timeSlots.map((time) => (
                      <div key={`${resource.id}-${time}`} className="h-16 hover:bg-secondary/10 cursor-crosshair transition-colors" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
