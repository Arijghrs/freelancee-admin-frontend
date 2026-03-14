import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Shield, AlertTriangle, CheckCircle } from "lucide-react";

const securityEvents = [
  { event: "Failed login attempt (5x)", user: "unknown@test.com", ip: "192.168.1.45", date: "2025-03-10 14:23", severity: "High" },
  { event: "Password changed", user: "ahmed@example.com", ip: "10.0.0.12", date: "2025-03-10 11:05", severity: "Info" },
  { event: "Suspicious message flagged", user: "lina@example.com", ip: "172.16.0.8", date: "2025-03-09 16:30", severity: "Medium" },
  { event: "New device login", user: "omar@example.com", ip: "192.168.2.100", date: "2025-03-09 09:15", severity: "Low" },
  { event: "Account suspended", user: "contact@techcorp.tn", ip: "—", date: "2025-03-08 18:00", severity: "High" },
];

const AdminSecurity = () => {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold text-foreground">Security</h1>
        <p className="text-muted-foreground text-sm">Monitor security events and threats</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Threat Level</CardTitle>
            <Shield className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-heading font-bold text-success">Low</div>
            <p className="text-xs text-muted-foreground mt-1">No active threats</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Failed Logins (24h)</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-heading font-bold">12</div>
            <p className="text-xs text-muted-foreground mt-1">3 IPs blocked</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Verified Users</CardTitle>
            <CheckCircle className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-heading font-bold">89%</div>
            <p className="text-xs text-muted-foreground mt-1">2,534 of 2,847</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-heading">Security Log</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event</TableHead>
                <TableHead>User</TableHead>
                <TableHead>IP Address</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Severity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {securityEvents.map((e, i) => (
                <TableRow key={i}>
                  <TableCell className="font-medium">{e.event}</TableCell>
                  <TableCell className="text-muted-foreground">{e.user}</TableCell>
                  <TableCell className="font-mono text-sm text-muted-foreground">{e.ip}</TableCell>
                  <TableCell className="text-muted-foreground">{e.date}</TableCell>
                  <TableCell>
                    <Badge className={
                      e.severity === "High" ? "bg-destructive/10 text-destructive border-destructive/20" :
                      e.severity === "Medium" ? "bg-accent/10 text-accent border-accent/20" :
                      e.severity === "Low" ? "bg-success/10 text-success border-success/20" :
                      "bg-muted text-muted-foreground border-border"
                    }>{e.severity}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSecurity;
