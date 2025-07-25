import { useState } from "react";
import { useLocation } from "react-router-dom";
import { LoginForm } from "@/components/auth/LoginForm";
import { PublicDashboard } from "./PublicDashboard";
import { AdminPanel } from "./AdminPanel";
import { Settings } from "./Settings";
import { Profile } from "./Profile";
import { EditProfile } from "./EditProfile";
import { Navigation } from "@/components/ui/navigation";
import { LoginNavigation } from "@/components/ui/login-navigation";
import { SettingsDropdown } from "@/components/ui/settings-dropdown";
import { WalletCard } from "@/components/dashboard/WalletCard";
import { TaskCard } from "@/components/dashboard/TaskCard";
import { ReferralSection } from "@/components/dashboard/ReferralSection";
import { TransactionHistory } from "@/components/dashboard/TransactionHistory";
import { NotificationModal } from "@/components/ui/NotificationModal";
import { ProfileModal } from "@/components/ui/ProfileModal";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Coins, Shield, LogOut, Loader2, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { saveToStorage } from "@/utils/storage";

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
  completedTaskIds: string[];
  isActive: boolean;
  lastActive: string;
  // Profile fields
  name?: string;
  gender?: string;
  dateOfBirth?: string;
  state?: string;
  profilePicture?: string;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  createdAt: string;
}

