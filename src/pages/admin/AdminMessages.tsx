import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Flag } from "lucide-react";

const allMessages = [
  { id: 1, from: "Ahmed Ben Ali", to: "Lina Mansouri", preview: "Hey, I've reviewed the mockups and...", date: "2025-03-10", flagged: false },
  { id: 2, from: "Omar Trabelsi", to: "Sara Khemiri", preview: "Can we discuss the API specs?", date: "2025-03-10", flagged: false },
  { id: 3, from: "Lina Mansouri", to: "TechCorp SARL", preview: "Here's my WhatsApp number 55...", date: "2025-03-09", flagged: true },
  { id: 4, from: "Sara Khemiri", to: "Ahmed Ben Ali", preview: "The payment is ready, let's talk outside...", date: "2025-03-08", flagged: true },
  { id: 5, from: "TechCorp SARL", to: "Omar Trabelsi", preview: "Please send the final deliverables", date: "2025-03-08", flagged: false },
  { id: 6, from: "Ahmed Ben Ali", to: "Omar Trabelsi", preview: "I'll pay you directly via transfer...", date: "2025-03-07", flagged: true },
];

const flaggedMessages = allMessages.filter((m) => m.flagged);

const MessageTable = ({ messages }: { messages: typeof allMessages }) => (
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>From</TableHead>
        <TableHead>To</TableHead>
        <TableHead>Message</TableHead>
        <TableHead>Date</TableHead>
        <TableHead>Status</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {messages.map((m) => (
        <TableRow key={m.id}>
          <TableCell className="font-medium">{m.from}</TableCell>
          <TableCell className="text-muted-foreground">{m.to}</TableCell>
          <TableCell className="text-muted-foreground max-w-[250px] truncate">{m.preview}</TableCell>
          <TableCell className="text-muted-foreground">{m.date}</TableCell>
          <TableCell>
            {m.flagged ? (
              <Badge className="bg-destructive/10 text-destructive border-destructive/20 gap-1">
                <Flag className="h-3 w-3" />Flagged
              </Badge>
            ) : (
              <Badge variant="outline">Normal</Badge>
            )}
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);

const AdminMessages = () => {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold text-foreground">Messages</h1>
        <p className="text-muted-foreground text-sm">Monitor platform communications</p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">All Messages</TabsTrigger>
              <TabsTrigger value="flagged" className="gap-1.5">
                <Flag className="h-3.5 w-3.5" />Flagged ({flaggedMessages.length})
              </TabsTrigger>
            </TabsList>
            <TabsContent value="all"><MessageTable messages={allMessages} /></TabsContent>
            <TabsContent value="flagged"><MessageTable messages={flaggedMessages} /></TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminMessages;
