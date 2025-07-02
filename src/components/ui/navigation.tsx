import { Button } from "./button";
import { cn } from "@/lib/utils";

interface NavigationProps {
  activeTab: "public" | "admin";
  onTabChange: (tab: "public" | "admin") => void;
  className?: string;
}

export function Navigation({ activeTab, onTabChange, className }: NavigationProps) {
  return (
    <nav className={cn("flex bg-card rounded-lg p-1 shadow-card", className)}>
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
  );
}