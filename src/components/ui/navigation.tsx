
import { Button } from "./button";
import { SettingsDropdown } from "./settings-dropdown";
import { cn } from "@/lib/utils";
import { Home, Wallet, Users } from "lucide-react";

interface NavigationProps {
  activeTab: "home" | "wallet" | "refer";
  onTabChange: (tab: "home" | "wallet" | "refer") => void;
  onProfileClick: () => void;
  onLogout: () => void;
  className?: string;
}

export function Navigation({ activeTab, onTabChange, onProfileClick, onLogout, className }: NavigationProps) {
  return (
    <div className={cn("flex gap-3", className)}>
      {/* Main Navigation */}
      <nav className="flex bg-card rounded-lg p-1.5 shadow-card overflow-hidden flex-1 gap-1">
        <Button
          variant={activeTab === "home" ? "default" : "ghost"}
          onClick={() => onTabChange("home")}
          className="flex-1 transition-all duration-300 ease-in-out text-xs sm:text-sm px-3 sm:px-4 hover:scale-105 hover:shadow-sm"
          size="sm"
        >
          <Home className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 transition-transform duration-200" />
          <span className="hidden xs:inline sm:inline">Home</span>
        </Button>
        <Button
          variant={activeTab === "wallet" ? "default" : "ghost"}
          onClick={() => onTabChange("wallet")}
          className="flex-1 transition-all duration-300 ease-in-out text-xs sm:text-sm px-3 sm:px-4 hover:scale-105 hover:shadow-sm"
          size="sm"
        >
          <Wallet className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 transition-transform duration-200" />
          <span className="hidden xs:inline sm:inline">Wallet</span>
        </Button>
        <Button
          variant={activeTab === "refer" ? "default" : "ghost"}
          onClick={() => onTabChange("refer")}
          className="flex-1 transition-all duration-300 ease-in-out text-xs sm:text-sm px-3 sm:px-4 hover:scale-105 hover:shadow-sm"
          size="sm"
        >
          <Users className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 transition-transform duration-200" />
          <span className="hidden xs:inline sm:inline">Refer</span>
        </Button>
        <div className="flex items-center">
          <SettingsDropdown 
            onProfileClick={onProfileClick}
            onLogout={onLogout}
            className="transition-all duration-300 ease-in-out hover:scale-105 border-border hover:bg-accent text-foreground"
          />
        </div>
      </nav>
    </div>
  );
}
