
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Settings, Plus, Trash2 } from "lucide-react";

interface Notification {
  id: string;
  title: string;
  message: string;
  createdAt: string;
}

interface SettingsSectionProps {
  withdrawalAmount: number;
  notifications: Notification[];
  onWithdrawalAmountChange: (amount: number) => void;
  onAddNotification: (notification: Omit<Notification, "id">) => void;
  onDeleteNotification: (id: string) => void;
  adminEmail?: string;
  onAdminCredentialsChange?: (email: string, password: string) => void;
}

export function SettingsSection({ 
  withdrawalAmount, 
  notifications, 
  onWithdrawalAmountChange, 
  onAddNotification, 
  onDeleteNotification,
  adminEmail = "",
  onAdminCredentialsChange
}: SettingsSectionProps) {
  // Convert withdrawal amount to rupees for display (stored as coins)
  const withdrawalAmountInRupees = withdrawalAmount / 100;
  const [newWithdrawalAmount, setNewWithdrawalAmount] = useState(withdrawalAmountInRupees.toString());
  const [notificationTitle, setNotificationTitle] = useState("");
  const [notificationMessage, setNotificationMessage] = useState("");
  const [newAdminEmail, setNewAdminEmail] = useState(adminEmail);
  const [newAdminPassword, setNewAdminPassword] = useState("");
  const { toast } = useToast();

  const handleUpdateWithdrawalAmount = () => {
    const amountInRupees = parseFloat(newWithdrawalAmount);
    if (amountInRupees <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Withdrawal amount must be greater than ₹0",
        variant: "destructive"
      });
      return;
    }
    // Convert rupees to coins for storage
    const amountInCoins = amountInRupees * 100;
    onWithdrawalAmountChange(amountInCoins);
    toast({
      title: "Settings Updated",
      description: `Minimum withdrawal amount set to ₹${amountInRupees} (${amountInCoins} coins)`,
    });
  };

  const handleCreateNotification = () => {
    if (!notificationTitle.trim() || !notificationMessage.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in both title and message",
        variant: "destructive"
      });
      return;
    }

    const newNotification: Omit<Notification, "id"> = {
      title: notificationTitle.trim(),
      message: notificationMessage.trim(),
      createdAt: new Date().toISOString()
    };

    onAddNotification(newNotification);
    setNotificationTitle("");
    setNotificationMessage("");
    
    toast({
      title: "Notification Created! 🎉",
      description: "The notification will be shown to all users",
    });
  };

  const handleAdminCredentialsUpdate = () => {
    if (!newAdminEmail.trim()) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive"
      });
      return;
    }
    
    if (!newAdminPassword.trim()) {
      toast({
        title: "Invalid Password",
        description: "Please enter a new password",
        variant: "destructive"
      });
      return;
    }

    if (onAdminCredentialsChange) {
      onAdminCredentialsChange(newAdminEmail.trim(), newAdminPassword.trim());
      setNewAdminPassword("");
      toast({
        title: "Admin Credentials Updated! 🎉",
        description: "Email and password have been successfully updated",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Withdrawal Amount Settings */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
              <Settings className="w-4 h-4 text-white" />
            </div>
            Withdrawal Settings
          </CardTitle>
          <CardDescription>
            Configure minimum withdrawal amount for users
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <Label htmlFor="withdrawalAmount">Minimum Withdrawal Amount (₹)</Label>
              <Input
                id="withdrawalAmount"
                type="number"
                value={newWithdrawalAmount}
                onChange={(e) => setNewWithdrawalAmount(e.target.value)}
                placeholder="50"
                min="0.01"
                step="0.01"
              />
            </div>
            <Button onClick={handleUpdateWithdrawalAmount}>
              Update Amount
            </Button>
          </div>
          <div className="text-sm text-muted-foreground">
            Current minimum withdrawal: ₹{withdrawalAmountInRupees} ({withdrawalAmount} coins)
          </div>
        </CardContent>
      </Card>

      {/* Admin Credentials Settings */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-warning rounded-full flex items-center justify-center">
              <Settings className="w-4 h-4 text-white" />
            </div>
            Admin Credentials
          </CardTitle>
          <CardDescription>
            Update admin email and password
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div>
              <Label htmlFor="adminEmail">Admin Email</Label>
              <Input
                id="adminEmail"
                type="email"
                value={newAdminEmail}
                onChange={(e) => setNewAdminEmail(e.target.value)}
                placeholder="admin@example.com"
              />
            </div>
            
            <div>
              <Label htmlFor="adminPassword">New Password</Label>
              <Input
                id="adminPassword"
                type="password"
                value={newAdminPassword}
                onChange={(e) => setNewAdminPassword(e.target.value)}
                placeholder="Enter new password"
              />
            </div>

            <Button 
              onClick={handleAdminCredentialsUpdate}
              className="w-full bg-gradient-warning hover:opacity-90"
              size="lg"
            >
              <Settings className="w-4 h-4 mr-2" />
              Update Admin Credentials
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Notifications Settings */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-success rounded-full flex items-center justify-center">
              <Plus className="w-4 h-4 text-white" />
            </div>
            Create Notifications
          </CardTitle>
          <CardDescription>
            Create notifications that will be shown to all users
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div>
              <Label htmlFor="notificationTitle">Notification Title</Label>
              <Input
                id="notificationTitle"
                value={notificationTitle}
                onChange={(e) => setNotificationTitle(e.target.value)}
                placeholder="Enter notification title"
              />
            </div>
            
            <div>
              <Label htmlFor="notificationMessage">Notification Message</Label>
              <Textarea
                id="notificationMessage"
                value={notificationMessage}
                onChange={(e) => setNotificationMessage(e.target.value)}
                placeholder="Enter notification message"
                rows={3}
              />
            </div>

            <Button 
              onClick={handleCreateNotification}
              className="w-full bg-gradient-primary hover:opacity-90"
              size="lg"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Notification
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Existing Notifications */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Active Notifications</CardTitle>
          <CardDescription>
            Manage existing notifications shown to users
          </CardDescription>
        </CardHeader>
        <CardContent>
          {notifications.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No notifications created yet
            </div>
          ) : (
            <div className="space-y-3">
              {notifications.map((notification) => (
                <div key={notification.id} className="flex items-start justify-between p-3 bg-muted rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-semibold">{notification.title}</h4>
                    <p className="text-sm text-muted-foreground">{notification.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Created: {new Date(notification.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDeleteNotification(notification.id)}
                    className="ml-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
