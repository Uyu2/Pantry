import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import RecipeEditor from "@/pages/recipe-editor";
import RecipeView from "@/pages/recipe-view";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/recipe/new" component={RecipeEditor} />
      <Route path="/recipe/edit/:id" component={RecipeEditor} />
      <Route path="/recipe/:id" component={RecipeView} />
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
