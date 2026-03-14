import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp, Users, Briefcase } from "lucide-react";

const metrics = [
  { label: "Monthly Revenue", value: "12,450 TND", icon: TrendingUp, change: "+18%" },
  { label: "New Users (30d)", value: "342", icon: Users, change: "+24%" },
  { label: "Projects Created (30d)", value: "89", icon: Briefcase, change: "+12%" },
  { label: "Avg. Project Value", value: "2,150 TND", icon: BarChart3, change: "+5%" },
];

const topFreelancers = [
  { name: "Lina Mansouri", projects: 12, earned: "18,500 TND", rating: "4.9" },
  { name: "Omar Trabelsi", projects: 9, earned: "14,200 TND", rating: "4.8" },
  { name: "Ahmed Ben Ali", projects: 7, earned: "11,800 TND", rating: "4.7" },
];

const AdminAnalytics = () => {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold text-foreground">Analytics</h1>
        <p className="text-muted-foreground text-sm">Platform performance and insights</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m) => (
          <Card key={m.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{m.label}</CardTitle>
              <m.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-heading font-bold">{m.value}</div>
              <p className="text-xs text-success mt-1">{m.change} from last month</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-heading">Top Freelancers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topFreelancers.map((f, i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                <div>
                  <p className="text-sm font-medium">{f.name}</p>
                  <p className="text-xs text-muted-foreground">{f.projects} projects · ⭐ {f.rating}</p>
                </div>
                <span className="font-heading font-semibold text-sm">{f.earned}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAnalytics;
