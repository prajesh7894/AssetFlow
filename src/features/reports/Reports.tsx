import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const utilizationData = [
  { name: 'IT', value: 400 },
  { name: 'HR', value: 300 },
  { name: 'Ops', value: 200 },
  { name: 'Sales', value: 278 },
  { name: 'Eng', value: 189 },
];

const maintenanceData = [
  { name: 'Jan', value: 65 },
  { name: 'Feb', value: 59 },
  { name: 'Mar', value: 80 },
  { name: 'Apr', value: 81 },
  { name: 'May', value: 56 },
  { name: 'Jun', value: 55 },
];

export default function Reports() {
  return (
    <div className="max-w-6xl">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Reports & Analytics</h2>
        <span className="text-sm text-muted-foreground bg-secondary px-2 py-1 rounded">
          Utilization, maintenance frequency cost, asset life, routing reviews
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        
        {/* Bar Chart Panel */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="text-sm font-medium mb-4 text-center">Utilization by Dept</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={utilizationData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '0.5rem' }}
                  itemStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 text-xs text-muted-foreground leading-relaxed">
            <p className="font-medium text-foreground mb-1">Dept. Asset allocation</p>
            Overall 12% tracking vs 10% active in Nov.<br />
            (avg. asset lifetime 3 yrs)
          </div>
        </div>

        {/* Line Chart Panel */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="text-sm font-medium mb-4 text-center">Maintenance frequency</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={maintenanceData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '0.5rem' }}
                  itemStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Line type="monotone" dataKey="value" stroke="hsl(var(--destructive))" strokeWidth={2} dot={{ r: 4, fill: "hsl(var(--card))", strokeWidth: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 text-xs text-muted-foreground leading-relaxed">
            <p className="font-medium text-foreground mb-1">Active tasks</p>
            Overall 12% tracking vs 10% active in Nov.<br />
            (avg. asset lifetime 3 yrs)
          </div>
        </div>

      </div>

      <button className="bg-secondary text-secondary-foreground border border-border hover:bg-secondary/80 px-6 py-2 rounded-md font-medium text-sm transition-colors">
        Export report
      </button>
    </div>
  );
}
