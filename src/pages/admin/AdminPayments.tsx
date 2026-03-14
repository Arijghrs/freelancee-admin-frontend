import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CreditCard, Clock, Wallet, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const payments = [
  { id: 1, user: "Lina Mansouri", project: "Mobile App UI", amount: "3,600 TND", method: "Bank Transfer", date: "2025-02-22" },
  { id: 2, user: "Ahmed Ben Ali", project: "Logo Design", amount: "720 TND", method: "E-Wallet", date: "2025-02-10" },
  { id: 3, user: "Omar Trabelsi", project: "Website Redesign", amount: "2,250 TND", method: "Bank Transfer", date: "2025-01-30" },
];

const withdrawals = [
  { id: 1, user: "Lina Mansouri", amount: "1,800 TND", requested: "2025-03-08", project: "E-commerce Website" },
  { id: 2, user: "Omar Trabelsi", amount: "2,880 TND", requested: "2025-03-09", project: "API Integration" },
  { id: 3, user: "Sara Khemiri", amount: "540 TND", requested: "2025-03-10", project: "Blog Design" },
];

const escrows = [
  { id: 1, project: "E-commerce Website", client: "Ahmed Ben Ali", amount: "2,500 TND", funded: "2025-02-01", status: "Active" },
  { id: 2, project: "API Integration", client: "Omar Trabelsi", amount: "3,200 TND", funded: "2025-03-05", status: "Active" },
  { id: 3, project: "Logo Design", client: "Sara Khemiri", amount: "800 TND", funded: "2025-03-01", status: "Disputed" },
];

const stats = [
  { label: "Total Paid", value: "45,230 TND", icon: DollarSign },
  { label: "Pending Withdrawals", value: "3", icon: Clock },
  { label: "Active Escrow", value: "6,500 TND", icon: Wallet },
  { label: "Platform Commission", value: "5,026 TND", icon: CreditCard },
];

const AdminPayments = () => {
  const [paymentDialog, setPaymentDialog] = useState<typeof withdrawals[0] | null>(null);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [reference, setReference] = useState("");
  const { toast } = useToast();

  const handleProcessPayment = () => {
    toast({ title: "Payment processed", description: `Payment sent to ${paymentDialog?.user}` });
    setPaymentDialog(null);
    setPaymentMethod("");
    setReference("");
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold text-foreground">Payments</h1>
        <p className="text-muted-foreground text-sm">Manage payments, withdrawals, and escrow</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-heading font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="pt-6">
          <Tabs defaultValue="payments">
            <TabsList>
              <TabsTrigger value="payments">Payments</TabsTrigger>
              <TabsTrigger value="withdrawals">Withdrawals</TabsTrigger>
              <TabsTrigger value="escrow">Escrow</TabsTrigger>
            </TabsList>

            <TabsContent value="payments">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Project</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="font-medium">{p.user}</TableCell>
                      <TableCell className="text-muted-foreground">{p.project}</TableCell>
                      <TableCell>{p.amount}</TableCell>
                      <TableCell><Badge variant="outline">{p.method}</Badge></TableCell>
                      <TableCell className="text-muted-foreground">{p.date}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="withdrawals">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Project</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Requested</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {withdrawals.map((w) => (
                    <TableRow key={w.id}>
                      <TableCell className="font-medium">{w.user}</TableCell>
                      <TableCell className="text-muted-foreground">{w.project}</TableCell>
                      <TableCell>{w.amount}</TableCell>
                      <TableCell className="text-muted-foreground">{w.requested}</TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" onClick={() => setPaymentDialog(w)} className="bg-accent text-accent-foreground hover:bg-accent/90">
                          Proceed to Payment
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="escrow">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Project</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Funded</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {escrows.map((e) => (
                    <TableRow key={e.id}>
                      <TableCell className="font-medium">{e.project}</TableCell>
                      <TableCell className="text-muted-foreground">{e.client}</TableCell>
                      <TableCell>{e.amount}</TableCell>
                      <TableCell className="text-muted-foreground">{e.funded}</TableCell>
                      <TableCell>
                        <Badge className={
                          e.status === "Active" ? "bg-success/10 text-success border-success/20" :
                          "bg-destructive/10 text-destructive border-destructive/20"
                        }>{e.status}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Dialog open={!!paymentDialog} onOpenChange={() => setPaymentDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-heading">Process Payment</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-muted rounded-lg p-3 text-sm space-y-1">
              <p><span className="text-muted-foreground">Recipient:</span> <span className="font-medium">{paymentDialog?.user}</span></p>
              <p><span className="text-muted-foreground">Amount:</span> <span className="font-medium">{paymentDialog?.amount}</span></p>
              <p><span className="text-muted-foreground">Project:</span> <span className="font-medium">{paymentDialog?.project}</span></p>
            </div>
            <div className="space-y-2">
              <Label>Payment Method</Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger><SelectValue placeholder="Select method" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="bank">Bank Transfer</SelectItem>
                  <SelectItem value="ewallet">E-Wallet</SelectItem>
                  <SelectItem value="check">Check</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Reference Number</Label>
              <Input placeholder="Transaction reference" value={reference} onChange={(e) => setReference(e.target.value)} />
            </div>
            <Button onClick={handleProcessPayment} className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
              Confirm Payment
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPayments;
