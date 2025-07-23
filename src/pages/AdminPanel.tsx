import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminStats } from "@/components/admin/AdminStats";
import { PaymentsSection } from "@/components/admin/PaymentsSection";
import { UserDataSection } from "@/components/admin/UserDataSection";
import { UploadSection } from "@/components/admin/UploadSection";
import { TaskManagement } from "@/components/admin/TaskManagement";
import { SettingsSection } from "@/components/admin/SettingsSection";
import { Badge } from "@/components/ui/badge";
import { LogOut, Shield, TrendingUp, Users, DollarSign, Upload, Settings } from "lucide-react";

interface Task {
  id: string;
  title: string;
  description: string;
  url?: string;
  reward: number;
  type: "link" | "text";
  content?: string;
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

interface Notification {
  id: string;
  title: string;
  message: string;
  createdAt: string;
}

interface AdminPanelProps {
  onLogout: () => void;
  onAddTask: (task: Omit<Task, "id">) => void;
  onEditTask: (taskId: string, updatedTask: Omit<Task, "id">) => void;
  onDeleteTask: (taskId: string) => void;
  tasks: Task[];
  withdrawalRequests: WithdrawalRequest[];
  onApproveWithdrawal: (id: string) => void;
  onRejectWithdrawal: (id: string) => void;
  users: UserData[];
  withdrawalAmount: number;
  notifications: Notification[];
  onWithdrawalAmountChange: (amount: number) => void;
  onAddNotification: (notification: Omit<Notification, "id">) => void;
  onDeleteNotification: (id: string) => void;
}

export function AdminPanel({ 
  onLogout, 
  onAddTask, 
  onEditTask,
  onDeleteTask,
  tasks,
  withdrawalRequests, 
  onApproveWithdrawal, 
  onRejectWithdrawal,
  users,
  withdrawalAmount,
  notifications,
  onWithdrawalAmountChange,
  onAddNotification,
  onDeleteNotification
}: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState("overview");

  // Real-time stats calculated from actual data with coin conversion
  const stats = {
    activeUsers: users.filter(user => user.isActive).length,
    totalTasks: tasks.length,
    totalTransactions: users.reduce((sum, user) => sum + user.tasksCompleted, 0),
    totalWithdrawals: withdrawalRequests
      .filter(req => req.status === "approved")
      .reduce((sum, req) => sum + req.amount, 0) // This is already in rupees
  };

  const pendingRequestsCount = withdrawalRequests.filter(req => req.status === "pending").length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card shadow-card border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center shadow-card">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  Admin Panel
                </h1>
                <p className="text-sm text-muted-foreground">Easy Earn Management Dashboard (100 coins = ₹1)</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {pendingRequestsCount > 0 && (
                <Badge variant="destructive" className="animate-pulse">
                  {pendingRequestsCount} pending requests
                </Badge>
              )}
              <Button variant="outline" onClick={onLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Bar */}
      <nav className="bg-card border-b shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-2 py-3 overflow-x-auto">
            <Button
              variant={activeTab === "overview" ? "default" : "ghost"}
              onClick={() => setActiveTab("overview")}
              className="flex items-center gap-2 min-w-fit"
            >
              <TrendingUp className="w-4 h-4" />
              Overview
            </Button>
            <Button
              variant={activeTab === "payments" ? "default" : "ghost"}
              onClick={() => setActiveTab("payments")}
              className="flex items-center gap-2 min-w-fit relative"
            >
              <DollarSign className="w-4 h-4" />
              Payments
              {pendingRequestsCount > 0 && (
                <Badge variant="destructive" className="ml-1 text-xs">
                  {pendingRequestsCount}
                </Badge>
              )}
            </Button>
            <Button
              variant={activeTab === "users" ? "default" : "ghost"}
              onClick={() => setActiveTab("users")}
              className="flex items-center gap-2 min-w-fit"
            >
              <Users className="w-4 h-4" />
              User Data
            </Button>
            <Button
              variant={activeTab === "upload" ? "default" : "ghost"}
              onClick={() => setActiveTab("upload")}
              className="flex items-center gap-2 min-w-fit"
            >
              <Upload className="w-4 h-4" />
              Task Management
            </Button>
            <Button
              variant={activeTab === "settings" ? "default" : "ghost"}
              onClick={() => setActiveTab("settings")}
              className="flex items-center gap-2 min-w-fit"
            >
              <Settings className="w-4 h-4" />
              Settings
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">

          {activeTab === "overview" && (
            <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">User Response Overview</h2>
              <p className="text-muted-foreground">Monitor active users, traffic, and transactions (100 coins = ₹1)</p>
            </div>
            <AdminStats
              activeUsers={stats.activeUsers}
              totalTasks={stats.totalTasks}
              totalTransactions={stats.totalTransactions}
              totalWithdrawals={stats.totalWithdrawals}
            />
            
            {/* Recent Activity */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest platform activity and user engagement</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <span className="text-sm">New user registration</span>
                    <Badge variant="outline">2 hours ago</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <span className="text-sm">Task completion spike</span>
                    <Badge variant="outline">4 hours ago</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <span className="text-sm">Withdrawal request submitted</span>
                    <Badge variant="outline">6 hours ago</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
            </div>
          )}

          {activeTab === "payments" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Payment Management</h2>
                <p className="text-muted-foreground">View and manage withdrawal requests with UPI details (amounts in ₹)</p>
              </div>
              <PaymentsSection
                withdrawalRequests={withdrawalRequests}
                onApproveWithdrawal={onApproveWithdrawal}
                onRejectWithdrawal={onRejectWithdrawal}
              />
            </div>
          )}

          {activeTab === "users" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">User Database</h2>
                <p className="text-muted-foreground">View all registered users and their activity (earnings in coins)</p>
              </div>
              <UserDataSection users={users} />
            </div>
          )}

          {activeTab === "upload" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Task Management</h2>
                <p className="text-muted-foreground">Upload new tasks and content for users (rewards in coins: 100 coins = ₹1)</p>
              </div>
              <UploadSection onAddTask={onAddTask} />
              <TaskManagement 
                tasks={tasks}
                onEditTask={onEditTask}
                onDeleteTask={onDeleteTask}
              />
            </div>
          )}

          {activeTab === "settings" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Settings</h2>
                <p className="text-muted-foreground">Configure withdrawal amounts and manage notifications</p>
              </div>
              <SettingsSection
                withdrawalAmount={withdrawalAmount}
                notifications={notifications}
                onWithdrawalAmountChange={onWithdrawalAmountChange}
                onAddNotification={onAddNotification}
                onDeleteNotification={onDeleteNotification}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
