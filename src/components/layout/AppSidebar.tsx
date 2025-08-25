import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Home,
  BookOpen,
  BarChart3,
  MessageCircle,
  Library,
  Settings,
  Target,
  Trophy,
  Zap,
  Brain,
  GraduationCap,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const navigationItems = [
  { title: "Dashboard", url: "/dashboard", icon: Home },
  { title: "My Paths", url: "/dashboard/paths", icon: BookOpen },
  { title: "Progress", url: "/dashboard/progress", icon: BarChart3 },
  { title: "AI Mentor", url: "/dashboard/mentor", icon: MessageCircle },
  { title: "Resources", url: "/dashboard/resources", icon: Library },
];

const quickActions = [
  { title: "Create Path", url: "/dashboard/create-path", icon: Target },
  { title: "Take Assessment", url: "/dashboard/assessment", icon: Brain },
  { title: "Achievements", url: "/dashboard/achievements", icon: Trophy },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;
  const getNavClass = (path: string) =>
    isActive(path)
      ? "bg-primary text-primary-foreground font-medium shadow-learning"
      : "hover:bg-accent hover:text-accent-foreground";

  return (
    <Sidebar className={collapsed ? "w-16" : "w-64"} collapsible="icon">
      <SidebarHeader className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
            <GraduationCap className="w-8 h-8 dark:text-white text-sidebar-foreground/60" />
          </div>
          {!collapsed && (
            <div>
              <h1 className="text-lg font-bold text-sidebar-foreground">
                LearnPilot
              </h1>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupLabel className="px-3 text-sidebar-foreground/60">
            {!collapsed && "Main Navigation"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="h-11">
                    <NavLink
                      to={item.url}
                      className={`flex items-center gap-3 px-3 rounded-lg transition-all ${getNavClass(
                        item.url
                      )}`}
                    >
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Quick Actions */}
        <SidebarGroup>
          <SidebarGroupLabel className="px-3 text-sidebar-foreground/60">
            {!collapsed && "Quick Actions"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {quickActions.map((action) => (
                <SidebarMenuItem key={action.title}>
                  <SidebarMenuButton asChild className="h-10">
                    <NavLink
                      to={action.url}
                      className={`flex items-center gap-3 px-3 rounded-lg transition-all ${getNavClass(
                        action.url
                      )}`}
                    >
                      <action.icon className="w-4 h-4 flex-shrink-0" />
                      {!collapsed && <span className="text-sm">{action.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-sidebar-border">
        <SidebarMenuItem>
          <SidebarMenuButton asChild className="h-11">
            <NavLink
              to="/dashboard/settings"
              className={`flex items-center gap-3 px-3 rounded-lg transition-all ${getNavClass(
                "/settings"
              )}`}
            >
              <Settings className="w-5 h-5" />
              {!collapsed && <span>Settings</span>}
            </NavLink>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarFooter>
    </Sidebar>
  );
}