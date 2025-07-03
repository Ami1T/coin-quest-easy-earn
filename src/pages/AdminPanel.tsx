import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminStats } from "@/components/admin/AdminStats";
import { PaymentsSection } from "@/components/admin/PaymentsSection";
import { UserDataSection } from "@/components/admin/UserDataSection";
import { UploadSection } from "@/components/admin/UploadSection";
import { TaskManagement } from "@/components/admin/TaskManagement";
import { Badge } from "@/components/ui/badge";
import { LogOut, Shield, TrendingUp, Users, DollarSign, Upload } from "lucide-react";

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
  users 
}: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState("overview");

  // Real-time stats calculated from actual data
  const stats = {
    activeUsers: users.filter(user => user.isActive).length,
    totalTasks: tasks.length,
    totalTransactions: users.reduce((sum, user) => sum + user.tasksCompleted, 0),
    totalWithdrawals: withdrawalRequests
      .filter(req => req.status === "approved")
      .reduce((sum, req) => sum + req.amount, 0)
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
                <p className="text-sm text-muted-foreground">Easy Earn Management Dashboard</p>
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

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="payments" className="flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Payments
              {pendingRequestsCount > 0 && (
                <Badge variant="destructive" className="ml-1 text-xs">
                  {pendingRequestsCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              User Data
            </TabsTrigger>
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Upload
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">User Response Overview</h2>
              <p className="text-muted-foreground">Monitor active users, traffic, and transactions</p>
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
          </TabsContent>

          <TabsContent value="payments">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Payment Management</h2>
                <p className="text-muted-foreground">View and manage withdrawal requests with UPI details</p>
              </div>
              <PaymentsSection
                withdrawalRequests={withdrawalRequests}
                onApproveWithdrawal={onApproveWithdrawal}
                onRejectWithdrawal={onRejectWithdrawal}
              />
            </div>
          </TabsContent>

          <TabsContent value="users">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">User Database</h2>
                <p className="text-muted-foreground">View all registered users and their activity</p>
              </div>
              <UserDataSection users={users} />
            </div>
          </TabsContent>

          <TabsContent value="upload">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Task Management</h2>
                <p className="text-muted-foreground">Upload new tasks and content for users</p>
              </div>
              <UploadSection onAddTask={onAddTask} />
              <TaskManagement 
                tasks={tasks}
                onEditTask={onEditTask}
                onDeleteTask={onDeleteTask}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}