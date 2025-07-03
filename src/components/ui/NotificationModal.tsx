import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface Notification {
  id: string;
  title: string;
  message: string;
  createdAt: string;
}

interface NotificationModalProps {
  notifications: Notification[];
  onDismiss: (notificationId: string) => void;
}

export function NotificationModal({ notifications, onDismiss }: NotificationModalProps) {
  const [currentNotification, setCurrentNotification] = useState<Notification | null>(null);

  useEffect(() => {
    // Show the latest notification that hasn't been dismissed
    const latestNotification = notifications[0];
    if (latestNotification) {
      setCurrentNotification(latestNotification);
    }
  }, [notifications]);

  const handleClose = () => {
    if (currentNotification) {
      onDismiss(currentNotification.id);
      setCurrentNotification(null);
    }
  };

  if (!currentNotification) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-background rounded-lg shadow-lg max-w-md w-full mx-auto">
        <div className="relative p-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="absolute right-2 top-2 h-8 w-8 p-0 hover:bg-muted"
          >
            <X className="h-4 w-4" />
          </Button>
          
          <div className="pr-8">
            <h2 className="text-xl font-bold mb-3 text-foreground">
              {currentNotification.title}
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              {currentNotification.message}
            </p>
            
            <div className="flex justify-end">
              <Button 
                onClick={handleClose}
                className="bg-gradient-primary hover:opacity-90"
              >
                Got it!
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}