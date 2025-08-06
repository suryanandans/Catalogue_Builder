import { Switch, Route, useLocation } from "wouter";
import { useState, createContext, useContext } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Book } from "lucide-react";
import { motion } from "framer-motion";
import LandingPage from "@/pages/landing";
import EditorPage from "@/pages/editor";
import ViewerPage from "@/pages/viewer";
import MyBooksPage from "@/pages/my-books";
import DemoViewerPage from "@/pages/demo-viewer";
import ProfilePage from "@/pages/profile";
import SettingsPage from "@/pages/settings";
import NotFound from "@/pages/not-found";
import HamburgerMenu from "@/components/hamburger-menu";
import ProfileDropdown from "@/components/profile-dropdown";

// Context for sidebar state
const SidebarContext = createContext<{
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}>({
  isOpen: false,
  setIsOpen: () => {},
});

export const useSidebar = () => useContext(SidebarContext);

function Navigation() {
  const { isOpen } = useSidebar();
  const [location] = useLocation();
  const isViewerPage = location.startsWith('/viewer') || location.startsWith('/demo');
  
  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-300 ${
        isOpen && !isViewerPage ? 'ml-80' : ''
      }`}>
        <div className="flex justify-between items-center h-16">
          {/* Left side - Hamburger menu and logo */}
          <div className="flex items-center space-x-4">
            <HamburgerMenu />
            <div className="flex items-center space-x-2" data-testid="logo">
              <Book className="text-2xl text-bookcraft-primary" />
              <span className="text-xl font-bold text-bookcraft-secondary">BookCraft</span>
            </div>
          </div>
          
          {/* Right side - Profile dropdown */}
          <div className="flex items-center">
            <ProfileDropdown />
          </div>
        </div>
      </div>
    </nav>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={MyBooksPage} />
      <Route path="/my-books" component={MyBooksPage} />
      <Route path="/landing" component={LandingPage} />
      <Route path="/editor" component={EditorPage} />
      <Route path="/viewer" component={ViewerPage} />
      <Route path="/demo" component={DemoViewerPage} />
      <Route path="/profile" component={ProfilePage} />
      <Route path="/settings" component={SettingsPage} />
      <Route path="/help" component={NotFound} />
      <Route path="/viewers" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <SidebarContext.Provider value={{ isOpen: sidebarOpen, setIsOpen: setSidebarOpen }}>
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
        </SidebarContext.Provider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
