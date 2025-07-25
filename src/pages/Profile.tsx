import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Edit, User, Mail, CreditCard, Calendar, Activity } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
  isActive: boolean;
  lastActive: string;
}

interface ProfileProps {
  user: User;
  userData?: UserData;
}

export function Profile({ user, userData }: ProfileProps) {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate("/settings");
  };

  const handleEditClick = () => {
    navigate("/edit-profile");
  };

  // Generate user initials for avatar
  const getInitials = (email: string) => {
    return email.substring(0, 2).toUpperCase();
  };

  // Generate unique User ID based on email and join date
  const generateUserId = (email: string, joinDate?: string) => {
    const emailPart = email.substring(0, email.indexOf('@')).replace(/[^a-zA-Z0-9]/g, '');
    const datePart = joinDate ? joinDate.replace(/-/g, '').substring(2) : '';
    return `${emailPart}${datePart}`.toUpperCase();
  };

  const userId = generateUserId(user.email, userData?.joinDate);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-primary text-white py-4 md:py-6">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBackClick}
                className="text-white hover:bg-white/20"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <h1 className="text-xl md:text-2xl font-bold">Profile</h1>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleEditClick}
              className="bg-white/20 text-white border-white/30 hover:bg-white/30"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Profile Header */}
          <Card className="shadow-card">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-6">
                <Avatar className="w-20 h-20">
                  <AvatarImage src="" alt={user.email} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                    {getInitials(user.email)}
                  </AvatarFallback>
                </Avatar>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h2 className="text-xl font-semibold mb-2">
                    {user.email.split('@')[0]}
                  </h2>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">User ID</p>
                  <p className="font-mono text-sm font-medium">{userId}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Details Section */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Account Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="w-4 h-4" />
                    Email
                  </div>
                  <p className="font-medium">{user.email}</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CreditCard className="w-4 h-4" />
                    UPI ID
                  </div>
                  <p className="font-medium">{user.upiId || "Not set"}</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    Balance
                  </div>
                  <p className="font-medium">₹{(user.balance / 100).toFixed(2)}</p>
                </div>
                
                {userData && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Activity className="w-4 h-4" />
                      Tasks Completed
                    </div>
                    <p className="font-medium">{userData.tasksCompleted}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Additional Info */}
          {userData && (
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Join Date</p>
                    <p className="font-medium">{new Date(userData.joinDate).toLocaleDateString()}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <Badge variant={userData.isActive ? "default" : "secondary"}>
                      {userData.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  
                  <div className="md:col-span-2">
                    <p className="text-sm text-muted-foreground">Last Active</p>
                    <p className="font-medium">{new Date(userData.lastActive).toLocaleDateString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}