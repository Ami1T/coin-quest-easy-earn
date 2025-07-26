import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, LogOut, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface SettingsProps {
  onLogout: () => void;
}

export function Settings({ onLogout }: SettingsProps) {
  const navigate = useNavigate();

  const handleProfileClick = () => {
    navigate("/profile");
  };

  const handleLogoutClick = () => {
    onLogout();
    navigate("/");
  };

  const handleBackClick = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-primary text-white py-4 md:py-6">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBackClick}
              className="text-white hover:bg-white/20"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-xl md:text-2xl font-bold">Settings</h1>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="space-y-4">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-center">Account Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={handleProfileClick}
                className="w-full flex items-center justify-center gap-3 py-6 text-lg"
                variant="outline"
              >
                <User className="w-5 h-5" />
                Profile
              </Button>
              
              <Button
                onClick={handleLogoutClick}
                className="w-full flex items-center justify-center gap-3 py-6 text-lg"
                variant="destructive"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}