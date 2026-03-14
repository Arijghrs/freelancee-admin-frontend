import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Eye, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const disputes = [
  { id: 1, project: "Logo Design", client: "Sara Khemiri", freelancer: "Ahmed Ben Ali", amount: "800 TND", reason: "Work not matching requirements", status: "Open", date: "2025-03-06" },
  { id: 2, project: "Website Redesign", client: "Omar Trabelsi", freelancer: "Lina Mansouri", amount: "2,500 TND", reason: "Deadline missed", status: "Under Review", date: "2025-03-04" },
  { id: 3, project: "App Backend", client: "TechCorp SARL", freelancer: "Omar Trabelsi", amount: "5,000 TND", reason: "Incomplete deliverables", status: "Resolved", date: "2025-02-20" },
];

const AdminDisputes = () => {
  const [selectedDispute, setSelectedDispute] = useState<typeof disputes[0] | null>(null);
  const [resolution, setResolution] = useState("");
  const [adminNotes, setAdminNotes] = useState("");
  const { toast } = useToast();

  const handleResolve = () => {
    toast({ title: "Dispute resolved", description: `Resolution: ${resolution}` });
    setSelectedDispute(null);
    setResolution("");
    setAdminNotes("");
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold text-foreground">Disputes</h1>
        <p className="text-muted-foreground text-sm">Review and resolve platform disputes</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-heading">All Disputes</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Freelancer</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {disputes.map((d) => (
                <TableRow key={d.id}>
                  <TableCell className="font-medium">{d.project}</TableCell>
                  <TableCell className="text-muted-foreground">{d.client}</TableCell>
                  <TableCell className="text-muted-foreground">{d.freelancer}</TableCell>
                  <TableCell>{d.amount}</TableCell>
                  <TableCell>
                    <Badge className={
                      d.status === "Open" ? "bg-destructive/10 text-destructive border-destructive/20" :
                      d.status === "Under Review" ? "bg-accent/10 text-accent border-accent/20" :
                      "bg-success/10 text-success border-success/20"
                    }>{d.status}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{d.date}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => setSelectedDispute(d)}><Eye className="h-4 w-4" /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!selectedDispute} onOpenChange={() => setSelectedDispute(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-heading">Dispute: {selectedDispute?.project}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-muted rounded-lg p-3 text-sm space-y-1">
              <p><span className="text-muted-foreground">Client:</span> <span className="font-medium">{selectedDispute?.client}</span></p>
              <p><span className="text-muted-foreground">Freelancer:</span> <span className="font-medium">{selectedDispute?.freelancer}</span></p>
              <p><span className="text-muted-foreground">Amount:</span> <span className="font-medium">{selectedDispute?.amount}</span></p>
              <p><span className="text-muted-foreground">Reason:</span> <span className="font-medium">{selectedDispute?.reason}</span></p>
            </div>

            <Button variant="outline" className="w-full gap-2">
              <MessageSquare className="h-4 w-4" />
              View Conversation
            </Button>

            {selectedDispute?.status !== "Resolved" && (
              <>
                <div className="space-y-2">
                  <Label>Resolution</Label>
                  <Select value={resolution} onValueChange={setResolution}>
                    <SelectTrigger><SelectValue placeholder="Select resolution" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full-pay">Full Pay to Freelancer</SelectItem>
                      <SelectItem value="refund">Full Refund to Client</SelectItem>
                      <SelectItem value="split">Split Payment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Admin Notes</Label>
                  <Textarea placeholder="Add resolution notes..." value={adminNotes} onChange={(e) => setAdminNotes(e.target.value)} />
                </div>
                <Button onClick={handleResolve} className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                  Resolve Dispute
                </Button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDisputes;
