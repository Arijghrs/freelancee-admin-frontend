import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Briefcase, Search as SearchIcon, MapPin, DollarSign, Trash2, Flag, AlertTriangle, Phone, Mail, MessageSquare } from "lucide-react";



type FlagReason = "phone" | "email" | "whatsapp" | "other";

interface Flag {
  reason: FlagReason;
  detail: string;
}

interface Post {
  id: string;
  author: { name: string; avatar: string; role: "client" | "freelancer"; title: string };
  content: string;
  type: "hiring" | "looking";
  category: string;
  tags: string[];
  budget?: string;
  location?: string;
  timeAgo: string;
  flag?: Flag;
}



const FLAG_LABELS: Record<FlagReason, { label: string; icon: React.ElementType; color: string }> = {
  phone:    { label: "Phone number shared",    icon: Phone,          color: "text-orange-500" },
  email:    { label: "Email address shared",   icon: Mail,           color: "text-yellow-500" },
  whatsapp: { label: "WhatsApp link shared",   icon: MessageSquare,  color: "text-green-600"  },
  other:    { label: "Policy violation",       icon: AlertTriangle,  color: "text-destructive" },
};

function highlightContact(content: string) {
  // Highlight emails, phone numbers, and WhatsApp links
  const patterns = [
    { regex: /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g,     className: "bg-yellow-200 text-yellow-900 dark:bg-yellow-900/40 dark:text-yellow-300 rounded px-0.5" },
    { regex: /(\+?[\d\s\-().]{7,})/g,                                   className: "bg-orange-200 text-orange-900 dark:bg-orange-900/40 dark:text-orange-300 rounded px-0.5" },
    { regex: /(wa\.me\/[^\s]+|whatsapp[^\s]*)/gi,                       className: "bg-green-200 text-green-900 dark:bg-green-900/40 dark:text-green-300 rounded px-0.5" },
  ];

  // Split and highlight
  let parts: { text: string; className?: string }[] = [{ text: content }];
  for (const { regex, className } of patterns) {
    parts = parts.flatMap((part) => {
      if (part.className) return [part];
      const segments: { text: string; className?: string }[] = [];
      let last = 0;
      let match;
      regex.lastIndex = 0;
      while ((match = regex.exec(part.text)) !== null) {
        if (match.index > last) segments.push({ text: part.text.slice(last, match.index) });
        segments.push({ text: match[0], className });
        last = match.index + match[0].length;
      }
      if (last < part.text.length) segments.push({ text: part.text.slice(last) });
      return segments.length ? segments : [part];
    });
  }
  return parts;
}



const initialPosts: Post[] = [
  {
    id: "1",
    author: { name: "Sarah Chen", avatar: "https://i.pravatar.cc/150?u=sarah", role: "client", title: "CEO at TechStart" },
    content: "Looking for a senior React developer to help build our new SaaS dashboard. Must have experience with TypeScript, Tailwind CSS, and data visualization. 3-month contract with possibility of extension.",
    type: "hiring", category: "Job Search",
    tags: ["React", "TypeScript", "Tailwind"], budget: "$80-120/hr", location: "Remote", timeAgo: "2h ago",
  },
  {
    id: "2",
    author: { name: "Alex Rivera", avatar: "https://i.pravatar.cc/150?u=alex", role: "freelancer", title: "Full Stack Developer" },
    content: "Available for new projects! Contact me at alex.rivera@gmail.com or +1 (555) 234-5678 for quick replies. Specialized in React, Node.js, and PostgreSQL.",
    type: "looking", category: "Freelancing",
    tags: ["React", "Node.js", "PostgreSQL"], location: "New York, US", timeAgo: "5h ago",
    flag: { reason: "email", detail: "Shared personal email: alex.rivera@gmail.com" },
  },
  {
    id: "3",
    author: { name: "Emily Watts", avatar: "https://i.pravatar.cc/150?u=emily", role: "client", title: "Product Manager" },
    content: "We need a UI/UX designer to redesign our mobile app. Reach us on WhatsApp: wa.me/15550001234 — Looking for someone with strong portfolio in fintech.",
    type: "hiring", category: "Job Search",
    tags: ["UI/UX", "Mobile", "Fintech"], budget: "$5,000 - $8,000", location: "Remote", timeAgo: "8h ago",
    flag: { reason: "whatsapp", detail: "WhatsApp link detected in post body" },
  },
  {
    id: "4",
    author: { name: "Jordan Lee", avatar: "https://i.pravatar.cc/150?u=jordan", role: "freelancer", title: "Mobile Developer" },
    content: "iOS & Android developer open to remote work. Call me at +44 7700 900123 to discuss your project. 6 years experience building native and cross-platform apps.",
    type: "looking", category: "Freelancing",
    tags: ["iOS", "Android", "Flutter"], location: "London, UK", timeAgo: "1d ago",
    flag: { reason: "phone", detail: "Phone number shared: +44 7700 900123" },
  },
];



function FlagBanner({ flag }: { flag: Flag }) {
  const { label, icon: Icon, color } = FLAG_LABELS[flag.reason];
  return (
    <div className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 mb-4">
      <Flag className="h-3.5 w-3.5 text-destructive mt-0.5 shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-semibold text-destructive">Flagged Post</span>
          <span className="text-muted-foreground text-[10px]">·</span>
          <Icon className={`h-3 w-3 ${color}`} />
          <span className={`text-[11px] font-medium ${color}`}>{label}</span>
        </div>
        <p className="text-[11px] text-muted-foreground mt-0.5 truncate">{flag.detail}</p>
      </div>
    </div>
  );
}



