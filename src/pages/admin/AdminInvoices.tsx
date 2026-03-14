import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

const invoices = [
  { id: "INV-001", project: "E-commerce Website", client: "Ahmed Ben Ali", amount: "2,500 TND", status: "Paid", date: "2025-02-01" },
  { id: "INV-002", project: "Mobile App UI", client: "TechCorp SARL", amount: "4,000 TND", status: "Paid", date: "2025-01-15" },
  { id: "INV-003", project: "Logo Design", client: "Sara Khemiri", amount: "800 TND", status: "Disputed", date: "2025-03-01" },
  { id: "INV-004", project: "API Integration", client: "Omar Trabelsi", amount: "3,200 TND", status: "Pending", date: "2025-03-05" },
  { id: "INV-005", project: "Landing Page", client: "Ahmed Ben Ali", amount: "1,200 TND", status: "Draft", date: "2025-03-10" },
];

const AdminInvoices = () => {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold text-foreground">Invoices</h1>
        <p className="text-muted-foreground text-sm">View and manage all platform invoices</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-heading">All Invoices</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice ID</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((inv) => (
                <TableRow key={inv.id}>
                  <TableCell className="font-medium font-mono text-sm">{inv.id}</TableCell>
                  <TableCell>{inv.project}</TableCell>
                  <TableCell className="text-muted-foreground">{inv.client}</TableCell>
                  <TableCell>{inv.amount}</TableCell>
                  <TableCell>
                    <Badge className={
                      inv.status === "Paid" ? "bg-success/10 text-success border-success/20" :
                      inv.status === "Disputed" ? "bg-destructive/10 text-destructive border-destructive/20" :
                      inv.status === "Pending" ? "bg-accent/10 text-accent border-accent/20" :
                      "bg-muted text-muted-foreground border-border"
                    }>{inv.status}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{inv.date}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm"><Download className="h-4 w-4" /></Button>
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

export default AdminInvoices;
