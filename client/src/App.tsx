import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import DashboardLayout from "./components/DashboardLayout";
import Home from "./pages/Home";
import Offers from "./pages/Offers";
import OfferDetail from "./pages/OfferDetail";
import LandingPages from "./pages/LandingPages";
import LandingPageGenerator from "./pages/LandingPageGenerator";
import EmailSequences from "./pages/EmailSequences";
import Performance from "./pages/Performance";
import NicheStrategies from "./pages/NicheStrategies";
import ComplianceChecker from "./pages/ComplianceChecker";
import VideoCreator from "./pages/VideoCreator";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      
      {/* Dashboard routes */}
      <Route path={"/dashboard"}>
        <DashboardLayout>
          <Home />
        </DashboardLayout>
      </Route>
      
      <Route path={"/offers"}>
        <DashboardLayout>
          <Offers />
        </DashboardLayout>
      </Route>
      
      <Route path={"/offers/:id"}>
        {(params) => (
          <DashboardLayout>
            <OfferDetail offerId={parseInt(params.id)} />
          </DashboardLayout>
        )}
      </Route>
      
      <Route path={"/landing-pages"}>
        <DashboardLayout>
          <LandingPages />
        </DashboardLayout>
      </Route>
      
      <Route path={"/landing-pages/generate"}>
        <DashboardLayout>
          <LandingPageGenerator />
        </DashboardLayout>
      </Route>
      
      <Route path={"/email-sequences"}>
        <DashboardLayout>
          <EmailSequences />
        </DashboardLayout>
      </Route>
      
      <Route path={"/performance"}>
        <DashboardLayout>
          <Performance />
        </DashboardLayout>
      </Route>
      
      <Route path={"/strategies"}>
        <DashboardLayout>
          <NicheStrategies />
        </DashboardLayout>
      </Route>
      
      <Route path={"/compliance"}>
        <DashboardLayout>
          <ComplianceChecker />
        </DashboardLayout>
      </Route>
      
      <Route path={"/video-creator"}>
        <DashboardLayout>
          <VideoCreator />
        </DashboardLayout>
      </Route>
      
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
