import { Switch, Route, useLocation } from "wouter";
import { useState, createContext, useContext } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Book, Menu } from "lucide-react";
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
  const { isOpen, setIsOpen } = useSidebar();
  const [location] = useLocation();
  const isViewerPage = location.startsWith('/viewer') || location.startsWith('/demo');
  
  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Hamburger and logo */}
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-gray-100"
              onClick={() => {
                const newValue = !isOpen;
                console.log('Navigation hamburger clicked - current:', isOpen, 'new:', newValue);
                setIsOpen(newValue);
              }}
              data-testid="nav-hamburger-menu-trigger"
            >
              <Menu size={20} />
            </Button>
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
  const [sidebarOpen, setSidebarOpen] = useState(false); // false = sidebar visible, true = sidebar hidden
  
  const handleSidebarToggle = (value: boolean) => {
    console.log('handleSidebarToggle called - current:', sidebarOpen, 'new:', value);
    setSidebarOpen(value);
    console.log('State after setSidebarOpen:', value);
  };
  
  console.log('App render - sidebarOpen:', sidebarOpen);
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <SidebarContext.Provider value={{ isOpen: sidebarOpen, setIsOpen: handleSidebarToggle }}>
          <div className="min-h-screen bg-bookcraft-gray-50 flex">
            {/* Integrated Sidebar */}
            <div className={`transition-all duration-300 ${sidebarOpen ? 'w-0' : 'w-80'} overflow-hidden border-r border-gray-200`}>
              <div className="w-80 h-full">
                <HamburgerMenu />
              </div>
            </div>
            
            {/* Main Content Area */}
            <div className="flex-1 flex flex-col">
              <Navigation />
              <motion.main
                className="flex-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Router />
              </motion.main>
            </div>
          </div>
          <Toaster />
        </SidebarContext.Provider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
