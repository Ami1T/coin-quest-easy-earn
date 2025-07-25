import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Upload, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

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
  // Profile fields
  name?: string;
  gender?: string;
  dateOfBirth?: string;
  state?: string;
  profilePicture?: string;
}

interface EditProfileProps {
  user: User;
  userData?: UserData;
  onUpdateProfile: (profileData: {
    email: string;
    upiId: string;
    name?: string;
    gender?: string;
    dateOfBirth?: string;
    state?: string;
    profilePicture?: string;
  }) => void;
}

export function EditProfile({ user, userData, onUpdateProfile }: EditProfileProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    profilePicture: userData?.profilePicture || "",
    name: userData?.name || user.email.split('@')[0],
    gender: userData?.gender || "",
    dateOfBirth: userData?.dateOfBirth || "",
    state: userData?.state || "",
    userId: generateUserId(user.email, userData?.joinDate),
    email: user.email,
    upiId: user.upiId
  });

  function generateUserId(email: string, joinDate?: string) {
    const emailPart = email.substring(0, email.indexOf('@')).replace(/[^a-zA-Z0-9]/g, '');
    const datePart = joinDate ? joinDate.replace(/-/g, '').substring(2) : '';
    return `${emailPart}${datePart}`.toUpperCase();
  }

  const getInitials = (email: string) => {
    return email.substring(0, 2).toUpperCase();
  };

  const handleBackClick = () => {
    navigate("/profile");
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    // Check if User ID is unique (for now, we'll assume it's always unique based on email+date)
    if (formData.email && formData.upiId) {
      onUpdateProfile({
        email: formData.email,
        upiId: formData.upiId,
        name: formData.name,
        gender: formData.gender,
        dateOfBirth: formData.dateOfBirth,
        state: formData.state,
        profilePicture: formData.profilePicture
      });
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated",
      });
      navigate("/profile");
    } else {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // For now, we'll just store the file name
      // In a real app, you'd upload to a server or cloud storage
      setFormData(prev => ({
        ...prev,
        profilePicture: file.name
      }));
      toast({
        title: "Picture Selected",
        description: "Profile picture will be updated when you submit",
      });
    }
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
            <h1 className="text-xl md:text-2xl font-bold">Edit Profile</h1>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-md mx-auto">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Update Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Profile Picture */}
              <div className="space-y-3">
                <Label>Profile Picture</Label>
                <div className="flex items-center gap-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src="" alt={formData.name} />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {getInitials(formData.email)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="profile-picture"
                    />
                    <Label
                      htmlFor="profile-picture"
                      className="cursor-pointer inline-flex items-center gap-2 px-3 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80"
                    >
                      <Upload className="w-4 h-4" />
                      Change Picture
                    </Label>
                  </div>
                </div>
              </div>

              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Enter your name"
                />
              </div>

              {/* Gender */}
              <div className="space-y-2">
                <Label>Gender</Label>
                <Select value={formData.gender} onValueChange={(value) => handleInputChange("gender", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                    <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Date of Birth */}
              <div className="space-y-2">
                <Label htmlFor="dob">Date of Birth</Label>
                <Input
                  id="dob"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                />
              </div>

              {/* State */}
              <div className="space-y-2">
                <Label>State</Label>
                <Select value={formData.state} onValueChange={(value) => handleInputChange("state", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="andhra-pradesh">Andhra Pradesh</SelectItem>
                    <SelectItem value="arunachal-pradesh">Arunachal Pradesh</SelectItem>
                    <SelectItem value="assam">Assam</SelectItem>
                    <SelectItem value="bihar">Bihar</SelectItem>
                    <SelectItem value="chhattisgarh">Chhattisgarh</SelectItem>
                    <SelectItem value="goa">Goa</SelectItem>
                    <SelectItem value="gujarat">Gujarat</SelectItem>
                    <SelectItem value="haryana">Haryana</SelectItem>
                    <SelectItem value="himachal-pradesh">Himachal Pradesh</SelectItem>
                    <SelectItem value="jharkhand">Jharkhand</SelectItem>
                    <SelectItem value="karnataka">Karnataka</SelectItem>
                    <SelectItem value="kerala">Kerala</SelectItem>
                    <SelectItem value="madhya-pradesh">Madhya Pradesh</SelectItem>
                    <SelectItem value="maharashtra">Maharashtra</SelectItem>
                    <SelectItem value="manipur">Manipur</SelectItem>
                    <SelectItem value="meghalaya">Meghalaya</SelectItem>
                    <SelectItem value="mizoram">Mizoram</SelectItem>
                    <SelectItem value="nagaland">Nagaland</SelectItem>
                    <SelectItem value="odisha">Odisha</SelectItem>
                    <SelectItem value="punjab">Punjab</SelectItem>
                    <SelectItem value="rajasthan">Rajasthan</SelectItem>
                    <SelectItem value="sikkim">Sikkim</SelectItem>
                    <SelectItem value="tamil-nadu">Tamil Nadu</SelectItem>
                    <SelectItem value="telangana">Telangana</SelectItem>
                    <SelectItem value="tripura">Tripura</SelectItem>
                    <SelectItem value="uttar-pradesh">Uttar Pradesh</SelectItem>
                    <SelectItem value="uttarakhand">Uttarakhand</SelectItem>
                    <SelectItem value="west-bengal">West Bengal</SelectItem>
                    <SelectItem value="delhi">Delhi</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* User ID */}
              <div className="space-y-2">
                <Label htmlFor="userId">User ID</Label>
                <Input
                  id="userId"
                  value={formData.userId}
                  onChange={(e) => handleInputChange("userId", e.target.value)}
                  placeholder="User ID"
                  className="font-mono"
                />
                <p className="text-xs text-muted-foreground">
                  User ID must be unique. Auto-generated based on email and join date.
                </p>
              </div>

              {/* Submit Button */}
              <Button
                onClick={handleSubmit}
                className="w-full py-6 text-lg font-semibold"
              >
                Submit Changes
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}