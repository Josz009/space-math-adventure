import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Adventure from "@/pages/adventure";
import Puzzle from "@/pages/puzzle";
import TimeTrial from "@/pages/time-trial";
import ParentDashboard from "@/pages/parent-dashboard";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/adventure" component={Adventure} />
      <Route path="/puzzle" component={Puzzle} />
      <Route path="/time-trial" component={TimeTrial} />
      <Route path="/parent" component={ParentDashboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;