import { Button } from "./button";
import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";

interface NavigationProps {
  activeTab: "public" | "admin";
  onTabChange: (tab: "public" | "admin") => void;
  className?: string;
}

export function Navigation({ activeTab, onTabChange, className }: NavigationProps) {
  return (
    <div className={cn("space-y-4", className)}>
      <nav className="flex bg-card rounded-lg p-1 shadow-card">
        <Button
          variant={activeTab === "public" ? "default" : "ghost"}
          onClick={() => onTabChange("public")}
          className="flex-1 transition-all duration-200"
        >
          Public
        </Button>
        <Button
          variant={activeTab === "admin" ? "default" : "ghost"}
          onClick={() => onTabChange("admin")}
          className="flex-1 transition-all duration-200"
        >
          Admin
        </Button>
      </nav>
      
      <Button 
        variant="outline" 
        className="w-full border-dashed border-2 hover:bg-muted/50 transition-all duration-200"
        disabled
      >
        <Sparkles className="w-4 h-4 mr-2" />
        Future Options (Coming Soon)
      </Button>
    </div>
  );
}