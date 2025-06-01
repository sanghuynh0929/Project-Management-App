
import React from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent
} from '@/components/ui/sidebar';
import {Link, useLocation, useParams} from 'react-router-dom';
import {
  Box,
  BarChart,
  Calendar,
  CircleDollarSign,
  Users,
  AlertTriangle,
  Settings,
  ChevronRight
} from 'lucide-react';

export function AppSidebar() {
  const { projectId } = useParams<{ projectId: string }>();
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center space-x-2 px-4 py-2">
          <div className="bg-velocity-purple rounded-md p-1">
            <ChevronRight className="text-white h-5 w-5" />
          </div>
          <h1 className="text-lg font-semibold">CHManager</h1>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Project Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive(`/projects/${projectId}`)}>
                  <Link to={`/projects/${projectId}`} className="flex items-center space-x-2">
                    <Box className="h-5 w-5" />
                    <span>Backlog</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive(`/projects/${projectId}/timeline`)}>
                  <Link to="/timeline" className="flex items-center space-x-2">
                    <BarChart className="h-5 w-5" />
                    <span>Timeline</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive('/resources')}>
                  <Link to="/resources" className="flex items-center space-x-2">
                    <Users className="h-5 w-5" />
                    <span>Resources</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive('/costs')}>
                  <Link to="/costs" className="flex items-center space-x-2">
                    <CircleDollarSign className="h-5 w-5" />
                    <span>Costs</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive('/sprints')}>
                  <Link to="/sprints" className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5" />
                    <span>Sprints</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Monitoring</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive('/issues')}>
                  <Link to="/issues" className="flex items-center space-x-2">
                    <AlertTriangle className="h-5 w-5" />
                    <span>Issues & Risks</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Settings</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive('/settings')}>
                  <Link to="/settings" className="flex items-center space-x-2">
                    <Settings className="h-5 w-5" />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
