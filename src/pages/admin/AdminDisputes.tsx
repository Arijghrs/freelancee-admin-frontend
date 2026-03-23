import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Eye, MessageSquare, Scale, CheckCircle, DollarSign, Flag } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// ─── Types ────────────────────────────────────────────────────────────────────

type DisputeResolution = "freelancer" | "client" | "split" | null;

interface DisputeProject {
  id: number; name: string; client: string; freelancer: string;
  budget: string; conversationId: string;
  dispute: { reason: string; raisedBy: string; raisedAt: string; };
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const disputedProjects: DisputeProject[] = [
  {
    id: 3, name: "Logo Design",
    client: "Sara Khemiri", freelancer: "Ahmed Ben Ali",
    budget: "800 TND", conversationId: "conv-3",
    dispute: { reason: "Delivered work does not match the agreed brief. Colors and typography are completely off.", raisedBy: "client", raisedAt: "2025-03-06" },
  },
];

// ─── ResolutionPanel ──────────────────────────────────────────────────────────

function ResolutionPanel({ project, onResolve }: {
  project: DisputeProject;
  onResolve: (r: DisputeResolution, amount: string, flagged?: string) => void;
}) {
  const [mode, setMode]                     = useState<DisputeResolution>(null);
  const [splitAmount, setSplit]             = useState("");
  const [flagClient, setFlagClient]         = useState(false);
  const [flagFreelancer, setFlagFreelancer] = useState(false);

  const budgetNum = parseFloat(project.budget.replace(/[^0-9.]/g, ""));

  const confirm = () => {
    if (!mode) return;
    const amount = mode === "split" ? `${splitAmount} TND` : project.budget;
    const flagged = [flagClient ? project.client : "", flagFreelancer ? project.freelancer : ""].filter(Boolean).join(", ");
    onResolve(mode, amount, flagged || undefined);
  };

  return (
    <div className="space-y-4">

      {/* Dispute info */}
      <div className="rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3 space-y-1">
        <p className="text-xs font-semibold text-destructive">Dispute Reason</p>
        <p className="text-[11px] text-muted-foreground">{project.dispute.reason}</p>
        <p className="text-[10px] text-muted-foreground/60">
          Raised by <span className="font-medium capitalize">{project.dispute.raisedBy}</span> · {project.dispute.raisedAt}
        </p>
      </div>

      {/* Parties */}
      <div className="grid grid-cols-2 gap-3">
        {[{ label: "Client", name: project.client }, { label: "Freelancer", name: project.freelancer }].map(({ label, name }) => (
          <div key={label} className="rounded-lg border border-border px-3 py-2.5 flex items-center gap-2">
            <Avatar className="h-8 w-8 shrink-0">
              <AvatarFallback className="text-xs bg-primary text-primary-foreground">{name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-[10px] text-muted-foreground">{label}</p>
              <p className="text-xs font-medium">{name}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Resolution options */}
      <div>
        <p className="text-xs font-semibold mb-2">Rule in favor of</p>
        <div className="grid grid-cols-3 gap-2">
          {[
            { key: "freelancer" as DisputeResolution, label: "Freelancer", desc: `Release ${project.budget}`, color: "border-success/40 bg-success/5 text-success"  },
            { key: "client"     as DisputeResolution, label: "Client",     desc: `Refund ${project.budget}`,  color: "border-primary/40 bg-primary/5 text-primary"  },
            { key: "split"      as DisputeResolution, label: "Split",      desc: "Custom amount",             color: "border-accent/40 bg-accent/5 text-accent"     },
          ].map(({ key, label, desc, color }) => (
            <button
              key={key}
              onClick={() => setMode(key)}
              className={`rounded-lg border-2 px-3 py-2.5 text-left transition-all
                ${mode === key ? `${color} scale-[1.02]` : "border-border hover:border-muted-foreground/30"}`}
            >
              <p className="text-xs font-semibold">{label}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">{desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Split input */}
      {mode === "split" && (
        <div className="space-y-1.5">
          <p className="text-xs text-muted-foreground">Amount to release to freelancer (TND)</p>
          <div className="flex gap-2 items-center">
            <Input type="number" placeholder={`Max ${budgetNum}`} max={budgetNum}
              value={splitAmount} onChange={(e) => setSplit(e.target.value)} className="h-8 text-xs" />
            <span className="text-xs text-muted-foreground shrink-0">
              Client refund: {splitAmount ? `${budgetNum - parseFloat(splitAmount)} TND` : "—"}
            </span>
          </div>
        </div>
      )}

      {/* Flag accounts */}
      <div>
        <p className="text-xs font-semibold mb-2 flex items-center gap-1.5">
          <Flag className="h-3.5 w-3.5 text-destructive" /> Flag accounts after resolution
        </p>
        <div className="flex gap-2">
          {[
            { active: flagClient,     toggle: () => setFlagClient(!flagClient),         name: project.client     },
            { active: flagFreelancer, toggle: () => setFlagFreelancer(!flagFreelancer), name: project.freelancer },
          ].map(({ active, toggle, name }) => (
            <button key={name} onClick={toggle}
              className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs transition-all
                ${active ? "border-destructive/40 bg-destructive/10 text-destructive" : "border-border text-muted-foreground hover:border-muted-foreground/40"}`}
            >
              <Flag className="h-3 w-3" /> {name}
            </button>
          ))}
        </div>
      </div>

      <Button className="w-full gap-2" disabled={!mode || (mode === "split" && !splitAmount)} onClick={confirm}>
        <CheckCircle className="h-4 w-4" /> Confirm Resolution
      </Button>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

const AdminDisputes = () => {
  const navigate       = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast }      = useToast();

  const [selected, setSelected] = useState<DisputeProject | null>(null);
  const [resolved, setResolved] = useState<Record<number, { resolution: DisputeResolution; amount: string; flagged?: string }>>({});

  // Auto-open from ?projectId (coming from AdminProjects)
  useEffect(() => {
    const id = searchParams.get("projectId");
    if (id) {
      const p = disputedProjects.find((p) => p.id === parseInt(id));
      if (p) setSelected(p);
    }
  }, [searchParams]);

  const handleResolve = (resolution: DisputeResolution, amount: string, flagged?: string) => {
    if (!selected) return;
    setResolved((prev) => ({ ...prev, [selected.id]: { resolution, amount, flagged } }));
    setSelected(null);
    toast({
      title: "Dispute resolved",
      description:
        resolution === "freelancer" ? `Payment of ${amount} released to freelancer.` :
        resolution === "client"     ? `Full refund of ${amount} sent to client.`     :
                                      `Split payment of ${amount} processed.`,
    });
  };

  const isResolved = (p: DisputeProject) => !!resolved[p.id];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold">Disputes</h1>
        <p className="text-muted-foreground text-sm">Review and resolve platform disputes</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Total",    value: disputedProjects.length,                             color: "text-foreground"  },
          { label: "Pending",  value: disputedProjects.filter((p) => !isResolved(p)).length, color: "text-destructive" },
          { label: "Resolved", value: Object.keys(resolved).length,                        color: "text-success"     },
        ].map(({ label, value, color }) => (
          <div key={label} className="rounded-xl border border-border bg-card p-4 text-center">
            <p className={`text-2xl font-bold font-heading ${color}`}>{value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <Card>
        <CardHeader><CardTitle className="text-lg font-heading">All Disputes</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project</TableHead><TableHead>Client</TableHead>
                <TableHead>Freelancer</TableHead><TableHead>Amount</TableHead>
                <TableHead>Raised By</TableHead><TableHead>Date</TableHead>
                <TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {disputedProjects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell className="font-medium">{project.name}</TableCell>
                  <TableCell className="text-muted-foreground">{project.client}</TableCell>
                  <TableCell className="text-muted-foreground">{project.freelancer}</TableCell>
                  <TableCell>{project.budget}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize text-[10px]">{project.dispute.raisedBy}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{project.dispute.raisedAt}</TableCell>
                  <TableCell>
                    {isResolved(project)
                      ? <Badge className="bg-success/10 text-success border-success/20 text-[10px]">Resolved</Badge>
                      : <Badge className="bg-destructive/10 text-destructive border-destructive/20 text-[10px]">Pending</Badge>
                    }
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0"
                        onClick={() => navigate(`/messages?conversationId=${project.conversationId}`)}>
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setSelected(project)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialog */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-lg gap-0 p-0">
          <div className="px-6 pt-6 pb-4 border-b border-border">
            <DialogHeader>
              <DialogTitle className="font-heading flex items-center gap-2">
                <Scale className="h-5 w-5 text-destructive" /> {selected?.name}
              </DialogTitle>
            </DialogHeader>
            <Button size="sm" variant="outline" className="mt-3 gap-1.5 text-xs h-8"
              onClick={() => selected && navigate(`/messages?conversationId=${selected.conversationId}`)}>
              <MessageSquare className="h-3.5 w-3.5" /> View Conversation
            </Button>
          </div>
          <div className="px-6 py-5">
            {selected && isResolved(selected) ? (
              <div className="rounded-lg border border-success/20 bg-success/5 px-4 py-3 space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <p className="text-xs font-semibold text-success">Dispute Resolved</p>
                  <Badge className="bg-success/10 text-success border-success/20 text-[10px]">
                    {resolved[selected.id].resolution === "freelancer" ? "Freelancer wins" :
                     resolved[selected.id].resolution === "client"     ? "Client wins"     : "Split"}
                  </Badge>
                </div>
                <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                  <DollarSign className="h-3 w-3" /> {resolved[selected.id].amount} processed
                </p>
                {resolved[selected.id].flagged && (
                  <p className="text-[11px] text-destructive flex items-center gap-1">
                    <Flag className="h-3 w-3" /> Flagged: {resolved[selected.id].flagged}
                  </p>
                )}
              </div>
            ) : (
              selected && <ResolutionPanel project={selected} onResolve={handleResolve} />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDisputes;