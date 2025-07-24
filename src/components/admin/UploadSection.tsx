import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Plus, Link, FileText } from "lucide-react";

interface Task {
  id: string;
  title: string;
  description: string;
  url?: string;
  reward: number;
  type: "link" | "text";
  content?: string;
}

interface UploadSectionProps {
  onAddTask: (task: Omit<Task, "id">) => void;
}

export function UploadSection({ onAddTask }: UploadSectionProps) {
  const [taskType, setTaskType] = useState<"link" | "text">("link");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [content, setContent] = useState("");
  const [reward, setReward] = useState("2");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !description.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    if (taskType === "link" && !url.trim()) {
      toast({
        title: "Missing URL",
        description: "Please provide a valid URL for link tasks",
        variant: "destructive"
      });
      return;
    }

    if (taskType === "text" && !content.trim()) {
      toast({
        title: "Missing Content",
        description: "Please provide content for text tasks",
        variant: "destructive"
      });
      return;
    }

    const newTask: Omit<Task, "id"> = {
      title: title.trim(),
      description: description.trim(),
      type: taskType,
      reward: parseInt(reward),
      ...(taskType === "link" ? { url: url.trim() } : { content: content.trim() })
    };

    onAddTask(newTask);
    
    // Reset form
    setTitle("");
    setDescription("");
    setUrl("");
    setContent("");
    setReward("2");
    
    toast({
      title: "Task Added Successfully! 🎉",
      description: "The task is now available to all users",
    });
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
            <Plus className="w-4 h-4 text-white" />
          </div>
          Upload New Task
        </CardTitle>
        <CardDescription>
          Create tasks for users to complete and earn rewards
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Task Type Selection */}
          <div className="space-y-2">
            <Label htmlFor="taskType">Task Type</Label>
            <Select value={taskType} onValueChange={(value: "link" | "text") => setTaskType(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select task type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="link">
                  <div className="flex items-center gap-2">
                    <Link className="w-4 h-4" />
                    Website Link Task
                  </div>
                </SelectItem>
                <SelectItem value="text">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Text Reading Task
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Task Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Task Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter task title"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="reward">Reward (Coins) * - Set Unlimited</Label>
              <Input
                id="reward"
                type="number"
                value={reward}
                onChange={(e) => setReward(e.target.value)}
                placeholder="2"
                min="1"
                required
              />
              <div className="text-xs text-muted-foreground">
                You can set any amount of coins as reward
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Task Description *</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what users need to do"
              rows={3}
              required
            />
          </div>

          {/* Conditional Fields */}
          {taskType === "link" && (
            <div className="space-y-2">
              <Label htmlFor="url">Website URL *</Label>
              <Input
                id="url"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                required
              />
              <div className="text-xs text-muted-foreground">
                Users will visit this website for 2 minutes to earn coins
              </div>
            </div>
          )}

          {taskType === "text" && (
            <div className="space-y-2">
              <Label htmlFor="content">Text Content *</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Enter the text content users need to read"
                rows={6}
                required
              />
              <div className="text-xs text-muted-foreground">
                Users will read this content for 2 minutes to earn coins
              </div>
            </div>
          )}

          <Button 
            type="submit" 
            className="w-full bg-gradient-primary hover:opacity-90 transition-all duration-200"
            size="lg"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Task
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}