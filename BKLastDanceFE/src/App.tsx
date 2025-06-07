
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import EpicDetail from "./pages/EpicDetail";
import Timeline from "./pages/Timeline";
import Resources from "./pages/Resources";
import Costs from "./pages/Costs";
import Sprints from "./pages/Sprints";
import Issues from "./pages/Issues";
import Settings from "./pages/Settings";
import ProjectListPage from "@/pages/ProjectList.tsx";
import {BacklogView} from "@/components/project/BacklogView.tsx";
import {MainLayout} from "@/components/MainLayout.tsx";
import ProjectLayout from "@/components/ProjectLayout.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* project list */}
          <Route
              path="/"
              element={
                <ProjectLayout title="Projects">
                  <ProjectListPage />
                </ProjectLayout>
              }
          />

          {/* everything inside a project */}
          <Route path="/projects/:projectId">
            <Route index          element={<Index />} />
            <Route path="timeline"   element={<Timeline />} />
            <Route path="resources"  element={<Resources />} />
            <Route path="costs"      element={<Costs />} />
            <Route path="sprints"    element={<Sprints />} />
            <Route path="issues"     element={<Issues />} />
            <Route path="settings"   element={<Settings />} />
            <Route path="epics/:id"  element={<EpicDetail />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
