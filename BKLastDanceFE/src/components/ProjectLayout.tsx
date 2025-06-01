import {
    Sidebar,
    SidebarProvider,
    SidebarContent,
    SidebarHeader,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarTrigger,
} from '@/components/ui/sidebar';

import {
    Box,
    BarChart,
    Calendar,
    CircleDollarSign,
    Users,
    AlertTriangle,
    Settings,
    ChevronRight,
    Plus,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { UserNav } from '@/components/UserNav';
import React from 'react';
import { Link, Outlet, useLocation, useParams } from 'react-router-dom';

/* ───────────────────────── ProjectSidebar ───────────────────────── */
const isActivePath = (current: string, prefix: string) =>
    current.startsWith(prefix);

export function ProjectSidebar() {
    const { projectId } = useParams<{ projectId: string }>();
    const { pathname } = useLocation();

    // Hide sidebar on project list screen
    if (!projectId) return null;
    const base = `/projects/${projectId}`;

    return (
        <Sidebar>
            <SidebarHeader>
                <div className="flex items-center space-x-2 px-4 py-2">
                    <div className="rounded-md bg-velocity-purple p-1">
                        <ChevronRight className="h-5 w-5 text-white" />
                    </div>
                    <h1 className="text-lg font-semibold">CHManager</h1>
                </div>
            </SidebarHeader>

            <SidebarContent>
                {/* Project Management */}
                <SidebarGroup>
                    <SidebarGroupLabel>Project Management</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {[
                                { to: base, icon: Box, label: 'Backlog' },
                                { to: `${base}/timeline`, icon: BarChart, label: 'Timeline' },
                                { to: `${base}/resources`, icon: Users, label: 'Resources' },
                                { to: `${base}/costs`, icon: CircleDollarSign, label: 'Costs' },
                                { to: `${base}/sprints`, icon: Calendar, label: 'Sprints' },
                            ].map(({ to, icon: Icon, label }) => (
                                <SidebarMenuItem key={to}>
                                    <SidebarMenuButton asChild isActive={isActivePath(pathname, to)}>
                                        <Link to={to} className="flex items-center space-x-2">
                                            <Icon className="h-5 w-5" />
                                            <span>{label}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                {/* Monitoring */}
                <SidebarGroup>
                    <SidebarGroupLabel>Monitoring</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    asChild
                                    isActive={isActivePath(pathname, `${base}/issues`)}
                                >
                                    <Link to={`${base}/issues`} className="flex items-center space-x-2">
                                        <AlertTriangle className="h-5 w-5" />
                                        <span>Issues & Risks</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                {/* Settings */}
                <SidebarGroup>
                    <SidebarGroupLabel>Settings</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    asChild
                                    isActive={isActivePath(pathname, `${base}/settings`)}
                                >
                                    <Link to={`${base}/settings`} className="flex items-center space-x-2">
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

/* ───────────────────────── ProjectLayout ───────────────────────── */
interface ProjectLayoutProps {
    /** Title displayed in top bar */
    title: string;
    /** Rendered page body */
    children?: React.ReactNode; // when used directly, not via <Outlet>
    showCreateButton?: boolean;
    onCreateClick?: () => void;
}

export default function ProjectLayout({
                                          title,
                                          children,
                                          showCreateButton = false,
                                          onCreateClick,
                                      }: ProjectLayoutProps) {
    const content = children ?? <Outlet />; // allow direct use or via router

    return (
        <SidebarProvider>
            <div className="flex min-h-screen w-full">
                <ProjectSidebar />
                <div className="flex flex-1 flex-col">
                    {/* Header */}
                    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background p-4">
                        <div className="flex items-center space-x-4">
                            <SidebarTrigger />
                            <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            {showCreateButton && (
                                <Button onClick={onCreateClick}>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Create New
                                </Button>
                            )}
                            <UserNav />
                        </div>
                    </header>

                    {/* Main content */}
                    <main className="flex-1 overflow-auto p-6">{content}</main>
                </div>
            </div>
        </SidebarProvider>
    );
}
