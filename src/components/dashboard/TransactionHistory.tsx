import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { History, Coins, ArrowUpRight, ArrowDownLeft, Calendar } from "lucide-react";

interface Transaction {
  id: string;
  type: "earning" | "withdrawal";
  amount: number;
  description: string;
  date: string;
  status: "completed" | "pending" | "failed";
}

interface TransactionHistoryProps {
  userEmail: string;
}

export function TransactionHistory({ userEmail }: TransactionHistoryProps) {
  // Get transaction history from localStorage
  const getTransactionHistory = (): Transaction[] => {
    try {
      const stored = localStorage.getItem('easyEarnTransactions');
      const allTransactions: Transaction[] = stored ? JSON.parse(stored) : [];
      
      // Filter transactions for current user
      const userTransactions = allTransactions.filter(t => 
        t.description.includes(userEmail) || 
        t.description.includes("Task completion") || 
        t.description.includes("Withdrawal")
      );
      
      // Sort by date (newest first)
      return userTransactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } catch (error) {
      console.error('Error loading transaction history:', error);
      return [];
    }
  };

  // Get earning history from localStorage
  const getEarningHistory = (): Transaction[] => {
    try {
      const stored = localStorage.getItem('easyEarnUsers');
      const users = stored ? JSON.parse(stored) : [];
      const currentUser = users.find((u: any) => u.email === userEmail);
      
      if (!currentUser || !currentUser.completedTaskIds) {
        return [];
      }

      // Create earning transactions from completed tasks
      return currentUser.completedTaskIds.map((taskId: string, index: number) => ({
        id: `earning-${taskId}-${index}`,
        type: "earning" as const,
        amount: 200, // Default task reward
        description: `Task completion - ${taskId}`,
        date: new Date(Date.now() - (index * 24 * 60 * 60 * 1000)).toISOString(), // Simulate different dates
        status: "completed" as const
      }));
    } catch (error) {
      console.error('Error loading earning history:', error);
      return [];
    }
  };

  const transactions = getTransactionHistory();
  const earnings = getEarningHistory();
  const allHistory = [...transactions, ...earnings].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const getTransactionIcon = (type: string) => {
    return type === "earning" ? (
      <ArrowDownLeft className="w-4 h-4 text-success" />
    ) : (
      <ArrowUpRight className="w-4 h-4 text-destructive" />
    );
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      completed: "default",
      pending: "secondary",
      failed: "destructive"
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants] || "secondary"} className="text-xs">
        {status}
      </Badge>
    );
  };

  const formatAmount = (amount: number, type: string) => {
    const rupees = (amount / 100).toFixed(2);
    return type === "earning" ? `+₹${rupees}` : `-₹${rupees}`;
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
            <History className="w-4 h-4 text-white" />
          </div>
          Transaction & Earning History
        </CardTitle>
        <CardDescription>
          View all your earnings and withdrawal transactions
        </CardDescription>
      </CardHeader>
      <CardContent>
        {allHistory.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <History className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No Transaction History</h3>
            <p className="text-muted-foreground">
              Complete tasks to start earning and see your history here
            </p>
          </div>
        ) : (
          <ScrollArea className="h-80">
            <div className="space-y-3">
              {allHistory.slice(0, 20).map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-background rounded-full flex items-center justify-center shadow-sm">
                      {getTransactionIcon(transaction.type)}
                    </div>
                    <div>
                      <div className="font-medium text-sm">
                        {transaction.type === "earning" ? "Task Reward" : "Withdrawal"}
                      </div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(transaction.date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-semibold text-sm ${
                      transaction.type === "earning" ? "text-success" : "text-destructive"
                    }`}>
                      {formatAmount(transaction.amount, transaction.type)}
                    </div>
                    <div className="flex items-center gap-1 justify-end">
                      <Coins className="w-3 h-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        {transaction.amount} coins
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
        
        {allHistory.length > 20 && (
          <div className="text-center mt-4 text-sm text-muted-foreground">
            Showing recent 20 transactions
          </div>
        )}
      </CardContent>
    </Card>
  );
}