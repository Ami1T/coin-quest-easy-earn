
import { Button } from "./button";
import { cn } from "@/lib/utils";
import { Home, Wallet, Users, Settings } from "lucide-react";

interface NavigationProps {
  activeTab: "home" | "wallet" | "refer";
  onTabChange: (tab: "home" | "wallet" | "refer") => void;
  onSettingsClick: () => void;
  className?: string;
}

export function Navigation({ activeTab, onTabChange, onSettingsClick, className }: NavigationProps) {
  return (
    <div className={cn("flex gap-2", className)}>
      {/* Main Navigation */}
      <nav className="flex bg-card rounded-lg p-1 shadow-card overflow-hidden flex-1">
        <Button
          variant={activeTab === "home" ? "default" : "ghost"}
          onClick={() => onTabChange("home")}
          className="flex-1 transition-all duration-200 text-xs sm:text-sm px-2 sm:px-4"
          size="sm"
        >
          <Home className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
          <span className="hidden xs:inline sm:inline">Home</span>
        </Button>
        <Button
          variant={activeTab === "wallet" ? "default" : "ghost"}
          onClick={() => onTabChange("wallet")}
          className="flex-1 transition-all duration-200 text-xs sm:text-sm px-2 sm:px-4"
          size="sm"
        >
          <Wallet className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
          <span className="hidden xs:inline sm:inline">Wallet</span>
        </Button>
        <Button
          variant={activeTab === "refer" ? "default" : "ghost"}
          onClick={() => onTabChange("refer")}
          className="flex-1 transition-all duration-200 text-xs sm:text-sm px-2 sm:px-4"
          size="sm"
        >
          <Users className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
          <span className="hidden xs:inline sm:inline">Refer</span>
        </Button>
        <Button
          variant="ghost"
          onClick={onSettingsClick}
          className="transition-all duration-200 text-xs sm:text-sm px-2 sm:px-4"
          size="sm"
        >
          <Settings className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
          <span className="hidden xs:inline sm:inline">Settings</span>
        </Button>
      </nav>
    </div>
  );
}
