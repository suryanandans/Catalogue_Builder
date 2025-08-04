import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Book, Edit, Eye } from "lucide-react";
import { motion } from "framer-motion";
import LandingPage from "@/pages/landing";
import EditorPage from "@/pages/editor";
import ViewerPage from "@/pages/viewer";
import NotFound from "@/pages/not-found";

function Navigation() {
  const [location, navigate] = useLocation();

  const navItems = [
    { path: "/", label: "Home", icon: Book },
    { path: "/editor", label: "Editor", icon: Edit },
    { path: "/viewer", label: "Viewer", icon: Eye },
  ];

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2" data-testid="logo">
              <Book className="text-2xl text-bookcraft-primary" />
              <span className="text-xl font-bold text-bookcraft-secondary">BookCraft</span>
            </div>
            <div className="hidden md:flex space-x-6">
              {navItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`text-gray-700 hover:text-bookcraft-primary font-medium transition-colors ${
                    location === item.path ? "text-bookcraft-primary" : ""
                  }`}
                  data-testid={`nav-${item.label.toLowerCase()}`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => navigate("/editor")}
              className="bg-bookcraft-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              data-testid="button-new-project"
            >
              <Edit className="inline mr-2" size={16} />
              New Project
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={LandingPage} />
      <Route path="/editor" component={EditorPage} />
      <Route path="/viewer" component={ViewerPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-bookcraft-gray-50">
          <Navigation />
          <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Router />
          </motion.main>
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
