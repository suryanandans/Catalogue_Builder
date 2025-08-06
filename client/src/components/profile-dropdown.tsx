import { useState } from "react";
import { User, Settings, HelpCircle, LogOut, ChevronDown } from "lucide-react";
import { useLocation } from "wouter";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserProfile {
  name: string;
  email: string;
  avatar?: string;
  initials: string;
}

export default function ProfileDropdown() {
  const [, navigate] = useLocation();
  
  // Mock user data - replace with actual user data from context/auth
  const [user] = useState<UserProfile>({
    name: "John Doe",
    email: "john.doe@example.com",
    initials: "JD"
  });

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const handleLogout = () => {
    // Handle logout logic here
    console.log("Logout clicked");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center space-x-2 hover:bg-gray-100 px-3 py-2"
          data-testid="profile-dropdown-trigger"
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback className="bg-bookcraft-primary text-white text-sm">
              {user.initials}
            </AvatarFallback>
          </Avatar>
          <div className="hidden sm:block text-left">
            <div className="text-sm font-medium text-gray-900">{user.name}</div>
            <div className="text-xs text-gray-500">{user.email}</div>
          </div>
          <ChevronDown className="h-4 w-4 text-gray-400" />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel>
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="bg-bookcraft-primary text-white">
                {user.initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium text-gray-900">{user.name}</div>
              <div className="text-sm text-gray-500">{user.email}</div>
            </div>
          </div>
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem
          onClick={() => handleNavigation("/profile")}
          className="cursor-pointer"
        >
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem
          onClick={() => handleNavigation("/settings")}
          className="cursor-pointer"
        >
          <Settings className="mr-2 h-4 w-4" />
          <span>Account Settings</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem
          onClick={() => handleNavigation("/help")}
          className="cursor-pointer"
        >
          <HelpCircle className="mr-2 h-4 w-4" />
          <span>Help & Support</span>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem
          onClick={handleLogout}
          className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}