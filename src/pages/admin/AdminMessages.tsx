import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Flag, Search, Briefcase, User, AlertTriangle, MessageSquare } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Message {
  id: number; sender: string; text: string; time: string;
  flagged?: boolean; flagReason?: string;
}

interface Conversation {
  id: string; projectId: number; projectName: string; projectStatus: string;
  participants: [string, string]; avatars: [string, string];
  messages: Message[]; lastDate: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const conversations: Conversation[] = [
  {
    id: "conv-1", projectId: 1, projectName: "E-commerce Website", projectStatus: "In Progress",
    participants: ["Ahmed Ben Ali", "Lina Mansouri"],
    avatars: ["https://i.pravatar.cc/40?u=ahmed", "https://i.pravatar.cc/40?u=lina"],
    lastDate: "2025-03-10",
    messages: [
      { id: 1, sender: "Ahmed Ben Ali", text: "Hey Lina, I've reviewed the mockups and they look great!", time: "10:02 AM" },
      { id: 2, sender: "Lina Mansouri", text: "Thanks! I can start the development phase next week.",    time: "10:05 AM" },
      { id: 3, sender: "Ahmed Ben Ali", text: "Perfect. Let's align on the timeline first.",              time: "10:08 AM" },
      { id: 4, sender: "Lina Mansouri", text: "Sure. I'll prepare a detailed plan and share it by EOD.", time: "10:10 AM" },
    ],
  },
  {
    id: "conv-2", projectId: 2, projectName: "Mobile App UI", projectStatus: "Completed",
    participants: ["TechCorp SARL", "Omar Trabelsi"],
    avatars: ["https://i.pravatar.cc/40?u=techcorp", "https://i.pravatar.cc/40?u=omar"],
    lastDate: "2025-03-09",
    messages: [
      { id: 1, sender: "TechCorp SARL",  text: "Omar, can you send us your portfolio?",                              time: "2:00 PM" },
      { id: 2, sender: "Omar Trabelsi",  text: "Sure! Also here's my WhatsApp: +216 55 123 456 for faster replies.", time: "2:05 PM", flagged: true, flagReason: "WhatsApp number shared" },
      { id: 3, sender: "TechCorp SARL",  text: "Please keep all communication on the platform.",                     time: "2:10 PM" },
    ],
  },
  {
    id: "conv-3", projectId: 3, projectName: "Logo Design", projectStatus: "Disputed",
    participants: ["Sara Khemiri", "Ahmed Ben Ali"],
    avatars: ["https://i.pravatar.cc/40?u=sara", "https://i.pravatar.cc/40?u=ahmed"],
    lastDate: "2025-03-08",
    messages: [
      { id: 1, sender: "Sara Khemiri",  text: "Ahmed the payment is ready.",                            time: "9:00 AM" },
      { id: 2, sender: "Sara Khemiri",  text: "Let's settle this outside the platform to avoid fees.", time: "9:01 AM", flagged: true, flagReason: "Attempted off-platform payment" },
      { id: 3, sender: "Ahmed Ben Ali", text: "I prefer we keep it through the platform for security.", time: "9:15 AM" },
      { id: 4, sender: "Sara Khemiri",  text: "Fine. But I'm opening a dispute then.",                  time: "9:20 AM" },
    ],
  },
  {
    id: "conv-4", projectId: 4, projectName: "API Integration", projectStatus: "Escrow Funded",
    participants: ["Omar Trabelsi", "Lina Mansouri"],
    avatars: ["https://i.pravatar.cc/40?u=omar", "https://i.pravatar.cc/40?u=lina"],
    lastDate: "2025-03-07",
    messages: [
      { id: 1, sender: "Omar Trabelsi", text: "Lina, the API endpoints are ready for testing.", time: "11:00 AM" },
      { id: 2, sender: "Lina Mansouri", text: "Great, I'll test them today.",                   time: "11:05 AM" },
      { id: 3, sender: "Omar Trabelsi", text: "Let me know if you find any issues.",            time: "11:10 AM" },
    ],
  },
  {
    id: "conv-5", projectId: 5, projectName: "Landing Page", projectStatus: "Pending",
    participants: ["Ahmed Ben Ali", "Omar Trabelsi"],
    avatars: ["https://i.pravatar.cc/40?u=ahmed", "https://i.pravatar.cc/40?u=omar"],
    lastDate: "2025-03-08",
    messages: [
      { id: 1, sender: "Ahmed Ben Ali", text: "Omar, please send the final deliverables when ready.", time: "3:00 PM" },
      { id: 2, sender: "Omar Trabelsi", text: "Will do! Almost finished.",                            time: "3:30 PM" },
      { id: 3, sender: "Ahmed Ben Ali", text: "No rush, take your time.",                             time: "3:35 PM" },
    ],
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const hasFlagged    = (c: Conversation) => c.messages.some((m) => m.flagged);
const flaggedCount  = (c: Conversation) => c.messages.filter((m) => m.flagged).length;
const getLastMsg    = (c: Conversation) => c.messages[c.messages.length - 1];

// ─── ConversationItem ─────────────────────────────────────────────────────────

function ConversationItem({ conv, selected, onClick }: {
  conv: Conversation; selected: boolean; onClick: () => void;
}) {
  const last    = getLastMsg(conv);
  const flagged = hasFlagged(conv);

  return (
    <button onClick={onClick}
      className={`w-full text-left px-4 py-3 border-b border-border transition-colors hover:bg-muted/50
        ${selected ? "bg-accent/10 border-l-2 border-l-accent" : ""}
        ${flagged && !selected ? "bg-destructive/5" : ""}`}
    >
      <div className="flex items-start gap-3">
        <div className="relative shrink-0 h-10 w-10">
          <Avatar className="h-7 w-7 absolute top-0 left-0 ring-2 ring-background">
            <AvatarImage src={conv.avatars[0]} />
            <AvatarFallback className="text-[10px]">{conv.participants[0][0]}</AvatarFallback>
          </Avatar>
          <Avatar className="h-7 w-7 absolute bottom-0 right-0 ring-2 ring-background">
            <AvatarImage src={conv.avatars[1]} />
            <AvatarFallback className="text-[10px]">{conv.participants[1][0]}</AvatarFallback>
          </Avatar>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-0.5">
            <p className="text-xs font-semibold truncate">{conv.participants[0]} &amp; {conv.participants[1]}</p>
            <span className="text-[10px] text-muted-foreground shrink-0 ml-2">{conv.lastDate}</span>
          </div>
          <div className="flex items-center gap-1 mb-1">
            <Briefcase className="h-3 w-3 text-muted-foreground/60" />
            <span className="text-[10px] text-muted-foreground/70 truncate">{conv.projectName}</span>
            {conv.projectStatus === "Disputed" && (
              <Badge className="bg-destructive/10 text-destructive border-destructive/20 text-[9px] px-1 py-0 ml-1">Disputed</Badge>
            )}
          </div>
          <p className="text-[11px] text-muted-foreground truncate">{last.text}</p>
        </div>
        {flagged && (
          <span className="shrink-0 flex items-center justify-center h-5 w-5 rounded-full bg-destructive">
            <Flag className="h-3 w-3 text-white" />
          </span>
        )}
      </div>
    </button>
  );
}

// ─── MessageBubble ────────────────────────────────────────────────────────────

function MessageBubble({ msg, isFirst }: { msg: Message; isFirst: boolean }) {
  return (
    <div className="space-y-1">
      {isFirst && <p className="text-[10px] text-muted-foreground px-1">{msg.sender}</p>}
      <div className={`relative max-w-[80%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed
        ${msg.flagged ? "bg-destructive/10 border border-destructive/30" : "bg-muted"}`}
      >
        {msg.text}
        <span className="block text-[10px] text-muted-foreground/60 mt-1 text-right">{msg.time}</span>
        {msg.flagged && (
          <div className="flex items-center gap-1 mt-1.5 pt-1.5 border-t border-destructive/20">
            <AlertTriangle className="h-3 w-3 text-destructive shrink-0" />
            <span className="text-[10px] text-destructive font-medium">{msg.flagReason}</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── ConversationView ─────────────────────────────────────────────────────────

function ConversationView({ conv }: { conv: Conversation }) {
  const fCount  = flaggedCount(conv);
  const grouped = conv.messages.map((msg, i) => ({
    ...msg,
    isFirst: i === 0 || conv.messages[i - 1].sender !== msg.sender,
  }));

  return (
    <div className="flex flex-col h-full">
      <div className="px-5 py-4 border-b border-border shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-heading font-semibold text-sm">
              {conv.participants[0]} &amp; {conv.participants[1]}
            </h3>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Briefcase className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">{conv.projectName}</span>
              {conv.projectStatus === "Disputed" && (
                <Badge className="bg-destructive/10 text-destructive border-destructive/20 text-[10px]">Disputed</Badge>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-[10px] gap-1">
              <User className="h-3 w-3" />{conv.messages.length} messages
            </Badge>
            {fCount > 0 && (
              <Badge className="bg-destructive/10 text-destructive border-destructive/20 text-[10px] gap-1">
                <Flag className="h-3 w-3" />{fCount} flagged
              </Badge>
            )}
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
        {grouped.map((msg) => (
          <div key={msg.id} className="flex flex-col">
            <MessageBubble msg={msg} isFirst={msg.isFirst} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

const AdminMessages = () => {
  const [searchParams]  = useSearchParams();
  const [search, setSearch]     = useState("");
  const [tab, setTab]           = useState<"all" | "flagged">("all");
  const [selected, setSelected] = useState<Conversation>(conversations[0]);

  // Auto-select from ?conversationId (coming from AdminProjects or AdminDisputes)
  useEffect(() => {
    const id = searchParams.get("conversationId");
    if (id) {
      const conv = conversations.find((c) => c.id === id);
      if (conv) {
        setSelected(conv);
        if (hasFlagged(conv)) setTab("flagged");
      }
    }
  }, [searchParams]);

  const totalFlagged = conversations.filter(hasFlagged).length;

  const filtered = useMemo(() => {
    const q    = search.toLowerCase();
    const list = tab === "flagged" ? conversations.filter(hasFlagged) : conversations;
    if (!q) return list;
    return list.filter((c) =>
      c.participants.some((p) => p.toLowerCase().includes(q)) ||
      c.projectName.toLowerCase().includes(q) ||
      c.messages.some((m) => m.text.toLowerCase().includes(q))
    );
  }, [search, tab]);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold">Messages</h1>
        <p className="text-muted-foreground text-sm">Monitor all platform conversations</p>
      </div>

      <Card className="overflow-hidden">
        <div className="flex h-[calc(100vh-180px)]">

          {/* Left */}
          <div className="w-80 shrink-0 flex flex-col border-r border-border">
            <div className="p-3 border-b border-border space-y-2 shrink-0">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input value={search} onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by user or project..." className="pl-8 h-8 text-xs" />
              </div>
              <Tabs value={tab} onValueChange={(v) => setTab(v as "all" | "flagged")}>
                <TabsList className="w-full h-7">
                  <TabsTrigger value="all" className="flex-1 text-[11px]">All ({conversations.length})</TabsTrigger>
                  <TabsTrigger value="flagged" className="flex-1 text-[11px] gap-1">
                    <Flag className="h-3 w-3" />Flagged ({totalFlagged})
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <div className="flex-1 overflow-y-auto">
              {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center px-4">
                  <Search className="h-8 w-8 text-muted-foreground/30 mb-2" />
                  <p className="text-xs text-muted-foreground">No conversations found</p>
                </div>
              ) : (
                filtered.map((conv) => (
                  <ConversationItem key={conv.id} conv={conv}
                    selected={selected?.id === conv.id} onClick={() => setSelected(conv)} />
                ))
              )}
            </div>
          </div>

          {/* Right */}
          <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
            {selected ? <ConversationView conv={selected} /> : (
              <div className="flex flex-col items-center justify-center h-full text-center px-6">
                <MessageSquare className="h-10 w-10 text-muted-foreground/20 mb-3" />
                <p className="text-sm text-muted-foreground">Select a conversation to view</p>
              </div>
            )}
          </div>

        </div>
      </Card>
    </div>
  );
};

export default AdminMessages;