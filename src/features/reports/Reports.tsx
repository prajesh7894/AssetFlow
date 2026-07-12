import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useFirestoreQuery } from "../../hooks/useFirestoreQuery";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";

const COLORS = ['#00C49F', '#FFBB28', '#FF8042', '#0088FE'];

export default function Reports() {
  const { data: assets, loading } = useFirestoreQuery<any>("assets");

  if (loading) {
    return <div className="p-8 text-center text-muted-foreground">Loading report data...</div>;
  }

  // Process data for charts
  const categoryData = assets.reduce((acc: any, asset: any) => {
    const existing = acc.find((x: any) => x.name === asset.category);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: asset.category, value: 1 });
    }
    return acc;
  }, []);

  const statusData = assets.reduce((acc: any, asset: any) => {
    const existing = acc.find((x: any) => x.name === asset.status);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: asset.status, value: 1 });
    }
    return acc;
  }, []);

  return (
    <div className="max-w-6xl flex flex-col h-full space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Reports & Analytics</h2>
        <p className="text-sm text-muted-foreground mt-1">Visualize asset distribution and status</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Assets by Category</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                <XAxis dataKey="name" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', borderRadius: '8px' }} />
                <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Asset Status</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((_entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', borderRadius: '8px' }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
