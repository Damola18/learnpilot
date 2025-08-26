import { useState } from "react";
import { Search, User, Moon, Sun, Zap } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { generateAvatar } from "@/utils/generateAvatar";

export function AppHeader() {
  const [isDark, setIsDark] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const getAvatarUrl = () => {
    const metadata = user?.user_metadata || {};
    if (metadata.avatarSeed) {
      return generateAvatar(metadata.avatarSeed);
    }
    return null; 
  };

  const getUserInitials = () => {
    const metadata = user?.user_metadata || {};
    const firstName = metadata.firstName || metadata.name?.split(' ')[0] || '';
    const lastName = metadata.lastName || metadata.name?.split(' ')[1] || '';
    
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`;
    } else if (firstName) {
      return firstName[0];
    } else if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return 'U';
  };
  
  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark");
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const avatarUrl = getAvatarUrl();
  const userInitials = getUserInitials();
  const displayName = user?.user_metadata?.firstName && user?.user_metadata?.lastName 
    ? `${user.user_metadata.firstName} ${user.user_metadata.lastName}`
    : user?.user_metadata?.name || 'User';

  return (
    <header className="h-16 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="flex items-center justify-between px-6 h-full">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="hover:bg-accent hover:text-accent-foreground" />

          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search learning paths, resources..."
              className="pl-10 bg-muted/50 border-none focus:bg-background"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-warning-muted border border-warning/20">
            <Zap className="w-4 h-4 text-warning" />
            <span className="text-sm font-medium text-warning-foreground">
              7 day streak
            </span>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="w-9 h-9"
          >
            {isDark ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                <Avatar className="h-9 w-9">
                  {avatarUrl ? (
                    <AvatarImage src={avatarUrl} alt="Profile Avatar" />
                  ) : null}
                  <AvatarFallback className="bg-gradient-primary text-white">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{displayName}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/dashboard/settings')}>
                <User className="mr-2 h-4 w-4" />
                <span>Profile Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut}>
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}