const Index = () => {
  const { currentUser, isLoading, login, logout, updateUser } = useAuth();
  const { toast } = useToast();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState<"public" | "admin">("public");
  const [userNavTab, setUserNavTab] = useState<"home" | "wallet" | "refer">("home");
  const [isLogin, setIsLogin] = useState(true);
  
  // Load data from localStorage
  const loadFromStorage = () => {
    const storedTasks = localStorage.getItem('easyEarnTasks');
    const storedUsers = localStorage.getItem('easyEarnUsers');
    const storedWithdrawals = localStorage.getItem('easyEarnWithdrawals');
    const storedNotifications = localStorage.getItem('easyEarnNotifications');
    const storedWithdrawalAmount = localStorage.getItem('easyEarnWithdrawalAmount');
    
    return {
      tasks: storedTasks ? JSON.parse(storedTasks) : [],
      users: storedUsers ? JSON.parse(storedUsers) : [],
      withdrawals: storedWithdrawals ? JSON.parse(storedWithdrawals) : [],
      notifications: storedNotifications ? JSON.parse(storedNotifications) : [],
      withdrawalAmount: storedWithdrawalAmount ? parseInt(storedWithdrawalAmount) : 50
    };
  };

  const savedData = loadFromStorage();
  const [tasks, setTasks] = useState<Task[]>(savedData.tasks);
  const [withdrawalRequests, setWithdrawalRequests] = useState<WithdrawalRequest[]>(savedData.withdrawals);
  const [users, setUsers] = useState<UserData[]>(savedData.users);
  const [notifications, setNotifications] = useState<Notification[]>(savedData.notifications);
  const [withdrawalAmount, setWithdrawalAmount] = useState<number>(savedData.withdrawalAmount);
  const [dismissedNotifications, setDismissedNotifications] = useState<string[]>([]);
  const [showProfileModal, setShowProfileModal] = useState(false);
  
  // Load admin credentials from localStorage
  const loadAdminCredentials = () => {
    const storedCredentials = localStorage.getItem('easyEarnAdminCredentials');
    return storedCredentials ? JSON.parse(storedCredentials) : { email: "admin@easyearn.com", password: "admin123" };
  };
  
  const [adminCredentials, setAdminCredentials] = useState(loadAdminCredentials());

  // Show loading spinner while checking for persisted session
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  const handleLogin = (email: string, password: string, userType: "public" | "admin") => {
    // Check if user exists in localStorage
    const existingUser = users.find(user => user.email === email);
    
    let newUser: User;
    if (existingUser) {
      // Returning user - load their data (balance is stored in coins)
      newUser = {
        email,
        balance: existingUser.totalEarnings,
        upiId: existingUser.upiId,
        type: userType
      };
    } else {
      // New user - start with zero balance
      newUser = {
        email,
        balance: 0,
        upiId: "",
        type: userType
      };
      
      // Add new user to database if public user
      if (userType === "public") {
        const newUserData: UserData = {
          id: Date.now().toString(),
          email,
          upiId: "",
          joinDate: new Date().toISOString().split('T')[0],
          totalEarnings: 0,
          tasksCompleted: 0,
          completedTaskIds: [],
          isActive: true,
          lastActive: new Date().toISOString()
        };
        
        const updatedUsers = [...users, newUserData];
        setUsers(updatedUsers);
        saveToStorage(tasks, updatedUsers, withdrawalRequests);
      }
    }
    
    login(newUser);
    
    toast({
      title: "Login Successful! 🎉",
      description: `Welcome to Easy Earn ${userType === "admin" ? "Admin Panel" : ""}`,
    });
  };

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out",
    });
  };

  const handleTaskComplete = (taskId: string, reward: number) => {
    if (currentUser) {
      // Reward is now in coins (e.g., 200 coins for what was ₹2)
      const newBalance = currentUser.balance + reward;
      updateUser({ balance: newBalance });
      
      // Update user data in localStorage with completed task
      const updatedUsers = users.map(user => 
        user.email === currentUser.email 
          ? { 
              ...user, 
              totalEarnings: newBalance, 
              tasksCompleted: user.tasksCompleted + 1, 
              completedTaskIds: [...(user.completedTaskIds || []), taskId],
              lastActive: new Date().toISOString() 
            }
          : user
      );
      setUsers(updatedUsers);
      saveToStorage(tasks, updatedUsers, withdrawalRequests);
    }
  };

  // Filter tasks to show only uncompleted ones for the current user
  const getAvailableTasksForUser = (allTasks: Task[], userEmail: string) => {
    const currentUserData = users.find(user => user.email === userEmail);
    const completedTaskIds = currentUserData?.completedTaskIds || [];
    return allTasks.filter(task => !completedTaskIds.includes(task.id));
  };

  const handleUpiUpdate = (upiId: string) => {
    if (currentUser) {
      updateUser({ upiId });
      
      // Update user data in localStorage
      const updatedUsers = users.map(user => 
        user.email === currentUser.email 
          ? { ...user, upiId }
          : user
      );
      setUsers(updatedUsers);
      saveToStorage(tasks, updatedUsers, withdrawalRequests);
    }
  };

  const handleWithdraw = (amountInCoins: number) => {
    if (currentUser) {
      const amountInRupees = amountInCoins / 100;
      const newRequest: WithdrawalRequest = {
        id: Date.now().toString(),
        userEmail: currentUser.email,
        amount: amountInRupees, // Store withdrawal amount in rupees for display
        upiId: currentUser.upiId,
        requestDate: new Date().toISOString().split('T')[0],
        status: "pending"
      };
      
      const updatedWithdrawals = [newRequest, ...withdrawalRequests];
      setWithdrawalRequests(updatedWithdrawals);
      updateUser({ balance: currentUser.balance - amountInCoins });
      
      // Update user balance in localStorage
      const updatedUsers = users.map(user => 
        user.email === currentUser.email 
          ? { ...user, totalEarnings: currentUser.balance - amountInCoins }
          : user
      );
      setUsers(updatedUsers);
      saveToStorage(tasks, updatedUsers, updatedWithdrawals);
    }
  };

  const handleAddTask = (task: Omit<Task, "id">) => {
    const newTask: Task = {
      ...task,
      id: Date.now().toString()
    };
    const updatedTasks = [newTask, ...tasks];
    setTasks(updatedTasks);
    saveToStorage(updatedTasks, users, withdrawalRequests);
  };

  const handleEditTask = (taskId: string, updatedTask: Omit<Task, "id">) => {
    const updatedTasks = tasks.map(task => 
      task.id === taskId ? { ...updatedTask, id: taskId } : task
    );
    setTasks(updatedTasks);
    saveToStorage(updatedTasks, users, withdrawalRequests);
  };

  const handleDeleteTask = (taskId: string) => {
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    setTasks(updatedTasks);
    saveToStorage(updatedTasks, users, withdrawalRequests);
  };

  const handleApproveWithdrawal = (id: string) => {
    const updatedWithdrawals = withdrawalRequests.map(req => 
      req.id === id ? { ...req, status: "approved" as const } : req
    );
    setWithdrawalRequests(updatedWithdrawals);
    saveToStorage(tasks, users, updatedWithdrawals);
    
    toast({
      title: "Withdrawal Approved",
      description: "Payment has been processed successfully",
    });
  };

  const handleRejectWithdrawal = (id: string) => {
    const updatedWithdrawals = withdrawalRequests.map(req => 
      req.id === id ? { ...req, status: "rejected" as const } : req
    );
    setWithdrawalRequests(updatedWithdrawals);
    saveToStorage(tasks, users, updatedWithdrawals);
    
    toast({
      title: "Withdrawal Rejected",
      description: "Payment request has been declined",
      variant: "destructive"
    });
  };

  const handleWithdrawalAmountChange = (amountInCoins: number) => {
    setWithdrawalAmount(amountInCoins);
    localStorage.setItem('easyEarnWithdrawalAmount', amountInCoins.toString());
  };

  const handleAddNotification = (notification: Omit<Notification, "id">) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString()
    };
    const updatedNotifications = [newNotification, ...notifications];
    setNotifications(updatedNotifications);
    localStorage.setItem('easyEarnNotifications', JSON.stringify(updatedNotifications));
  };

  const handleDeleteNotification = (id: string) => {
    const updatedNotifications = notifications.filter(n => n.id !== id);
    setNotifications(updatedNotifications);
    localStorage.setItem('easyEarnNotifications', JSON.stringify(updatedNotifications));
  };

  const handleDismissNotification = (id: string) => {
    setDismissedNotifications(prev => [...prev, id]);
  };

  const handleAdminCredentialsChange = (email: string, password: string) => {
    setAdminCredentials({ email, password });
    localStorage.setItem('easyEarnAdminCredentials', JSON.stringify({ email, password }));
  };

  const handleProfileUpdate = (profileData: {
    email: string;
    upiId: string;
    name?: string;
    gender?: string;
    dateOfBirth?: string;
    state?: string;
    profilePicture?: string;
  }) => {
    if (currentUser) {
      updateUser({ email: profileData.email, upiId: profileData.upiId });
      
      // Update user data in localStorage with all profile fields
      const updatedUsers = users.map(user => 
        user.email === currentUser.email 
          ? { 
              ...user, 
              email: profileData.email, 
              upiId: profileData.upiId,
              name: profileData.name,
              gender: profileData.gender,
              dateOfBirth: profileData.dateOfBirth,
              state: profileData.state,
              profilePicture: profileData.profilePicture,
              lastActive: new Date().toISOString()
            }
          : user
      );
      setUsers(updatedUsers);
      saveToStorage(tasks, updatedUsers, withdrawalRequests);
    }
  };

  // If user is logged in, show appropriate dashboard
  if (currentUser) {
    if (currentUser.type === "admin") {
      return (
        <AdminPanel
          onLogout={handleLogout}
          onAddTask={handleAddTask}
          onEditTask={handleEditTask}
          onDeleteTask={handleDeleteTask}
          tasks={tasks}
          withdrawalRequests={withdrawalRequests}
          onApproveWithdrawal={handleApproveWithdrawal}
          onRejectWithdrawal={handleRejectWithdrawal}
          users={users}
          withdrawalAmount={withdrawalAmount}
          notifications={notifications}
          onWithdrawalAmountChange={handleWithdrawalAmountChange}
          onAddNotification={handleAddNotification}
          onDeleteNotification={handleDeleteNotification}
          adminEmail={adminCredentials.email}
          onAdminCredentialsChange={handleAdminCredentialsChange}
        />
      );
    } else {
      // Check current route for logged in users
      if (location.pathname === "/settings") {
        return <Settings onLogout={handleLogout} />;
      }
      
      if (location.pathname === "/profile") {
        return (
          <Profile 
            user={currentUser} 
            userData={users.find(u => u.email === currentUser.email)} 
          />
        );
      }
      
      if (location.pathname === "/edit-profile") {
        return (
          <EditProfile 
            user={currentUser} 
            userData={users.find(u => u.email === currentUser.email)}
            onUpdateProfile={handleProfileUpdate}
          />
        );
      }
      // Convert balance to rupees for display (100 coins = 1₹)
      const balanceInRupees = currentUser.balance / 100;
      
      // Public User Dashboard with improved mobile responsiveness
      return (
        <div className="min-h-screen bg-background">
          {/* Mobile-optimized Header */}
          <header className="bg-gradient-primary text-white py-4 md:py-6">
            <div className="container mx-auto px-4">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-2 md:gap-3">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-white rounded-full flex items-center justify-center">
                    <Coins className="w-4 h-4 md:w-6 md:h-6 text-primary" />
                  </div>
                  <div>
                    <h1 className="text-xl md:text-2xl font-bold">Easy Earn</h1>
                    <p className="text-xs md:text-sm text-primary-foreground/80 truncate max-w-[200px] md:max-w-none">
                      Welcome, {currentUser.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30 text-xs md:text-sm">
                    <Coins className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                    ₹{balanceInRupees.toFixed(2)}
                  </Badge>
                </div>
              </div>
            </div>
          </header>

          {/* Mobile-optimized Navigation Bar */}
          <div className="container mx-auto px-4 py-3 md:py-4">
            <Navigation 
              activeTab={userNavTab} 
              onTabChange={setUserNavTab}
              onProfileClick={() => setShowProfileModal(true)}
              onLogout={handleLogout}
              className="max-w-full md:max-w-lg mx-auto"
            />
          </div>

          {/* Notification Modal */}
          <NotificationModal
            notifications={notifications.filter(n => !dismissedNotifications.includes(n.id))}
            onDismiss={handleDismissNotification}
          />

          {/* Profile Modal */}
          <ProfileModal
            isOpen={showProfileModal}
            onClose={() => setShowProfileModal(false)}
            user={currentUser}
            userData={users.find(u => u.email === currentUser.email)}
            onUpdateProfile={handleProfileUpdate}
          />

          {/* Mobile-optimized Content */}
          <div className="container mx-auto px-4 pb-6 md:pb-8">
            {userNavTab === "home" && (
              <div className="space-y-4 md:space-y-6">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold">Available Tasks</h2>
                    <p className="text-sm md:text-base text-muted-foreground">Complete tasks to earn coins</p>
                  </div>
                  <Badge variant="outline" className="text-success border-success text-xs md:text-sm">
                    {getAvailableTasksForUser(tasks, currentUser.email).length} tasks available
                  </Badge>
                </div>

                {(() => {
                  const availableTasks = getAvailableTasksForUser(tasks, currentUser.email);
                  return availableTasks.length === 0 ? (
                    <Card className="shadow-card">
                      <CardContent className="flex flex-col items-center justify-center py-8 md:py-12">
                        <div className="w-12 h-12 md:w-16 md:h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                          <Coins className="w-6 h-6 md:w-8 md:h-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-base md:text-lg font-semibold mb-2">No Tasks Available</h3>
                        <p className="text-sm md:text-base text-muted-foreground text-center px-4">
                          {tasks.length === 0 
                            ? "Check back later for new earning opportunities!" 
                            : "You've completed all available tasks! Check back later for new ones."}
                        </p>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="grid gap-4 md:gap-6 max-w-4xl mx-auto">
                      {availableTasks.map((task) => (
                        <TaskCard
                          key={task.id}
                          task={task}
                          onTaskComplete={handleTaskComplete}
                        />
                      ))}
                    </div>
                  );
                })()}
              </div>
            )}

            {userNavTab === "wallet" && (
              <div className="max-w-full md:max-w-md mx-auto space-y-6">
                <WalletCard
                  balance={currentUser.balance}
                  upiId={currentUser.upiId}
                  onUpiUpdate={handleUpiUpdate}
                  onWithdraw={handleWithdraw}
                />
                <TransactionHistory userEmail={currentUser.email} />
              </div>
            )}

            {userNavTab === "refer" && (
              <div className="max-w-full md:max-w-4xl mx-auto">
                <ReferralSection
                  userEmail={currentUser.email}
                  referralCount={0}
                  referralEarnings={0}
                />
              </div>
            )}
          </div>
        </div>
      );
    }
  }

  // Mobile-optimized Landing page with login/register
  return (
    <div className="min-h-screen bg-background">
      {/* Mobile-optimized Hero Header */}
      <header className="bg-gradient-primary text-white py-6 md:py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 md:gap-3 mb-4">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center">
              <Coins className="w-5 h-5 md:w-7 md:h-7 text-primary" />
            </div>
            <h1 className="text-2xl md:text-4xl font-bold">Easy Earn</h1>
          </div>
          <p className="text-base md:text-xl text-primary-foreground/90 max-w-2xl mx-auto px-4">
            Complete simple tasks and earn money instantly. Join thousands of users earning daily rewards!
          </p>
        </div>
      </header>

      {/* Mobile-optimized Main Content */}
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-full md:max-w-md mx-auto space-y-6 md:space-y-8">
          {/* Navigation */}
          <div className="text-center space-y-4">
            <h2 className="text-xl md:text-2xl font-bold">Welcome to Easy Earn</h2>
            <p className="text-sm md:text-base text-muted-foreground px-4">Choose your access type to continue</p>
            <LoginNavigation 
              activeTab={activeTab} 
              onTabChange={setActiveTab}
              className="max-w-full md:max-w-xs mx-auto"
            />
          </div>

          {/* Login Form */}
          <LoginForm
            userType={activeTab}
            onLogin={handleLogin}
            onToggleForm={() => setIsLogin(!isLogin)}
            isLogin={isLogin}
          />

          {/* Mobile-optimized Features */}
          <div className="grid grid-cols-1 gap-3 md:gap-4 mt-6 md:mt-8">
            <div className="bg-card p-3 md:p-4 rounded-lg shadow-card">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="w-6 h-6 md:w-8 md:h-8 bg-gradient-coin rounded-full flex items-center justify-center">
                  <Coins className="w-3 h-3 md:w-4 md:h-4 text-white" />
                </div>
                <div>
                  <h4 className="text-sm md:text-base font-semibold">Earn 200 coins per task</h4>
                  <p className="text-xs md:text-sm text-muted-foreground">Complete simple 2-minute tasks</p>
                </div>
              </div>
            </div>
            
            <div className="bg-card p-3 md:p-4 rounded-lg shadow-card">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="w-6 h-6 md:w-8 md:h-8 bg-gradient-success rounded-full flex items-center justify-center">
                  <Shield className="w-3 h-3 md:w-4 md:h-4 text-white" />
                </div>
                <div>
                  <h4 className="text-sm md:text-base font-semibold">Minimum withdrawal ₹50</h4>
                  <p className="text-xs md:text-sm text-muted-foreground">Quick UPI payments (5000 coins)</p>
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
