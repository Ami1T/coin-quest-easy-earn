import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface LoginFormProps {
  userType: "public" | "admin";
  onLogin: (email: string, password: string, userType: "public" | "admin") => void;
  onToggleForm: () => void;
  isLogin: boolean;
}

export function LoginForm({ userType, onLogin, onToggleForm, isLogin }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showAdminFields, setShowAdminFields] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isLogin && password !== confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match",
        variant: "destructive"
      });
      return;
    }

    if (userType === "admin") {
      if (email !== "ka6515034@gmail.com" || password !== "Amazing") {
        toast({
          title: "Access Denied",
          description: "Invalid admin credentials",
          variant: "destructive"
        });
        return;
      }
    }

    onLogin(email, password, userType);
  };

  const getCardTitle = () => {
    if (userType === "admin") {
      return isLogin ? "Admin Login" : "Admin Access";
    }
    return isLogin ? "Welcome Back" : "Join Easy Earn";
  };

  const getCardDescription = () => {
    if (userType === "admin") {
      return "Access the admin panel to manage the platform";
    }
    return isLogin ? "Sign in to start earning rewards" : "Create your account and start earning today";
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-card">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          {getCardTitle()}
        </CardTitle>
        <CardDescription>{getCardDescription()}</CardDescription>
      </CardHeader>
      <CardContent>
        {userType === "admin" && !showAdminFields ? (
          <div className="text-center space-y-4">
            <p className="text-muted-foreground">Click to access admin panel</p>
            <Button 
              onClick={() => setShowAdminFields(true)}
              className="w-full bg-gradient-primary hover:opacity-90"
            >
              Access Admin Panel
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={userType === "admin" ? "ka6515034@gmail.com" : "Enter your email"}
                required
                className="transition-all duration-200 focus:shadow-coin/20"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={userType === "admin" ? "Amazing" : "Enter your password"}
                required
                className="transition-all duration-200 focus:shadow-coin/20"
              />
            </div>

            {!isLogin && userType === "public" && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  required
                  className="transition-all duration-200 focus:shadow-coin/20"
                />
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full bg-gradient-primary hover:opacity-90 transition-all duration-200 shadow-card"
            >
              {isLogin ? "Sign In" : "Create Account"}
            </Button>

            {userType === "public" && (
              <div className="text-center">
                <Button
                  type="button"
                  variant="link"
                  onClick={onToggleForm}
                  className="text-primary hover:text-primary/80"
                >
                  {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
                </Button>
              </div>
            )}
          </form>
        )}
      </CardContent>
    </Card>
  );
}