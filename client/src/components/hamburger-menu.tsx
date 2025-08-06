import { Menu, Book, Eye, User, Settings, HelpCircle, LogOut, X } from "lucide-react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useSidebar } from "@/App";

interface MenuItemProps {
  icon: React.ElementType;
  label: string;
  onClick: () => void;
  description?: string;
}

function MenuItem({ icon: Icon, label, onClick, description }: MenuItemProps) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
    >
      <Icon className="text-gray-600" size={20} />
      <div className="flex-1">
        <div className="font-medium text-gray-900">{label}</div>
        {description && (
          <div className="text-sm text-gray-500">{description}</div>
        )}
      </div>
    </button>
  );
}

export default function HamburgerMenu() {
  const [, navigate] = useLocation();
  const [location] = useLocation();
  const { isOpen, setIsOpen } = useSidebar();
  const isViewerPage = location.startsWith('/viewer') || location.startsWith('/demo');

  const handleNavigation = (path: string) => {
    navigate(path);
    // Don't close sidebar on navigation for non-viewer pages
  };

  const menuSections = [
    {
      title: "Library",
      items: [
        {
          icon: Book,
          label: "My Books",
          description: "View and manage your book collection",
          onClick: () => handleNavigation("/my-books"),
        },
        {
          icon: Eye,
          label: "Viewers",
          description: "Browse available book viewers",
          onClick: () => handleNavigation("/viewers"),
        },
      ],
    },
    {
      title: "Account",
      items: [
        {
          icon: User,
          label: "Profile",
          description: "Manage your profile information",
          onClick: () => handleNavigation("/profile"),
        },
        {
          icon: Settings,
          label: "Account Settings",
          description: "Update your account preferences",
          onClick: () => handleNavigation("/settings"),
        },
      ],
    },
    {
      title: "Support",
      items: [
        {
          icon: HelpCircle,
          label: "Help & Support",
          description: "Get help and contact support",
          onClick: () => handleNavigation("/help"),
        },
      ],
    },
  ];

  return (
    <>
      {/* Hamburger Button */}
      <Button
        variant="ghost"
        size="icon"
        className="hover:bg-gray-100"
        onClick={() => {
          console.log('Hamburger clicked, sidebar currently:', isOpen ? 'HIDDEN' : 'VISIBLE', 'setting to:', !isOpen ? 'HIDDEN' : 'VISIBLE');
          setIsOpen(!isOpen);
        }}
        data-testid="hamburger-menu-trigger"
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Debug info */}
      <div className="fixed top-20 right-4 bg-red-500 text-white p-2 text-xs z-50">
        Sidebar: {isOpen ? 'HIDDEN' : 'VISIBLE'} | Viewer: {isViewerPage ? 'YES' : 'NO'}
      </div>

      {/* Static Sidebar - Always visible on non-viewer pages except when manually closed */}
      {!isViewerPage && (
        <div className={`fixed left-0 top-16 h-[calc(100vh-4rem)] w-80 bg-white shadow-lg border-r border-gray-200 z-40 transform transition-transform duration-300 ease-in-out ${
          isOpen ? '-translate-x-full' : 'translate-x-0'
        }`}>
          {/* Sidebar Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Book className="text-bookcraft-primary" size={24} />
                <span className="text-lg font-semibold">BookCraft Menu</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="hover:bg-gray-100"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Sidebar Content */}
          <div className="p-4 space-y-6 overflow-y-auto h-full">
            {menuSections.map((section, index) => (
              <div key={section.title}>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide px-4 mb-2">
                  {section.title}
                </h3>
                <div className="space-y-1">
                  {section.items.map((item) => (
                    <MenuItem
                      key={item.label}
                      icon={item.icon}
                      label={item.label}
                      description={item.description}
                      onClick={item.onClick}
                    />
                  ))}
                </div>
                {index < menuSections.length - 1 && (
                  <Separator className="mt-4" />
                )}
              </div>
            ))}
            
            <Separator />
            
            {/* Logout Section */}
            <div className="px-4">
              <button
                onClick={() => {
                  // Handle logout logic here
                  console.log("Logout clicked");
                }}
                className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-red-50 rounded-lg transition-colors text-red-600"
              >
                <LogOut size={20} />
                <span className="font-medium">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Overlay for mobile */}
      {!isViewerPage && isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}