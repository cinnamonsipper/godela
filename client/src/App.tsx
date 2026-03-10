import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Godela from "@/pages/Godela";
import ModelViewer from "@/pages/ModelViewer";
import EmbeddedModelViewer from "@/pages/EmbeddedModelViewer";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Godela} />
      <Route path="/model-viewer" component={ModelViewer} />
      <Route path="/embedded-viewer" component={EmbeddedModelViewer} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