function PostCard({ post, onDelete }: { post: Post; onDelete: (id: string) => void }) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const navigate = useNavigate();
  const contentParts = post.flag ? highlightContact(post.content) : null;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className={`feed-card relative ${post.flag ? "border-destructive/40 border" : ""}`}
      >
        {/* Flagged stripe */}
        {post.flag && (
          <div className="absolute top-0 left-0 bottom-0 w-1 rounded-l-xl bg-destructive" />
        )}

        <div className={post.flag ? "pl-3" : ""}>
          {/* Flag banner */}
          {post.flag && <FlagBanner flag={post.flag} />}

          {/* Author */}
          <div className="flex items-start gap-3 mb-4">
            <div className="relative">
              <Avatar className="h-11 w-11 ring-2 ring-border">
                <AvatarImage src={post.author.avatar} />
                <AvatarFallback>{post.author.name[0]}</AvatarFallback>
              </Avatar>
              {post.flag && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive">
                  <Flag className="h-2.5 w-2.5 text-white" />
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className="font-heading font-semibold text-sm cursor-pointer hover:text-primary hover:underline transition-colors"
                  onClick={() => navigate("/profile")}
                >
                  {post.author.name}
                </span>
                <Badge
                  variant={post.author.role === "client" ? "default" : "secondary"}
                  className={post.author.role === "client"
                    ? "bg-primary text-primary-foreground text-[10px]"
                    : "bg-accent text-accent-foreground text-[10px]"}
                >
                  {post.author.role === "client" ? "Client" : "Freelancer"}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">{post.author.title}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <p className="text-[11px] text-muted-foreground/60">{post.timeAgo}</p>
                <Badge variant="outline" className="text-[9px] px-1.5 py-0">{post.category}</Badge>
              </div>
            </div>

            {/* Type badge */}
            <Badge
              variant="outline"
              className={post.type === "hiring"
                ? "border-accent text-accent text-[10px] gap-1 shrink-0"
                : "border-success text-success text-[10px] gap-1 shrink-0"}
            >
              {post.type === "hiring" ? <Briefcase className="h-3 w-3" /> : <SearchIcon className="h-3 w-3" />}
              {post.type === "hiring" ? "Hiring" : "Looking for Work"}
            </Badge>
          </div>

          {/* Content — highlighted if flagged */}
          <p className="text-sm leading-relaxed mb-3">
            {contentParts
              ? contentParts.map((part, i) =>
                  part.className
                    ? <mark key={i} className={part.className}>{part.text}</mark>
                    : <span key={i}>{part.text}</span>
                )
              : post.content}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-3">
            {post.tags.map((tag) => (
              <span key={tag} className="profile-badge bg-secondary text-secondary-foreground">{tag}</span>
            ))}
          </div>

          {/* Meta */}
          <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
            {post.budget   && <span className="flex items-center gap-1"><DollarSign className="h-3 w-3" />{post.budget}</span>}
            {post.location && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{post.location}</span>}
          </div>

          {/* Delete row */}
          <div className="flex justify-end border-t border-border pt-3">
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5 text-xs text-muted-foreground hover:text-destructive"
              onClick={() => setConfirmOpen(true)}
            >
              <Trash2 className="h-4 w-4" />
              Delete Post
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Confirm delete dialog */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-heading">Delete Post</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this post? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>Cancel</Button>
            <Button
              variant="destructive"
              onClick={() => { onDelete(post.id); setConfirmOpen(false); }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}



export default function Feed() {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [filter, setFilter] = useState<"all" | "flagged">("all");

  const flaggedCount = posts.filter((p) => p.flag).length;
  const displayed = filter === "flagged" ? posts.filter((p) => p.flag) : posts;

  const handleDelete = (id: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">

      {/* Header */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-start justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold mb-1">Feed</h1>
          <p className="text-sm text-muted-foreground">Manage all published posts</p>
        </div>
        {flaggedCount > 0 && (
          <div className="flex items-center gap-1.5 rounded-lg bg-destructive/10 border border-destructive/20 px-3 py-1.5">
            <Flag className="h-3.5 w-3.5 text-destructive" />
            <span className="text-xs font-semibold text-destructive">{flaggedCount} flagged</span>
          </div>
        )}
      </motion.div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Total Posts",  value: posts.length,                              color: "text-foreground"   },
          { label: "Hiring",       value: posts.filter((p) => p.type === "hiring").length,  color: "text-accent"      },
          { label: "Looking",      value: posts.filter((p) => p.type === "looking").length, color: "text-primary"     },
        ].map(({ label, value, color }) => (
          <div key={label} className="rounded-xl border border-border bg-card p-4 text-center">
            <p className={`text-2xl font-bold font-heading ${color}`}>{value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2">
        <Button
          size="sm"
          variant={filter === "all" ? "default" : "outline"}
          className="text-xs"
          onClick={() => setFilter("all")}
        >
          All Posts
        </Button>
        <Button
          size="sm"
          variant={filter === "flagged" ? "destructive" : "outline"}
          className="text-xs gap-1.5"
          onClick={() => setFilter("flagged")}
        >
          <Flag className="h-3.5 w-3.5" />
          Flagged {flaggedCount > 0 && <span className="ml-0.5">({flaggedCount})</span>}
        </Button>
      </div>

      {/* Posts */}
      <AnimatePresence>
        {displayed.length === 0 ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm text-muted-foreground text-center py-12"
          >
            {filter === "flagged" ? "No flagged posts." : "No posts yet."}
          </motion.p>
        ) : (
          <div className="space-y-4">
            {displayed.map((post) => (
              <PostCard key={post.id} post={post} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}