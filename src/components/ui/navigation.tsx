import { Button } from "./button";
import { cn } from "@/lib/utils";
import { Home, Wallet, Users } from "lucide-react";

interface NavigationProps {
  activeTab: "home" | "wallet" | "refer";
  onTabChange: (tab: "home" | "wallet" | "refer") => void;
  className?: string;
}

export function Navigation({ activeTab, onTabChange, className }: NavigationProps) {
  return (
    <nav className={cn("flex bg-card rounded-lg p-1 shadow-card", className)}>
      <Button
        variant={activeTab === "home" ? "default" : "ghost"}
        onClick={() => onTabChange("home")}
        className="flex-1 transition-all duration-200"
      >
        <Home className="w-4 h-4 mr-2" />
        Home
      </Button>
      <Button
        variant={activeTab === "wallet" ? "default" : "ghost"}
        onClick={() => onTabChange("wallet")}
        className="flex-1 transition-all duration-200"
      >
        <Wallet className="w-4 h-4 mr-2" />
        Wallet
      </Button>
      <Button
        variant={activeTab === "refer" ? "default" : "ghost"}
        onClick={() => onTabChange("refer")}
        className="flex-1 transition-all duration-200"
      >
        <Users className="w-4 h-4 mr-2" />
        Refer
      </Button>
    </nav>
  );
}