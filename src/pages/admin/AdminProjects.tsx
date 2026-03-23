import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Eye, FileText, CreditCard, Rocket, Upload, CheckCircle,
  XCircle, Download, ExternalLink, DollarSign, Star,
} from "lucide-react";



type StepStatus = "completed" | "active" | "pending" | "disputed";
type StepKey = "invoice" | "payment" | "started" | "submitted" | "outcome" | "review";

interface TimelineStep {
  key: StepKey;
  label: string;
  icon: React.ElementType;
  date?: string;
  status: StepStatus;
}

interface Project {
  id: number;
  name: string;
  client: string;
  freelancer: string;
  budget: string;
  status: string;
  created: string;
}



const projects: Project[] = [
  { id: 1, name: "E-commerce Website", client: "Ahmed Ben Ali",  freelancer: "Lina Mansouri",  budget: "2,500 TND", status: "In Progress",  created: "2025-02-01" },
  { id: 2, name: "Mobile App UI",      client: "TechCorp SARL",  freelancer: "Omar Trabelsi",  budget: "4,000 TND", status: "Completed",     created: "2025-01-15" },
  { id: 3, name: "Logo Design",        client: "Sara Khemiri",   freelancer: "Ahmed Ben Ali",  budget: "800 TND",   status: "Disputed",      created: "2025-03-01" },
  { id: 4, name: "API Integration",    client: "Omar Trabelsi",  freelancer: "Lina Mansouri",  budget: "3,200 TND", status: "Escrow Funded", created: "2025-03-05" },
  { id: 5, name: "Landing Page",       client: "Ahmed Ben Ali",  freelancer: "—",              budget: "1,200 TND", status: "Pending",       created: "2025-03-10" },
];

const timelineSteps: Record<string, TimelineStep[]> = {
  "E-commerce Website": [
    { key: "invoice",   label: "Invoice",   icon: FileText,    date: "Feb 1",  status: "completed" },
    { key: "payment",   label: "Payment",   icon: CreditCard,  date: "Feb 1",  status: "completed" },
    { key: "started",   label: "Started",   icon: Rocket,      date: "Feb 2",  status: "completed" },
    { key: "submitted", label: "Submitted", icon: Upload,      date: "Feb 10", status: "active"    },
    { key: "outcome",   label: "Outcome",   icon: CheckCircle, date: "",       status: "pending"   },
    { key: "review",    label: "Review",    icon: Star,        date: "",       status: "pending"   },
  ],
  "Mobile App UI": [
    { key: "invoice",   label: "Invoice",   icon: FileText,    date: "Jan 15", status: "completed" },
    { key: "payment",   label: "Payment",   icon: CreditCard,  date: "Jan 15", status: "completed" },
    { key: "started",   label: "Started",   icon: Rocket,      date: "Jan 16", status: "completed" },
    { key: "submitted", label: "Submitted", icon: Upload,      date: "Feb 20", status: "completed" },
    { key: "outcome",   label: "Outcome",   icon: CheckCircle, date: "Feb 22", status: "completed" },
    { key: "review",    label: "Review",    icon: Star,        date: "Feb 22", status: "completed" },
  ],
  "Logo Design": [
    { key: "invoice",   label: "Invoice",   icon: FileText,    date: "Mar 1",  status: "completed" },
    { key: "payment",   label: "Payment",   icon: CreditCard,  date: "Mar 1",  status: "completed" },
    { key: "started",   label: "Started",   icon: Rocket,      date: "Mar 2",  status: "completed" },
    { key: "submitted", label: "Submitted", icon: Upload,      date: "Mar 5",  status: "completed" },
    { key: "outcome",   label: "Outcome",   icon: XCircle,     date: "Mar 6",  status: "disputed"  },
    { key: "review",    label: "Review",    icon: Star,        date: "",       status: "pending"   },
  ],
  "API Integration": [
    { key: "invoice",   label: "Invoice",   icon: FileText,    date: "Mar 5",  status: "completed" },
    { key: "payment",   label: "Payment",   icon: CreditCard,  date: "Mar 5",  status: "completed" },
    { key: "started",   label: "Started",   icon: Rocket,      date: "Mar 6",  status: "active"    },
    { key: "submitted", label: "Submitted", icon: Upload,      date: "",       status: "pending"   },
    { key: "outcome",   label: "Outcome",   icon: CheckCircle, date: "",       status: "pending"   },
    { key: "review",    label: "Review",    icon: Star,        date: "",       status: "pending"   },
  ],
  "Landing Page": [
    { key: "invoice",   label: "Invoice",   icon: FileText,    date: "Mar 10", status: "active"    },
    { key: "payment",   label: "Payment",   icon: CreditCard,  date: "",       status: "pending"   },
    { key: "started",   label: "Started",   icon: Rocket,      date: "",       status: "pending"   },
    { key: "submitted", label: "Submitted", icon: Upload,      date: "",       status: "pending"   },
    { key: "outcome",   label: "Outcome",   icon: CheckCircle, date: "",       status: "pending"   },
    { key: "review",    label: "Review",    icon: Star,        date: "",       status: "pending"   },
  ],
};



