import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/AdminSidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { NotificationBell } from "@/components/ui/NotificationBell";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AdminSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center border-b border-border px-4 bg-card sticky top-0 z-30">
            <SidebarTrigger className="mr-4" />
            <span className="font-heading text-sm font-semibold text-foreground/70 uppercase tracking-wider">
              Admin Panel
            </span>
            <div className="flex-1" />

            {/* Bell sits here — between title spacer and avatar */}
            <NotificationBell />

            <div className="flex items-center gap-3 ml-3">
              <div className="flex flex-col items-end">
                <p className="text-sm font-medium text-foreground">Admin</p>
                <p className="text-[11px] text-muted-foreground">Platform Owner</p>
              </div>
              <Avatar className="h-9 w-9 border-2 border-sidebar-primary/30">
                <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground text-xs font-bold">
                  A
                </AvatarFallback>
              </Avatar>
            </div>
          </header>
          <main className="flex-1 overflow-auto bg-background">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}