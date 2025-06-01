
import React from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from './AppSidebar';
import { UserNav } from './UserNav';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface MainLayoutProps {
  children: React.ReactNode;
  title: string;
  showCreateButton?: boolean;
  onCreateClick?: () => void;
}

export function MainLayout({ children, title, showCreateButton = false, onCreateClick }: MainLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <header className="sticky top-0 z-10 border-b bg-background flex items-center justify-between p-4 h-16">
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
          <main className="flex-1 p-6 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