const statusStyle: Record<string, string> = {
  Completed:       "bg-success/10 text-success border-success/20",
  Disputed:        "bg-destructive/10 text-destructive border-destructive/20",
  "In Progress":   "bg-accent/10 text-accent border-accent/20",
  "Escrow Funded": "bg-primary/10 text-primary border-primary/20",
  Pending:         "bg-muted text-muted-foreground border-border",
};

const stepStyles: Record<StepStatus, { circle: string; icon: string; label: string }> = {
  completed: { circle: "bg-accent border-accent",                           icon: "text-white",            label: "text-foreground font-semibold" },
  active:    { circle: "bg-background border-accent ring-4 ring-accent/20", icon: "text-accent",           label: "text-accent font-semibold"     },
  pending:   { circle: "bg-background border-border",                       icon: "text-muted-foreground", label: "text-muted-foreground"         },
  disputed:  { circle: "bg-destructive border-destructive",                 icon: "text-white",            label: "text-destructive font-semibold"},
};



function InvoicePanel({ project }: { project: Project }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between rounded-lg border border-border bg-muted/30 px-4 py-3">
        <div>
          <p className="text-xs font-semibold text-foreground">
            Invoice #{project.id.toString().padStart(4, "0")}
          </p>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            {project.name} · {project.budget}
          </p>
        </div>
        <Button size="sm" variant="outline" className="gap-1.5 text-xs h-8">
          <Download className="h-3.5 w-3.5" /> Download PDF
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="rounded-lg border border-border px-3 py-2">
          <p className="text-muted-foreground">Client</p>
          <p className="font-medium mt-0.5">{project.client}</p>
        </div>
        <div className="rounded-lg border border-border px-3 py-2">
          <p className="text-muted-foreground">Freelancer</p>
          <p className="font-medium mt-0.5">{project.freelancer}</p>
        </div>
      </div>
    </div>
  );
}

function PaymentPanel({ project }: { project: Project }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3 rounded-lg border border-success/20 bg-success/5 px-4 py-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-success/10 shrink-0">
          <DollarSign className="h-4 w-4 text-success" />
        </div>
        <div className="flex-1">
          <p className="text-xs font-semibold text-foreground">Escrow Payment</p>
          <p className="text-[11px] text-muted-foreground">Funds held securely until project completion</p>
        </div>
        <p className="text-sm font-bold text-success">{project.budget}</p>
      </div>
      <div className="grid grid-cols-3 gap-2 text-xs">
        <div className="rounded-lg border border-border px-3 py-2 text-center">
          <p className="text-muted-foreground">Total</p>
          <p className="font-semibold mt-0.5">{project.budget}</p>
        </div>
        <div className="rounded-lg border border-border px-3 py-2 text-center">
          <p className="text-muted-foreground">Platform Fee</p>
          <p className="font-semibold mt-0.5">5%</p>
        </div>
        <div className="rounded-lg border border-border px-3 py-2 text-center">
          <p className="text-muted-foreground">Freelancer Gets</p>
          <p className="font-semibold mt-0.5 text-success">95%</p>
        </div>
      </div>
    </div>
  );
}

function StartedPanel({ project }: { project: Project }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3 rounded-lg border border-accent/20 bg-accent/5 px-4 py-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/10 shrink-0">
          <Rocket className="h-4 w-4 text-accent" />
        </div>
        <div>
          <p className="text-xs font-semibold text-foreground">Project Kicked Off</p>
          <p className="text-[11px] text-muted-foreground">
            {project.freelancer} accepted and started work
          </p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="rounded-lg border border-border px-3 py-2">
          <p className="text-muted-foreground">Started by</p>
          <p className="font-medium mt-0.5">{project.freelancer}</p>
        </div>
        <div className="rounded-lg border border-border px-3 py-2">
          <p className="text-muted-foreground">Project</p>
          <p className="font-medium mt-0.5 truncate">{project.name}</p>
        </div>
      </div>
    </div>
  );
}

