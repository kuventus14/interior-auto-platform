/** Quiet Materiality — 공개 랜딩과 작업 캔버스를 연결하는 INSPIRA의 최상위 라우팅. */

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { InspiraProvider } from "@/contexts/InspiraContext";
import AuthPage from "@/pages/AuthPage";
import AdminPage from "@/pages/AdminPage";
import { ProfilePage, SettingsPage } from "@/pages/AccountPages";
import BrandsPage from "@/pages/BrandsPage";
import ComparePage from "@/pages/ComparePage";
import ConceptDetailPage from "@/pages/ConceptDetailPage";
import ConceptsPage from "@/pages/ConceptsPage";
import DashboardPage from "@/pages/DashboardPage";
import FavoritesPage from "@/pages/FavoritesPage";
import GeneratingPage from "@/pages/GeneratingPage";
import Landing from "@/pages/Landing";
import MaterialsPage from "@/pages/MaterialsPage";
import NotificationsPage from "@/pages/NotificationsPage";
import NotFound from "@/pages/NotFound";
import ProjectCreatePage from "@/pages/ProjectCreatePage";
import ProjectsPage from "@/pages/ProjectsPage";
import RevisionPage from "@/pages/RevisionPage";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";


function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Landing} />
      <Route path={"/auth"} component={AuthPage} />
      <Route path={"/dashboard"} component={DashboardPage} />
      <Route path={"/projects"} component={ProjectsPage} />
      <Route path={"/project/new"} component={ProjectCreatePage} />
      <Route path={"/generating"} component={GeneratingPage} />
      <Route path={"/concepts/:id/revise"} component={RevisionPage} />
      <Route path={"/concepts/:id"} component={ConceptDetailPage} />
      <Route path={"/concepts"} component={ConceptsPage} />
      <Route path={"/compare"} component={ComparePage} />
      <Route path={"/materials"} component={MaterialsPage} />
      <Route path={"/brands/:id"} component={BrandsPage} />
      <Route path={"/brands"} component={BrandsPage} />
      <Route path={"/favorites"} component={FavoritesPage} />
      <Route path={"/notifications"} component={NotificationsPage} />
      <Route path={"/profile"} component={ProfilePage} />
      <Route path={"/settings"} component={SettingsPage} />
      <Route path={"/admin"} component={AdminPage} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <InspiraProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </InspiraProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
