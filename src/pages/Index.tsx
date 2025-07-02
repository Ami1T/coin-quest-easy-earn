import { useState } from "react";
import { LoginForm } from "@/components/auth/LoginForm";
import { PublicDashboard } from "./PublicDashboard";
import { AdminPanel } from "./AdminPanel";
import { Navigation } from "@/components/ui/navigation";
import { Coins, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock data - in a real app, this would come from a backend
interface Task {
  id: string;
  title: string;
  description: string;
  url?: string;
  reward: number;
  type: "link" | "text";
  content?: string;
}

interface User {
  email: string;
  balance: number;
  upiId: string;
  type: "public" | "admin";
}

interface WithdrawalRequest {
  id: string;
  userEmail: string;
  amount: number;
  upiId: string;
  requestDate: string;
  status: "pending" | "approved" | "rejected";
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

const Index = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<"public" | "admin">("public");
  const [isLogin, setIsLogin] = useState(true);
  const [tasks, setTasks] = useState<Task[]>([]);
  
  const [withdrawalRequests, setWithdrawalRequests] = useState<WithdrawalRequest[]>([]);
  const [users, setUsers] = useState<UserData[]>([]);

  const { toast } = useToast();

  const handleLogin = (email: string, password: string, userType: "public" | "admin") => {
    // Simulate login - in real app, this would validate against backend
    const newUser: User = {
      email,
      balance: userType === "admin" ? 0 : 45, // Demo balance for public users
      upiId: userType === "admin" ? "" : "user@paytm",
      type: userType
    };
    
    setCurrentUser(newUser);
    
    toast({
      title: "Login Successful! 🎉",
      description: `Welcome to Easy Earn ${userType === "admin" ? "Admin Panel" : ""}`,
    });
  };

  const handleLogout = () => {
    setCurrentUser(null);
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out",
    });
  };

  const handleTaskComplete = (taskId: string, reward: number) => {
    if (currentUser) {
      setCurrentUser(prev => prev ? { ...prev, balance: prev.balance + reward } : null);
    }
  };

  const handleUpiUpdate = (upiId: string) => {
    if (currentUser) {
      setCurrentUser(prev => prev ? { ...prev, upiId } : null);
    }
  };

  const handleWithdraw = (amount: number) => {
    if (currentUser) {
      const newRequest: WithdrawalRequest = {
        id: Date.now().toString(),
        userEmail: currentUser.email,
        amount,
        upiId: currentUser.upiId,
        requestDate: new Date().toISOString().split('T')[0],
        status: "pending"
      };
      
      setWithdrawalRequests(prev => [newRequest, ...prev]);
      setCurrentUser(prev => prev ? { ...prev, balance: prev.balance - amount } : null);
    }
  };

  const handleAddTask = (task: Omit<Task, "id">) => {
    const newTask: Task = {
      ...task,
      id: Date.now().toString()
    };
    setTasks(prev => [newTask, ...prev]);
  };

  const handleApproveWithdrawal = (id: string) => {
    setWithdrawalRequests(prev =>
      prev.map(req => req.id === id ? { ...req, status: "approved" as const } : req)
    );
    toast({
      title: "Withdrawal Approved",
      description: "Payment has been processed successfully",
    });
  };

  const handleRejectWithdrawal = (id: string) => {
    setWithdrawalRequests(prev =>
      prev.map(req => req.id === id ? { ...req, status: "rejected" as const } : req)
    );
    toast({
      title: "Withdrawal Rejected",
      description: "Payment request has been declined",
      variant: "destructive"
    });
  };

  // If user is logged in, show appropriate dashboard
  if (currentUser) {
    if (currentUser.type === "admin") {
      return (
        <AdminPanel
          onLogout={handleLogout}
          onAddTask={handleAddTask}
          withdrawalRequests={withdrawalRequests}
          onApproveWithdrawal={handleApproveWithdrawal}
          onRejectWithdrawal={handleRejectWithdrawal}
          users={users}
        />
      );
    } else {
      return (
        <PublicDashboard
          user={currentUser}
          tasks={tasks}
          onLogout={handleLogout}
          onTaskComplete={handleTaskComplete}
          onUpiUpdate={handleUpiUpdate}
          onWithdraw={handleWithdraw}
        />
      );
    }
  }

  // Landing page with login/register
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Header */}
      <header className="bg-gradient-primary text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
              <Coins className="w-7 h-7 text-primary" />
            </div>
            <h1 className="text-4xl font-bold">Easy Earn</h1>
          </div>
          <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto">
            Complete simple tasks and earn money instantly. Join thousands of users earning daily rewards!
          </p>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto space-y-8">
          {/* Navigation */}
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold">Welcome to Easy Earn</h2>
            <p className="text-muted-foreground">Choose your access type to continue</p>
            <Navigation 
              activeTab={activeTab} 
              onTabChange={setActiveTab}
              className="max-w-xs mx-auto"
            />
          </div>

          {/* Login Form */}
          <LoginForm
            userType={activeTab}
            onLogin={handleLogin}
            onToggleForm={() => setIsLogin(!isLogin)}
            isLogin={isLogin}
          />

          {/* Features */}
          <div className="grid grid-cols-1 gap-4 mt-8">
            <div className="bg-card p-4 rounded-lg shadow-card">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-coin rounded-full flex items-center justify-center">
                  <Coins className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold">Earn ₹2 per task</h4>
                  <p className="text-sm text-muted-foreground">Complete simple 2-minute tasks</p>
                </div>
              </div>
            </div>
            
            <div className="bg-card p-4 rounded-lg shadow-card">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-success rounded-full flex items-center justify-center">
                  <Shield className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold">Minimum withdrawal ₹50</h4>
                  <p className="text-sm text-muted-foreground">Quick UPI payments</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
