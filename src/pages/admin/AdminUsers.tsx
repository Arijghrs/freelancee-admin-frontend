import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Eye, XCircle } from "lucide-react";

// ─── Data ─────────────────────────────────────────────────────────────────────

const users = [
  { id: 1, name: "Ahmed Ben Ali", email: "ahmed@example.com",   type: "Individual", status: "Active",    joined: "2025-01-15", avatar: "https://i.pravatar.cc/40?u=ahmed" },
  { id: 2, name: "Lina Mansouri", email: "lina@example.com",    type: "Individual", status: "Active",    joined: "2025-02-03", avatar: "https://i.pravatar.cc/40?u=lina"  },
  { id: 3, name: "TechCorp SARL", email: "contact@techcorp.tn", type: "Company",    status: "Suspended", joined: "2025-01-20", avatar: ""                                  },
  { id: 4, name: "Omar Trabelsi", email: "omar@example.com",    type: "Individual", status: "Active",    joined: "2025-03-01", avatar: "https://i.pravatar.cc/40?u=omar"  },
  { id: 5, name: "Sara Khemiri",  email: "sara@example.com",    type: "Individual", status: "Pending",   joined: "2025-03-10", avatar: "https://i.pravatar.cc/40?u=sara"  },
];

const userProjects = [
  { project: "E-commerce Website", role: "Freelancer", earnings: "2,500 TND", status: "Completed",   date: "2025-02-15" },
  { project: "Mobile App UI",      role: "Freelancer", earnings: "1,800 TND", status: "In Progress", date: "2025-03-01" },
  { project: "Logo Design",        role: "Client",     earnings: "—",         status: "Completed",   date: "2025-01-20" },
  { project: "API Integration",    role: "Freelancer", earnings: "3,200 TND", status: "Disputed",    date: "2025-02-28" },
  { project: "Dashboard Redesign", role: "Client",     earnings: "—",         status: "In Progress", date: "2025-03-05" },
  { project: "SEO Audit",          role: "Freelancer", earnings: "900 TND",   status: "Completed",   date: "2025-01-30" },
  { project: "Backend API",        role: "Freelancer", earnings: "4,100 TND", status: "Completed",   date: "2025-02-10" },
];

// ─── Component ────────────────────────────────────────────────────────────────

const AdminUsers = () => {
  const [selectedUser, setSelectedUser] = useState<typeof users[0] | null>(null);

  return (
    <div className="p-6 space-y-6">

      {/* Page header */}
      <div>
        <h1 className="text-2xl font-heading font-bold text-foreground">User Management</h1>
        <p className="text-muted-foreground text-sm">Manage platform users and accounts</p>
      </div>

      {/* Users table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-heading">All Users</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                          {user.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <button
                        onClick={() => setSelectedUser(user)}
                        className="font-medium text-foreground hover:text-accent transition-colors text-left"
                      >
                        {user.name}
                      </button>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{user.email}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{user.type}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={
                      user.status === "Active"    ? "bg-success/10 text-success border-success/20" :
                      user.status === "Suspended" ? "bg-destructive/10 text-destructive border-destructive/20" :
                                                    "bg-accent/10 text-accent border-accent/20"
                    }>
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{user.joined}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => setSelectedUser(user)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* User detail dialog */}
      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent className="max-w-3xl flex flex-col gap-0 p-0">

          {/* Fixed header */}
          <DialogHeader className="px-6 pt-6 pb-4">
            <DialogTitle className="font-heading flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={selectedUser?.avatar} />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {selectedUser?.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <span>{selectedUser?.name}</span>
                <p className="text-sm font-normal text-muted-foreground">{selectedUser?.email}</p>
              </div>
            </DialogTitle>
          </DialogHeader>

          {/* Scrollable content */}
          <div className="overflow-y-auto max-h-[300px] px-6 pb-4">
            <h3 className="font-heading font-semibold text-sm mb-3">Project History</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Project</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Earnings</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {userProjects.map((p, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium">{p.project}</TableCell>
                    <TableCell><Badge variant="outline">{p.role}</Badge></TableCell>
                    <TableCell>{p.earnings}</TableCell>
                    <TableCell>
                      <Badge className={
                        p.status === "Completed"   ? "bg-success/10 text-success border-success/20" :
                        p.status === "Disputed"    ? "bg-destructive/10 text-destructive border-destructive/20" :
                                                     "bg-accent/10 text-accent border-accent/20"
                      }>
                        {p.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{p.date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Fixed footer — suspend button bottom-right */}
          <div className="flex justify-end px-6 py-3 border-t border-border">
            <Button
              variant="outline"
              size="sm"
              className="text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/30 gap-1.5"
            >
              <XCircle className="h-3.5 w-3.5" />
              Suspend Account
            </Button>
          </div>

        </DialogContent>
      </Dialog>

    </div>
  );
};

export default AdminUsers;