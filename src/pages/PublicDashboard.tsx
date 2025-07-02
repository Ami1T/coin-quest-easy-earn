import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { WalletCard } from "@/components/dashboard/WalletCard";
import { TaskCard } from "@/components/dashboard/TaskCard";
import { Badge } from "@/components/ui/badge";
import { LogOut, Coins, Play } from "lucide-react";

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
}

interface PublicDashboardProps {
  user: User;
  tasks: Task[];
  onLogout: () => void;
  onTaskComplete: (taskId: string, reward: number) => void;
  onUpiUpdate: (upiId: string) => void;
  onWithdraw: (amount: number) => void;
}

export function PublicDashboard({ 
  user, 
  tasks, 
  onLogout, 
  onTaskComplete, 
  onUpiUpdate, 
  onWithdraw 
}: PublicDashboardProps) {
  const [showVideo, setShowVideo] = useState(false);

  const handleWatchVideo = () => {
    setShowVideo(true);
    // Simulate video watching - in real app, this would be an actual video player
    setTimeout(() => {
      setShowVideo(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card shadow-card border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-coin rounded-full flex items-center justify-center shadow-coin">
                <Coins className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  Easy Earn
                </h1>
                <p className="text-sm text-muted-foreground">Welcome back, {user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="bg-gradient-coin text-white border-0 px-3 py-1">
                <Coins className="w-4 h-4 mr-1" />
                {user.balance} coins
              </Badge>
              <Button variant="outline" onClick={onLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Tasks */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Available Tasks</h2>
                <p className="text-muted-foreground">Complete tasks to earn coins</p>
              </div>
              <Badge variant="outline" className="text-success border-success">
                {tasks.length} tasks available
              </Badge>
            </div>

            {tasks.length === 0 ? (
              <Card className="shadow-card">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                    <Coins className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">No Tasks Available</h3>
                  <p className="text-muted-foreground text-center">
                    Check back later for new earning opportunities!
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6">
                {tasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onTaskComplete={onTaskComplete}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Right Column - Wallet & Video */}
          <div className="space-y-6">
            <WalletCard
              balance={user.balance}
              upiId={user.upiId}
              onUpiUpdate={onUpiUpdate}
              onWithdraw={onWithdraw}
            />

            {/* Video Section */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Play className="w-5 h-5" />
                  Bonus Video
                </CardTitle>
                <CardDescription>
                  Watch promotional content for additional insights
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!showVideo ? (
                  <Button 
                    onClick={handleWatchVideo}
                    className="w-full bg-gradient-primary hover:opacity-90"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Watch Video
                  </Button>
                ) : (
                  <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-2">
                        <Play className="w-6 h-6 text-primary-foreground" />
                      </div>
                      <p className="text-sm text-muted-foreground">Video Playing...</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-lg">Your Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Total Earned</span>
                  <span className="font-semibold text-success">₹{user.balance}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Available Tasks</span>
                  <span className="font-semibold">{tasks.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Min. Withdrawal</span>
                  <span className="font-semibold">₹50</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}