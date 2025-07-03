import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Edit, Trash2, Link, FileText } from "lucide-react";

interface Task {
  id: string;
  title: string;
  description: string;
  url?: string;
  reward: number;
  type: "link" | "text";
  content?: string;
}

interface TaskManagementProps {
  tasks: Task[];
  onEditTask: (taskId: string, updatedTask: Omit<Task, "id">) => void;
  onDeleteTask: (taskId: string) => void;
}

export function TaskManagement({ tasks, onEditTask, onDeleteTask }: TaskManagementProps) {
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    url: "",
    content: "",
    reward: "2",
    type: "link" as "link" | "text"
  });
  const { toast } = useToast();

  const handleEditClick = (task: Task) => {
    setEditingTask(task);
    setEditForm({
      title: task.title,
      description: task.description,
      url: task.url || "",
      content: task.content || "",
      reward: task.reward.toString(),
      type: task.type
    });
  };

  const handleSaveEdit = () => {
    if (!editingTask) return;

    if (!editForm.title.trim() || !editForm.description.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    if (editForm.type === "link" && !editForm.url.trim()) {
      toast({
        title: "Missing URL",
        description: "Please provide a valid URL for link tasks",
        variant: "destructive"
      });
      return;
    }

    if (editForm.type === "text" && !editForm.content.trim()) {
      toast({
        title: "Missing Content",
        description: "Please provide content for text tasks",
        variant: "destructive"
      });
      return;
    }

    const updatedTask: Omit<Task, "id"> = {
      title: editForm.title.trim(),
      description: editForm.description.trim(),
      type: editForm.type,
      reward: parseInt(editForm.reward),
      ...(editForm.type === "link" ? { url: editForm.url.trim() } : { content: editForm.content.trim() })
    };

    onEditTask(editingTask.id, updatedTask);
    setEditingTask(null);
    
    toast({
      title: "Task Updated Successfully! 🎉",
      description: "The task has been updated",
    });
  };

  const handleDelete = (taskId: string) => {
    onDeleteTask(taskId);
    toast({
      title: "Task Deleted",
      description: "The task has been removed successfully",
    });
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle>Existing Tasks ({tasks.length})</CardTitle>
        <CardDescription>
          Manage uploaded tasks - edit details or remove tasks
        </CardDescription>
      </CardHeader>
      <CardContent>
        {tasks.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No tasks uploaded yet. Use the form above to create your first task.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {tasks.map((task) => (
              <div key={task.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold">{task.title}</h4>
                      <Badge variant="outline" className="text-xs">
                        {task.type === "link" ? (
                          <><Link className="w-3 h-3 mr-1" />Link</>
                        ) : (
                          <><FileText className="w-3 h-3 mr-1" />Text</>
                        )}
                      </Badge>
                      <Badge variant="secondary" className="bg-gradient-coin text-white border-0 text-xs">
                        +{task.reward} coins
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{task.description}</p>
                    {task.type === "link" && task.url && (
                      <p className="text-xs text-blue-600 truncate">{task.url}</p>
                    )}
                    {task.type === "text" && task.content && (
                      <p className="text-xs text-muted-foreground line-clamp-2">{task.content}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEditClick(task)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Edit Task</DialogTitle>
                          <DialogDescription>
                            Update the task details below
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="edit-title">Task Title *</Label>
                              <Input
                                id="edit-title"
                                value={editForm.title}
                                onChange={(e) => setEditForm(prev => ({...prev, title: e.target.value}))}
                                placeholder="Enter task title"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="edit-reward">Reward (Coins) *</Label>
                              <Input
                                id="edit-reward"
                                type="number"
                                value={editForm.reward}
                                onChange={(e) => setEditForm(prev => ({...prev, reward: e.target.value}))}
                                min="1"
                                max="100"
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="edit-type">Task Type</Label>
                            <Select value={editForm.type} onValueChange={(value: "link" | "text") => setEditForm(prev => ({...prev, type: value}))}>
                              <SelectTrigger>
                                <SelectValue />
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

                          <div className="space-y-2">
                            <Label htmlFor="edit-description">Task Description *</Label>
                            <Textarea
                              id="edit-description"
                              value={editForm.description}
                              onChange={(e) => setEditForm(prev => ({...prev, description: e.target.value}))}
                              placeholder="Describe what users need to do"
                              rows={3}
                            />
                          </div>

                          {editForm.type === "link" && (
                            <div className="space-y-2">
                              <Label htmlFor="edit-url">Website URL *</Label>
                              <Input
                                id="edit-url"
                                type="url"
                                value={editForm.url}
                                onChange={(e) => setEditForm(prev => ({...prev, url: e.target.value}))}
                                placeholder="https://example.com"
                              />
                            </div>
                          )}

                          {editForm.type === "text" && (
                            <div className="space-y-2">
                              <Label htmlFor="edit-content">Text Content *</Label>
                              <Textarea
                                id="edit-content"
                                value={editForm.content}
                                onChange={(e) => setEditForm(prev => ({...prev, content: e.target.value}))}
                                placeholder="Enter the text content users need to read"
                                rows={6}
                              />
                            </div>
                          )}

                          <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setEditingTask(null)}>
                              Cancel
                            </Button>
                            <Button onClick={handleSaveEdit} className="bg-gradient-primary hover:opacity-90">
                              Save Changes
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => handleDelete(task.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}