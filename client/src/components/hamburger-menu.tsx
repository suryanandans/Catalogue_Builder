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
    <div className="h-full bg-white flex flex-col">
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
            onClick={() => {
              const newValue = true; // Hide sidebar
              console.log('Close button clicked - setting to:', newValue);
              setIsOpen(newValue);
            }}
            className="hover:bg-gray-100"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Sidebar Content */}
      <div className="flex-1 p-4 space-y-6 overflow-y-auto">
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
  );
}