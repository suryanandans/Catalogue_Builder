import { useState } from "react";
import { Menu, Book, Eye, User, Settings, HelpCircle, LogOut } from "lucide-react";
import { useLocation } from "wouter";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

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
  const [isOpen, setIsOpen] = useState(false);

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsOpen(false);
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
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-gray-100"
          data-testid="hamburger-menu-trigger"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80 sm:max-w-80">
        <SheetHeader className="text-left">
          <SheetTitle className="flex items-center space-x-2">
            <Book className="text-bookcraft-primary" size={24} />
            <span>BookCraft Menu</span>
          </SheetTitle>
        </SheetHeader>
        
        <div className="mt-6 space-y-6">
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
                setIsOpen(false);
              }}
              className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-red-50 rounded-lg transition-colors text-red-600"
            >
              <LogOut size={20} />
              <span className="font-medium">Sign Out</span>
            </button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}