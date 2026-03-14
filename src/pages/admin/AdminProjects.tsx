import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Eye, Clock } from "lucide-react";

const projects = [
  { id: 1, name: "E-commerce Website", client: "Ahmed Ben Ali", freelancer: "Lina Mansouri", budget: "2,500 TND", status: "In Progress", created: "2025-02-01" },
  { id: 2, name: "Mobile App UI", client: "TechCorp SARL", freelancer: "Omar Trabelsi", budget: "4,000 TND", status: "Completed", created: "2025-01-15" },
  { id: 3, name: "Logo Design", client: "Sara Khemiri", freelancer: "Ahmed Ben Ali", budget: "800 TND", status: "Disputed", created: "2025-03-01" },
  { id: 4, name: "API Integration", client: "Omar Trabelsi", freelancer: "Lina Mansouri", budget: "3,200 TND", status: "Escrow Funded", created: "2025-03-05" },
  { id: 5, name: "Landing Page", client: "Ahmed Ben Ali", freelancer: "—", budget: "1,200 TND", status: "Pending", created: "2025-03-10" },
];

const timelineData: Record<string, { date: string; event: string }[]> = {
  "E-commerce Website": [
    { date: "Feb 1", event: "Project created" },
    { date: "Feb 1", event: "Client paid 2,500 TND to escrow" },
    { date: "Feb 2", event: "Freelancer accepted project" },
    { date: "Feb 10", event: "Milestone 1 submitted" },
    { date: "Feb 12", event: "Client approved milestone 1" },
  ],
  "Mobile App UI": [
    { date: "Jan 15", event: "Project created" },
    { date: "Jan 15", event: "Client paid 4,000 TND to escrow" },
    { date: "Jan 16", event: "Freelancer accepted project" },
    { date: "Feb 20", event: "Freelancer submitted final work" },
    { date: "Feb 22", event: "Client approved work" },
    { date: "Feb 22", event: "Payment released to freelancer" },
  ],
  "Logo Design": [
    { date: "Mar 1", event: "Project created" },
    { date: "Mar 1", event: "Client paid 800 TND to escrow" },
    { date: "Mar 2", event: "Freelancer accepted project" },
    { date: "Mar 5", event: "Freelancer submitted work" },
    { date: "Mar 6", event: "Client opened dispute" },
  ],
  "API Integration": [
    { date: "Mar 5", event: "Project created" },
    { date: "Mar 5", event: "Client paid 3,200 TND to escrow" },
    { date: "Mar 6", event: "Freelancer accepted project" },
  ],
  "Landing Page": [
    { date: "Mar 10", event: "Project created" },
    { date: "Mar 10", event: "Waiting for freelancer" },
  ],
};

const AdminProjects = () => {
  const [selectedProject, setSelectedProject] = useState<typeof projects[0] | null>(null);

  const timeline = selectedProject ? timelineData[selectedProject.name] || [] : [];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold text-foreground">Project Management</h1>
        <p className="text-muted-foreground text-sm">Monitor and manage all platform projects</p>
      </div>

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
                      onClick={() => setSelectedProject(project)}
                      className="font-medium text-foreground hover:text-accent transition-colors text-left"
                    >
                      {project.name}
                    </button>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{project.client}</TableCell>
                  <TableCell className="text-muted-foreground">{project.freelancer}</TableCell>
                  <TableCell>{project.budget}</TableCell>
                  <TableCell>
                    <Badge className={
                      project.status === "Completed" ? "bg-success/10 text-success border-success/20" :
                      project.status === "Disputed" ? "bg-destructive/10 text-destructive border-destructive/20" :
                      project.status === "In Progress" ? "bg-accent/10 text-accent border-accent/20" :
                      project.status === "Escrow Funded" ? "bg-primary/10 text-primary border-primary/20" :
                      "bg-muted text-muted-foreground border-border"
                    }>{project.status}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{project.created}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => setSelectedProject(project)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-heading">{selectedProject?.name}</DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-4 text-sm mb-4">
            <div><span className="text-muted-foreground">Client:</span> <span className="font-medium">{selectedProject?.client}</span></div>
            <div><span className="text-muted-foreground">Freelancer:</span> <span className="font-medium">{selectedProject?.freelancer}</span></div>
            <div><span className="text-muted-foreground">Budget:</span> <span className="font-medium">{selectedProject?.budget}</span></div>
            <div><span className="text-muted-foreground">Status:</span>{" "}
              <Badge className={
                selectedProject?.status === "Completed" ? "bg-success/10 text-success border-success/20" :
                selectedProject?.status === "Disputed" ? "bg-destructive/10 text-destructive border-destructive/20" :
                "bg-accent/10 text-accent border-accent/20"
              }>{selectedProject?.status}</Badge>
            </div>
          </div>

          <div>
            <h3 className="font-heading font-semibold text-sm mb-4 flex items-center gap-2">
              <Clock className="h-4 w-4 text-accent" />
              Activity Timeline
            </h3>
            <div className="relative pl-6 space-y-4">
              <div className="absolute left-2 top-1 bottom-1 w-0.5 bg-border" />
              {timeline.map((item, i) => (
                <div key={i} className="relative">
                  <div className="absolute -left-4 top-1.5 h-2.5 w-2.5 rounded-full bg-accent border-2 border-background" />
                  <div>
                    <p className="text-sm text-foreground">{item.event}</p>
                    <p className="text-xs text-muted-foreground">{item.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminProjects;
