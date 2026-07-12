export default function Booking() {
  return (
    <div className="max-w-5xl">
      <h2 className="text-2xl font-semibold mb-6">Resource booking</h2>

      <div className="bg-card border border-border rounded-xl p-6">
        <div className="mb-6">
          <h3 className="text-lg font-medium">Timeline</h3>
          <p className="text-sm text-muted-foreground">Today, January 23 - 10:00 AM</p>
        </div>

        <div className="relative border-l-2 border-border ml-3 space-y-8 pb-8">
          
          <div className="relative">
            <div className="absolute -left-[21px] bg-background border-2 border-primary w-4 h-4 rounded-full mt-1.5"></div>
            <div className="pl-6">
              <span className="text-xs font-bold text-muted-foreground absolute -left-12 mt-1">10:00</span>
              <div className="bg-primary/20 border border-primary/30 p-3 rounded-lg text-sm text-primary font-medium">
                Unified - Projector Room - Floor 2
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-[21px] bg-background border-2 border-muted-foreground w-4 h-4 rounded-full mt-1.5"></div>
            <div className="pl-6">
              <span className="text-xs font-bold text-muted-foreground absolute -left-12 mt-1">12:00</span>
              <div className="border border-border border-dashed p-3 rounded-lg text-sm text-muted-foreground font-medium bg-secondary/30">
                Projector 400 to 'John Smith' - until tomorrow
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-[21px] bg-background border-2 border-muted-foreground w-4 h-4 rounded-full mt-1.5"></div>
            <div className="pl-6">
              <span className="text-xs font-bold text-muted-foreground absolute -left-12 mt-1">14:00</span>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-[21px] bg-background border-2 border-muted-foreground w-4 h-4 rounded-full mt-1.5"></div>
            <div className="pl-6">
              <span className="text-xs font-bold text-muted-foreground absolute -left-12 mt-1">16:00</span>
            </div>
          </div>
          
        </div>

        <button className="mt-4 bg-primary/20 text-primary border border-primary/30 hover:bg-primary/30 px-6 py-2 rounded-md font-medium text-sm transition-colors">
          Book a slot
        </button>
      </div>
    </div>
  );
}
