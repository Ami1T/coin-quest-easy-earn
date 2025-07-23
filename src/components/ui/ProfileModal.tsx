import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { User, Edit3, Mail, Coins, CreditCard, Calendar, Save, X } from "lucide-react";

interface User {
  email: string;
  balance: number;
  upiId: string;
  type: "public" | "admin";
}

interface UserData {
  id: string;
  email: string;
  upiId: string;
  joinDate: string;
  totalEarnings: number;
  tasksCompleted: number;
  completedTaskIds: string[];
  isActive: boolean;
  lastActive: string;
}

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  userData?: UserData;
  onUpdateProfile: (email: string, upiId: string) => void;
}

export function ProfileModal({ isOpen, onClose, user, userData, onUpdateProfile }: ProfileModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editEmail, setEditEmail] = useState(user.email);
  const [editUpiId, setEditUpiId] = useState(user.upiId);
  const { toast } = useToast();

  const balanceInRupees = user.balance / 100;

  const handleSave = () => {
    if (!editEmail.trim()) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive"
      });
      return;
    }

    onUpdateProfile(editEmail.trim(), editUpiId.trim());
    setIsEditing(false);
    toast({
      title: "Profile Updated! 🎉",
      description: "Your profile information has been successfully updated",
    });
  };

  const handleCancel = () => {
    setEditEmail(user.email);
    setEditUpiId(user.upiId);
    setIsEditing(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            User Profile
          </DialogTitle>
          <DialogDescription>
            View and manage your profile information
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Profile Information */}
          <Card className="shadow-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-primary" />
                  Profile Information
                </CardTitle>
                {!isEditing && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit3 className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="editEmail">Email Address</Label>
                    <Input
                      id="editEmail"
                      type="email"
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                      placeholder="Enter your email"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="editUpiId">UPI ID</Label>
                    <Input
                      id="editUpiId"
                      value={editUpiId}
                      onChange={(e) => setEditUpiId(e.target.value)}
                      placeholder="Enter your UPI ID (optional)"
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={handleSave} className="flex-1">
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </Button>
                    <Button variant="outline" onClick={handleCancel} className="flex-1">
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <span className="text-sm font-medium">Email</span>
                    <span className="text-sm">{user.email}</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <span className="text-sm font-medium">UPI ID</span>
                    <span className="text-sm">{user.upiId || "Not set"}</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <span className="text-sm font-medium">Account Type</span>
                    <span className="text-sm capitalize">{user.type}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Wallet Information */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Coins className="w-5 h-5 text-success" />
                Wallet Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <span className="text-sm font-medium">Current Balance</span>
                  <div className="text-right">
                    <div className="text-sm font-bold text-success">₹{balanceInRupees.toFixed(2)}</div>
                    <div className="text-xs text-muted-foreground">{user.balance} coins</div>
                  </div>
                </div>
                
                {userData && (
                  <>
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <span className="text-sm font-medium">Total Earnings</span>
                      <div className="text-right">
                        <div className="text-sm font-bold">₹{(userData.totalEarnings / 100).toFixed(2)}</div>
                        <div className="text-xs text-muted-foreground">{userData.totalEarnings} coins</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <span className="text-sm font-medium">Tasks Completed</span>
                      <span className="text-sm font-bold">{userData.tasksCompleted}</span>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Account Information */}
          {userData && (
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  Account Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <span className="text-sm font-medium">Join Date</span>
                    <span className="text-sm">{new Date(userData.joinDate).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <span className="text-sm font-medium">Last Active</span>
                    <span className="text-sm">{new Date(userData.lastActive).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <span className="text-sm font-medium">Account Status</span>
                    <span className={`text-sm font-medium ${userData.isActive ? 'text-success' : 'text-destructive'}`}>
                      {userData.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}