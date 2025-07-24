import { useState } from "react";
import { Button } from "./button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./dropdown-menu";
import { Settings, User, LogOut } from "lucide-react";

interface SettingsDropdownProps {
  onProfileClick: () => void;
  onLogout: () => void;
  className?: string;
}

export function SettingsDropdown({ onProfileClick, onLogout, className }: SettingsDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className={`border-white/20 text-white hover:bg-white/10 text-xs md:text-sm px-2 md:px-4 ${className}`}
          size="sm"
        >
          <Settings className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
          <span className="hidden sm:inline">Settings</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={onProfileClick} className="cursor-pointer">
          <User className="w-4 h-4 mr-2" />
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onLogout} className="cursor-pointer">
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}