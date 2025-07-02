import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ExternalLink, Clock, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Task {
  id: string;
  title: string;
  description: string;
  url?: string;
  reward: number;
  type: "link" | "text";
  content?: string;
}

interface TaskCardProps {
  task: Task;
  onTaskComplete: (taskId: string, reward: number) => void;
}

export function TaskCard({ task, onTaskComplete }: TaskCardProps) {
  const [isActive, setIsActive] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive && timeSpent < 120) {
      interval = setInterval(() => {
        setTimeSpent(prev => {
          const newTime = prev + 1;
          if (newTime >= 120 && !isCompleted) {
            setIsCompleted(true);
            onTaskComplete(task.id, task.reward);
            toast({
              title: "Task Completed! 🎉",
              description: `You earned ${task.reward} coins (₹${task.reward})`,
            });
            setIsActive(false);
          }
          return newTime;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeSpent, isCompleted, task.id, task.reward, onTaskComplete, toast]);

  const handleStartTask = () => {
    if (task.type === "link" && task.url) {
      window.open(task.url, '_blank');
      setIsActive(true);
      toast({
        title: "Task Started",
        description: "Stay on the website for 2 minutes to earn coins!",
      });
    }
  };

  const handleReadTask = () => {
    setIsActive(true);
    toast({
      title: "Reading Task Started",
      description: "Read the content for 2 minutes to earn coins!",
    });
  };

  const progress = Math.min((timeSpent / 120) * 100, 100);
  const remainingTime = Math.max(120 - timeSpent, 0);
  const minutes = Math.floor(remainingTime / 60);
  const seconds = remainingTime % 60;

  return (
    <Card className={`shadow-card transition-all duration-300 ${isActive ? 'ring-2 ring-accent shadow-coin/20' : ''} ${isCompleted ? 'bg-success/5' : ''}`}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">{task.title}</CardTitle>
            <CardDescription className="mt-1">{task.description}</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-gradient-coin text-white border-0">
              +{task.reward} coins
            </Badge>
            {isCompleted && (
              <CheckCircle className="w-5 h-5 text-success" />
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {task.type === "text" && task.content && (
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm">{task.content}</p>
          </div>
        )}

        {task.type === "link" && task.url && (
          <div className="flex items-center gap-2 p-3 bg-trust-light rounded-lg">
            <ExternalLink className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium truncate">{task.url}</span>
          </div>
        )}

        {isActive && !isCompleted && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                Time remaining
              </span>
              <span className="font-mono font-medium">
                {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        {!isCompleted && (
          <Button 
            onClick={task.type === "link" ? handleStartTask : handleReadTask}
            disabled={isActive}
            className="w-full bg-gradient-primary hover:opacity-90 transition-all duration-200"
          >
            {isActive ? 'Task in Progress...' : `Start Task - Earn ₹${task.reward}`}
          </Button>
        )}

        {isCompleted && (
          <Button disabled className="w-full bg-success text-success-foreground">
            ✓ Task Completed - ₹{task.reward} Earned
          </Button>
        )}
      </CardContent>
    </Card>
  );
}