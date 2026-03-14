import {
  LayoutDashboard, Users, Briefcase, CreditCard, FileText, Scale,
  MessageSquare,Home, Settings, Shield, BarChart3, LogOut,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarHeader, SidebarFooter, useSidebar,
} from "@/components/ui/sidebar";

import { useNavigate } from "react-router-dom";

const mainNav = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Feedpage", url: "/feed", icon: Home },
  { title: "Users", url: "/users", icon: Users },
  { title: "Projects", url: "/projects", icon: Briefcase },
  { title: "Payments", url: "/payments", icon: CreditCard },
  { title: "Invoices", url: "/invoices", icon: FileText },
  { title: "Disputes", url: "/disputes", icon: Scale },
];

const systemNav = [
  { title: "Messages", url: "/messages", icon: MessageSquare },
  { title: "Analytics", url: "/analytics", icon: BarChart3 },
  { title: "Security", url: "/security", icon: Shield },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AdminSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const navigate = useNavigate();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sidebar-primary">
            <Shield className="h-5 w-5 text-sidebar-primary-foreground" />
          </div>
          {!collapsed && (
            <div>
              <h2 className="font-heading text-sm font-bold text-sidebar-accent-foreground tracking-wide">WorkFlow</h2>
              <p className="text-[10px] text-sidebar-foreground/60 uppercase tracking-widest">Admin Panel</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/40 text-[10px] uppercase tracking-widest">Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNav.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end={item.url === "/"} className="hover:bg-sidebar-accent/60 rounded-lg transition-colors" activeClassName="bg-sidebar-accent text-sidebar-primary font-semibold">
                      <item.icon className="mr-3 h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/40 text-[10px] uppercase tracking-widest">System</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {systemNav.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className="hover:bg-sidebar-accent/60 rounded-lg transition-colors" activeClassName="bg-sidebar-accent text-sidebar-primary font-semibold">
                      <item.icon className="mr-3 h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <button
          onClick={() => navigate("/login")}
          className="flex items-center gap-2 text-sidebar-foreground/50 hover:text-destructive text-xs mt-3 transition-colors"
        >
          <LogOut className="h-3.5 w-3.5" />
          {!collapsed && <span>Logout</span>}
        </button>
      </SidebarFooter>
    </Sidebar>
  );
}
