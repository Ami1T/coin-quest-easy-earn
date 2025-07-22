
import { Button } from "./button";
import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";

interface LoginNavigationProps {
  activeTab: "public" | "admin";
  onTabChange: (tab: "public" | "admin") => void;
  className?: string;
}

export function LoginNavigation({ activeTab, onTabChange, className }: LoginNavigationProps) {
  return (
    <div className={cn("space-y-3 md:space-y-4", className)}>
      <nav className="flex bg-card rounded-lg p-1 shadow-card">
        <Button
          variant={activeTab === "public" ? "default" : "ghost"}
          onClick={() => onTabChange("public")}
          className="flex-1 transition-all duration-200 text-sm md:text-base"
          size="sm"
        >
          Public
        </Button>
        <Button
          variant={activeTab === "admin" ? "default" : "ghost"}
          onClick={() => onTabChange("admin")}
          className="flex-1 transition-all duration-200 text-sm md:text-base"
          size="sm"
        >
          Admin
        </Button>
      </nav>
      
      <Button 
        variant="outline" 
        className="w-full border-dashed border-2 hover:bg-muted/50 transition-all duration-200 text-xs md:text-sm py-2"
        disabled
        size="sm"
      >
        <Sparkles className="w-3 h-3 md:w-4 md:h-4 mr-2" />
        Future Options (Coming Soon)
      </Button>
    </div>
  );
}
