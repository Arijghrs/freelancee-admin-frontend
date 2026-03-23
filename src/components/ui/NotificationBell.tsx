import { useState } from "react";
import { Bell, Scale, CreditCard, Flag, Briefcase, X, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";



type NotifType = "dispute" | "payment" | "flagged" | "project";

interface Notification {
  id: string;
  type: NotifType;
  title: string;
  description: string;
  timeAgo: string;
  read: boolean;
}



const TYPE_CONFIG: Record<NotifType, {
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  label: string;
}> = {
  dispute: {
    icon: Scale,
    iconBg: "bg-orange-100 dark:bg-orange-900/30",
    iconColor: "text-orange-500",
    label: "Dispute",
  },
  payment: {
    icon: CreditCard,
    iconBg: "bg-green-100 dark:bg-green-900/30",
    iconColor: "text-green-600",
    label: "Payment",
  },
  flagged: {
    icon: Flag,
    iconBg: "bg-destructive/10",
    iconColor: "text-destructive",
    label: "Flagged",
  },
  project: {
    icon: Briefcase,
    iconBg: "bg-purple-100 dark:bg-purple-900/30",
    iconColor: "text-purple-500",
    label: "Project",
  },
};



const mockNotifications: Notification[] = [
  { id: "1", type: "flagged",  title: "Post flagged",        description: "Alex Rivera's post contains a WhatsApp link.",        timeAgo: "2m ago",  read: false },
  { id: "2", type: "payment",  title: "Payment received",    description: "$1,200 received for Project #482 from Sarah Chen.",   timeAgo: "15m ago", read: false },
  { id: "3", type: "dispute",  title: "Dispute opened",      description: "Jordan Lee opened a dispute on Invoice #204.",        timeAgo: "1h ago",  read: false },
  { id: "4", type: "project",  title: "New project created", description: "Project 'Mobile Redesign' was posted by TechStart.", timeAgo: "3h ago",  read: false },
  { id: "5", type: "flagged",  title: "Message flagged",     description: "A message in Dispute #198 contains a phone number.", timeAgo: "5h ago",  read: true  },
  { id: "6", type: "payment",  title: "Payment received",    description: "$450 received for Project #471 from Jordan Lee.",    timeAgo: "1d ago",  read: true  },
  { id: "7", type: "dispute",  title: "Dispute updated",     description: "Dispute #198 was marked as resolved.",               timeAgo: "1d ago",  read: true  },
  { id: "8", type: "project",  title: "New project created", description: "Project 'API Integration' was posted by DevCorp.",  timeAgo: "2d ago",  read: true  },
];



function NotificationItem({
  notif,
  onRead,
}: {
  notif: Notification;
  onRead: (id: string) => void;
}) {
  const { icon: Icon, iconBg, iconColor, label } = TYPE_CONFIG[notif.type];

  return (
    <div
      className={cn(
        "flex gap-3 px-4 py-3 hover:bg-muted/50 transition-colors cursor-pointer",
        !notif.read && "bg-primary/5"
      )}
      onClick={() => onRead(notif.id)}
    >
      {/* Icon */}
      <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-full mt-0.5", iconBg)}>
        <Icon className={cn("h-4 w-4", iconColor)} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-xs font-semibold text-foreground truncate">{notif.title}</span>
          <span className={cn(
            "text-[9px] font-medium px-1.5 py-0.5 rounded-full shrink-0",
            iconBg, iconColor
          )}>
            {label}
          </span>
        </div>
        <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2">
          {notif.description}
        </p>
        <p className="text-[10px] text-muted-foreground/50 mt-1">{notif.timeAgo}</p>
      </div>

      {/* Unread dot */}
      {!notif.read && (
        <div className="shrink-0 mt-2">
          <span className="block h-2 w-2 rounded-full bg-primary" />
        </div>
      )}
    </div>
  );
}



export function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [open, setOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const dismiss = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="relative h-9 w-9 p-0">
          <Bell className="h-4 w-4 text-muted-foreground" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[9px] font-bold text-white">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent align="end" sideOffset={8} className="w-80 p-0 shadow-xl">

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <div className="flex items-center gap-2">
            <h3 className="font-heading text-sm font-bold">Notifications</h3>
            {unreadCount > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-white">
                {unreadCount}
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 gap-1 text-[11px] text-muted-foreground hover:text-foreground px-2"
              onClick={markAllRead}
            >
              <CheckCheck className="h-3.5 w-3.5" />
              Mark all read
            </Button>
          )}
        </div>

        {/* List */}
        <div className="overflow-y-auto max-h-[340px] divide-y divide-border">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <Bell className="h-8 w-8 text-muted-foreground/30 mb-2" />
              <p className="text-xs text-muted-foreground">You're all caught up</p>
            </div>
          ) : (
            notifications.map((notif) => (
              <div key={notif.id} className="relative group">
                <NotificationItem notif={notif} onRead={markAsRead} />
                <button
                  className="absolute top-2 right-2 hidden group-hover:flex h-5 w-5 items-center justify-center rounded-full hover:bg-muted text-muted-foreground hover:text-foreground"
                  onClick={(e) => dismiss(notif.id, e)}
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-border px-4 py-2.5">
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-xs text-muted-foreground hover:text-foreground h-7"
          >
            View all notifications
          </Button>
        </div>

      </PopoverContent>
    </Popover>
  );
}