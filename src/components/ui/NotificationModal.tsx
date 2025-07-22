
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
      <div className="bg-background rounded-lg shadow-lg max-w-md w-full mx-auto max-h-[90vh] overflow-y-auto">
        <div className="relative p-4 md:p-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="absolute right-2 top-2 h-6 w-6 md:h-8 md:w-8 p-0 hover:bg-muted"
          >
            <X className="h-3 w-3 md:h-4 md:w-4" />
          </Button>
          
          <div className="pr-8 md:pr-10">
            <h2 className="text-lg md:text-xl font-bold mb-3 text-foreground">
              {currentNotification.title}
            </h2>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-4 md:mb-6">
              {currentNotification.message}
            </p>
            
            <div className="flex justify-end">
              <Button 
                onClick={handleClose}
                className="bg-gradient-primary hover:opacity-90 text-sm md:text-base px-4 md:px-6"
                size="sm"
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