function SubmittedPanel({ project, isActive }: { project: Project; isActive: boolean }) {
  if (!isActive) {
    return (
      <div className="rounded-lg border border-dashed border-border px-4 py-5 text-center">
        <Upload className="h-6 w-6 text-muted-foreground/40 mx-auto mb-1.5" />
        <p className="text-xs text-muted-foreground">Work not yet submitted</p>
      </div>
    );
  }

  const files = [
    { name: "design-final.fig", size: "4.2 MB" },
    { name: "assets.zip",       size: "12.8 MB" },
    { name: "README.md",        size: "3 KB" },
  ];

  return (
    <div className="space-y-2">
      <p className="text-[11px] text-muted-foreground">
        {project.freelancer} submitted the following deliverables:
      </p>
      <div className="space-y-1.5">
        {files.map((f) => (
          <div
            key={f.name}
            className="flex items-center justify-between rounded-lg border border-border bg-muted/30 px-3 py-2"
          >
            <div className="flex items-center gap-2">
              <FileText className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              <span className="text-xs text-foreground">{f.name}</span>
              <span className="text-[10px] text-muted-foreground/60">{f.size}</span>
            </div>
            <Button
              size="sm"
              variant="ghost"
              className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
            >
              <Download className="h-3.5 w-3.5" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

function OutcomePanel({ project, status }: { project: Project; status: StepStatus }) {
  if (status === "pending") {
    return (
      <div className="rounded-lg border border-dashed border-border px-4 py-5 text-center">
        <CheckCircle className="h-6 w-6 text-muted-foreground/40 mx-auto mb-1.5" />
        <p className="text-xs text-muted-foreground">Awaiting client decision</p>
      </div>
    );
  }

  if (status === "disputed") {
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-3 rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-destructive/10 shrink-0">
            <XCircle className="h-4 w-4 text-destructive" />
          </div>
          <div>
            <p className="text-xs font-semibold text-destructive">Dispute Opened</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              {project.client} raised a dispute on this project
            </p>
          </div>
        </div>
        <Button
          size="sm"
          variant="outline"
          className="w-full gap-1.5 text-xs border-destructive/30 text-destructive hover:bg-destructive/10 h-8"
        >
          <ExternalLink className="h-3.5 w-3.5" /> View Dispute Details
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 rounded-lg border border-success/20 bg-success/5 px-4 py-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-success/10 shrink-0">
        <CheckCircle className="h-4 w-4 text-success" />
      </div>
      <div>
        <p className="text-xs font-semibold text-success">Client Accepted</p>
        <p className="text-[11px] text-muted-foreground mt-0.5">
          Work approved · payment of {project.budget} released to {project.freelancer}
        </p>
      </div>
    </div>
  );
}

function ReviewPanel({ status }: { status: StepStatus }) {
  if (status !== "completed") {
    return (
      <div className="rounded-lg border border-dashed border-border px-4 py-5 text-center">
        <Star className="h-6 w-6 text-muted-foreground/40 mx-auto mb-1.5" />
        <p className="text-xs text-muted-foreground">Review not yet submitted</p>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 px-4 py-3">
      <div className="flex items-center gap-0.5 shrink-0">
        {[1, 2, 3, 4, 5].map((s) => (
          <Star key={s} className="h-4 w-4 fill-accent text-accent" />
        ))}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-foreground">Client left a review</p>
        <p className="text-[11px] text-muted-foreground mt-0.5 truncate">
          "Great work, delivered on time and exactly as expected."
        </p>
      </div>
      <Badge className="bg-success/10 text-success border-success/20 text-[10px] shrink-0">
        5 / 5
      </Badge>
    </div>
  );
}



function HorizontalTimeline({
  steps,
  activeStep,
  onStepClick,
}: {
  steps: TimelineStep[];
  activeStep: number;
  onStepClick: (i: number) => void;
}) {
  return (
    <div className="flex items-start justify-between relative px-2 py-3">
      {steps.map((step, i) => {
        const styles = stepStyles[step.status];
        const Icon = step.icon;
        const isLast = i === steps.length - 1;
        const isSelected = activeStep === i;

        return (
          <div key={i} className="flex flex-col items-center flex-1 relative">

            {/* Connector line between steps */}
            {!isLast && (
              <div
                className={`absolute top-5 h-0.5 ${
                  step.status === "completed" ? "bg-accent" : "bg-border"
                }`}
                style={{ left: "calc(50% + 20px)", right: "calc(-50% + 20px)" }}
              />
            )}

            {/* Step circle */}
            <button
              onClick={() => onStepClick(i)}
              className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all focus:outline-none
                ${styles.circle}
                ${isSelected ? "scale-110 shadow-md" : "hover:scale-105"}
              `}
            >
              <Icon className={`h-4 w-4 ${styles.icon}`} />
            </button>

            {/* Label + date */}
            <div className="mt-2 text-center">
              <p className={`text-[11px] ${styles.label} ${isSelected ? "underline underline-offset-2" : ""}`}>
                {step.label}
              </p>
              {step.date
                ? <p className="text-[10px] text-muted-foreground mt-0.5">{step.date}</p>
                : <p className="text-[10px] text-muted-foreground/40 mt-0.5">—</p>
              }
            </div>
          </div>
        );
      })}
    </div>
  );
}



const AdminProjects = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeStep, setActiveStep] = useState(0);

  const steps = selectedProject ? timelineSteps[selectedProject.name] ?? [] : [];
  const currentStep = steps[activeStep];

  const openProject = (project: Project) => {
    setSelectedProject(project);
    const s = timelineSteps[project.name] ?? [];
    const idx = s.findIndex((x) => x.status === "active" || x.status === "disputed");
    setActiveStep(idx >= 0 ? idx : s.length - 1);
  };

  return (
    <div className="p-6 space-y-6">

      {/* Page header */}
      <div>
        <h1 className="text-2xl font-heading font-bold text-foreground">Project Management</h1>
        <p className="text-muted-foreground text-sm">Monitor and manage all platform projects</p>
      </div>

      {/* Projects table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-heading">All Projects</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Freelancer</TableHead>
                <TableHead>Budget</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell>
                    <button
                      onClick={() => openProject(project)}
                      className="font-medium text-foreground hover:text-accent transition-colors text-left"
                    >
                      {project.name}
                    </button>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{project.client}</TableCell>
                  <TableCell className="text-muted-foreground">{project.freelancer}</TableCell>
                  <TableCell>{project.budget}</TableCell>
                  <TableCell>
                    <Badge className={statusStyle[project.status]}>{project.status}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{project.created}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => openProject(project)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Project detail dialog */}
      <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
        <DialogContent className="max-w-2xl gap-0 p-0">

          {/* Fixed header */}
          <div className="px-6 pt-6 pb-4 border-b border-border">
            <DialogHeader>
              <DialogTitle className="font-heading flex items-center justify-between">
                <span>{selectedProject?.name}</span>
                <Badge className={statusStyle[selectedProject?.status ?? "Pending"]}>
                  {selectedProject?.status}
                </Badge>
              </DialogTitle>
            </DialogHeader>
          </div>

          {/* Timeline */}
          <div className="px-4 border-b border-border bg-muted/20">
            <HorizontalTimeline
              steps={steps}
              activeStep={activeStep}
              onStepClick={setActiveStep}
            />
          </div>

          {/* Step detail panel */}
          <div className="px-6 py-5 min-h-[150px]">
            {currentStep && selectedProject && (
              <>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  {currentStep.label} Details
                </p>
                {currentStep.key === "invoice"   && <InvoicePanel   project={selectedProject} />}
                {currentStep.key === "payment"   && <PaymentPanel   project={selectedProject} />}
                {currentStep.key === "started"   && <StartedPanel   project={selectedProject} />}
                {currentStep.key === "submitted" && <SubmittedPanel project={selectedProject} isActive={currentStep.status !== "pending"} />}
                {currentStep.key === "outcome"   && <OutcomePanel   project={selectedProject} status={currentStep.status} />}
                {currentStep.key === "review"    && <ReviewPanel    status={currentStep.status} />}
              </>
            )}
          </div>

        </DialogContent>
      </Dialog>

    </div>
  );
};

export default AdminProjects;