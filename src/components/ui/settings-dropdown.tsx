import { Button } from "./button";
import { Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface SettingsDropdownProps {
  onProfileClick: () => void;
  onLogout: () => void;
  className?: string;
}

export function SettingsDropdown({ onProfileClick, onLogout, className }: SettingsDropdownProps) {
  const navigate = useNavigate();

  const handleSettingsClick = () => {
    navigate("/settings");
  };

  return (
    <Button 
      variant="ghost" 
      className={`text-xs sm:text-sm px-2 sm:px-4 transition-all duration-200 ${className}`}
      size="sm"
      onClick={handleSettingsClick}
    >
      <Settings className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 transition-transform duration-200" />
      <span className="hidden xs:inline sm:inline">Settings</span>
    </Button>
  );
}