import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import {
  Briefcase, Search as SearchIcon, MapPin, DollarSign, Trash2,
  Flag, AlertTriangle, Phone, Mail, MessageSquare, ChevronDown, ChevronUp,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type FlagReason = "phone" | "email" | "whatsapp" | "other";

interface Flag {
  reason: FlagReason;
  detail: string;
}

interface Comment {
  id: string;
  author: string;
  avatar: string;
  text: string;
  timeAgo: string;
  flag?: Flag;
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
  comments: Comment[];
}

// ─── Config ───────────────────────────────────────────────────────────────────

const FLAG_LABELS: Record<FlagReason, { label: string; icon: React.ElementType; color: string }> = {
  phone:    { label: "Phone number shared",  icon: Phone,         color: "text-orange-500"  },
  email:    { label: "Email address shared", icon: Mail,          color: "text-yellow-500"  },
  whatsapp: { label: "WhatsApp link shared", icon: MessageSquare, color: "text-green-600"   },
  other:    { label: "Policy violation",     icon: AlertTriangle, color: "text-destructive" },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function highlightContact(content: string) {
  const patterns = [
    { regex: /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g, className: "bg-yellow-200 text-yellow-900 dark:bg-yellow-900/40 dark:text-yellow-300 rounded px-0.5" },
    { regex: /(\+?[\d\s\-().]{7,})/g,                               className: "bg-orange-200 text-orange-900 dark:bg-orange-900/40 dark:text-orange-300 rounded px-0.5" },
    { regex: /(wa\.me\/[^\s]+|whatsapp[^\s]*)/gi,                   className: "bg-green-200 text-green-900 dark:bg-green-900/40 dark:text-green-300 rounded px-0.5"   },
  ];
  let parts: { text: string; className?: string }[] = [{ text: content }];
  for (const { regex, className } of patterns) {
    parts = parts.flatMap((part) => {
      if (part.className) return [part];
      const segments: { text: string; className?: string }[] = [];
      let last = 0; let match;
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

// ─── Mock data ────────────────────────────────────────────────────────────────

const initialPosts: Post[] = [
  {
    id: "1",
    author: { name: "Sarah Chen", avatar: "https://i.pravatar.cc/150?u=sarah", role: "client", title: "CEO at TechStart" },
    content: "Looking for a senior React developer to help build our new SaaS dashboard. Must have experience with TypeScript, Tailwind CSS, and data visualization. 3-month contract with possibility of extension.",
    type: "hiring", category: "Job Search",
    tags: ["React", "TypeScript", "Tailwind"], budget: "$80-120/hr", location: "Remote", timeAgo: "2h ago",
    comments: [
      { id: "c1", author: "Alex Rivera", avatar: "https://i.pravatar.cc/150?u=alex", text: "Interested! I have 5+ years of React experience.", timeAgo: "1h ago" },
      { id: "c2", author: "Mia Johnson",  avatar: "https://i.pravatar.cc/150?u=mia",  text: "This sounds great! DM me at mia@gmail.com to discuss.", timeAgo: "45m ago",
        flag: { reason: "email", detail: "Personal email shared: mia@gmail.com" } },
    ],
  },
  {
    id: "2",
    author: { name: "Alex Rivera", avatar: "https://i.pravatar.cc/150?u=alex", role: "freelancer", title: "Full Stack Developer" },
    content: "Available for new projects! Contact me at alex.rivera@gmail.com or +1 (555) 234-5678 for quick replies. Specialized in React, Node.js, and PostgreSQL.",
    type: "looking", category: "Freelancing",
    tags: ["React", "Node.js", "PostgreSQL"], location: "New York, US", timeAgo: "5h ago",
    flag: { reason: "email", detail: "Shared personal email: alex.rivera@gmail.com" },
    comments: [
      { id: "c3", author: "Jordan Lee", avatar: "https://i.pravatar.cc/150?u=jordan", text: "Great profile! What's your hourly rate?", timeAgo: "3h ago" },
    ],
  },
  {
    id: "3",
    author: { name: "Emily Watts", avatar: "https://i.pravatar.cc/150?u=emily", role: "client", title: "Product Manager" },
    content: "We need a UI/UX designer to redesign our mobile app. Reach us on WhatsApp: wa.me/15550001234 — Looking for someone with strong portfolio in fintech.",
    type: "hiring", category: "Job Search",
    tags: ["UI/UX", "Mobile", "Fintech"], budget: "$5,000 - $8,000", location: "Remote", timeAgo: "8h ago",
    flag: { reason: "whatsapp", detail: "WhatsApp link detected in post body" },
    comments: [
      { id: "c4", author: "Sam Torres", avatar: "https://i.pravatar.cc/150?u=sam", text: "I've designed 3 fintech apps. Call me: +1 (555) 987-6543", timeAgo: "6h ago",
        flag: { reason: "phone", detail: "Phone number shared: +1 (555) 987-6543" } },
      { id: "c5", author: "Nina Park", avatar: "https://i.pravatar.cc/150?u=nina", text: "Would love to discuss this opportunity!", timeAgo: "5h ago" },
    ],
  },
  {
    id: "4",
    author: { name: "Jordan Lee", avatar: "https://i.pravatar.cc/150?u=jordan", role: "freelancer", title: "Mobile Developer" },
    content: "iOS & Android developer open to remote work. Call me at +44 7700 900123 to discuss your project. 6 years experience building native and cross-platform apps.",
    type: "looking", category: "Freelancing",
    tags: ["iOS", "Android", "Flutter"], location: "London, UK", timeAgo: "1d ago",
    flag: { reason: "phone", detail: "Phone number shared: +44 7700 900123" },
    comments: [],
  },
];

// ─── FlagBanner ───────────────────────────────────────────────────────────────

function FlagBanner({ flag, small = false }: { flag: Flag; small?: boolean }) {
  const { label, icon: Icon, color } = FLAG_LABELS[flag.reason];
  if (small) {
    return (
      <div className="flex items-center gap-1.5 rounded-md border border-destructive/20 bg-destructive/5 px-2 py-1 mb-1.5">
        <Flag className="h-3 w-3 text-destructive shrink-0" />
        <Icon className={`h-3 w-3 ${color} shrink-0`} />
        <span className={`text-[10px] font-medium ${color}`}>{label}</span>
        <span className="text-[10px] text-muted-foreground truncate">· {flag.detail}</span>
      </div>
    );
  }
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

// ─── CommentRow ───────────────────────────────────────────────────────────────

function CommentRow({
  comment,
  onDelete,
}: {
  comment: Comment;
  onDelete: (id: string) => void;
}) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const contentParts = comment.flag ? highlightContact(comment.text) : null;

  return (
    <>
      <div className={`rounded-lg border px-3 py-2.5 ${comment.flag ? "border-destructive/30 bg-destructive/5" : "border-border bg-muted/30"}`}>
        {/* Flag banner for comment */}
        {comment.flag && <FlagBanner flag={comment.flag} small />}

        <div className="flex items-start gap-2">
          <div className="relative shrink-0">
            <Avatar className="h-7 w-7">
              <AvatarImage src={comment.avatar} />
              <AvatarFallback className="text-[10px]">{comment.author[0]}</AvatarFallback>
            </Avatar>
            {comment.flag && (
              <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-destructive">
                <Flag className="h-2 w-2 text-white" />
              </span>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-foreground">{comment.author}</span>
              <span className="text-[10px] text-muted-foreground/50">{comment.timeAgo}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
              {contentParts
                ? contentParts.map((part, i) =>
                    part.className
                      ? <mark key={i} className={part.className}>{part.text}</mark>
                      : <span key={i}>{part.text}</span>
                  )
                : comment.text}
            </p>
          </div>

          {/* Delete comment button */}
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 shrink-0 text-muted-foreground hover:text-destructive"
            onClick={() => setConfirmOpen(true)}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-heading">Delete Comment</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this comment? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={() => { onDelete(comment.id); setConfirmOpen(false); }}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

// ─── PostCard ─────────────────────────────────────────────────────────────────

function PostCard({
  post,
  onDeletePost,
  onDeleteComment,
}: {
  post: Post;
  onDeletePost: (id: string) => void;
  onDeleteComment: (postId: string, commentId: string) => void;
}) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const navigate = useNavigate();
  const contentParts = post.flag ? highlightContact(post.content) : null;

  const flaggedComments = post.comments.filter((c) => c.flag).length;

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

          {/* Author row */}
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

          {/* Content */}
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

          {/* Bottom row — comments toggle + delete */}
          <div className="flex items-center justify-between border-t border-border pt-3">

            {/* Comments toggle */}
            {post.comments.length > 0 ? (
              <Button
                variant="ghost"
                size="sm"
                className={`gap-1.5 text-xs ${showComments ? "text-foreground" : "text-muted-foreground"} hover:text-foreground`}
                onClick={() => setShowComments(!showComments)}
              >
                <MessageSquare className="h-4 w-4" />
                {post.comments.length} comment{post.comments.length > 1 ? "s" : ""}
                {flaggedComments > 0 && (
                  <span className="flex items-center gap-0.5 ml-1 text-destructive">
                    <Flag className="h-3 w-3" />
                    {flaggedComments} flagged
                  </span>
                )}
                {showComments ? <ChevronUp className="h-3.5 w-3.5 ml-0.5" /> : <ChevronDown className="h-3.5 w-3.5 ml-0.5" />}
              </Button>
            ) : (
              <span className="text-xs text-muted-foreground/40">No comments</span>
            )}

            {/* Delete post */}
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

          {/* Comments section */}
          <AnimatePresence>
            {showComments && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-3 space-y-2">
                  {/* Flagged comments first */}
                  {[...post.comments]
                    .sort((a, b) => (b.flag ? 1 : 0) - (a.flag ? 1 : 0))
                    .map((comment) => (
                      <CommentRow
                        key={comment.id}
                        comment={comment}
                        onDelete={(commentId) => onDeleteComment(post.id, commentId)}
                      />
                    ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </motion.div>

      {/* Confirm delete post dialog */}
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
            <Button variant="destructive" onClick={() => { onDeletePost(post.id); setConfirmOpen(false); }}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function Feed() {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [filter, setFilter] = useState<"all" | "flagged">("all");

  const flaggedPosts    = posts.filter((p) => p.flag).length;
  const flaggedComments = posts.reduce((acc, p) => acc + p.comments.filter((c) => c.flag).length, 0);
  const totalFlagged    = flaggedPosts + flaggedComments;

  const displayed = filter === "flagged"
    ? posts.filter((p) => p.flag || p.comments.some((c) => c.flag))
    : posts;

  const handleDeletePost = (id: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== id));
  };

  const handleDeleteComment = (postId: string, commentId: string) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? { ...p, comments: p.comments.filter((c) => c.id !== commentId) }
          : p
      )
    );
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">

      {/* Header */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-start justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold mb-1">Feed</h1>
          <p className="text-sm text-muted-foreground">Manage all published posts</p>
        </div>
        {totalFlagged > 0 && (
          <div className="flex items-center gap-1.5 rounded-lg bg-destructive/10 border border-destructive/20 px-3 py-1.5">
            <Flag className="h-3.5 w-3.5 text-destructive" />
            <span className="text-xs font-semibold text-destructive">{totalFlagged} flagged</span>
          </div>
        )}
      </motion.div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Total Posts",      value: posts.length,                                                            color: "text-foreground"   },
          { label: "Hiring",           value: posts.filter((p) => p.type === "hiring").length,                         color: "text-accent"       },
          { label: "Looking",          value: posts.filter((p) => p.type === "looking").length,                        color: "text-primary"      },
          { label: "Flagged Comments", value: flaggedComments,                                                          color: "text-destructive"  },
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
          Flagged {totalFlagged > 0 && <span className="ml-0.5">({totalFlagged})</span>}
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
            {filter === "flagged" ? "No flagged posts or comments." : "No posts yet."}
          </motion.p>
        ) : (
          <div className="space-y-4">
            {displayed.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onDeletePost={handleDeletePost}
                onDeleteComment={handleDeleteComment}
              />
            ))}
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}