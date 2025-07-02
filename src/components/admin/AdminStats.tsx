import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, TrendingUp, DollarSign, Activity } from "lucide-react";

interface AdminStatsProps {
  activeUsers: number;
  monthlyTraffic: number;
  totalTransactions: number;
  totalWithdrawals: number;
}

export function AdminStats({ activeUsers, monthlyTraffic, totalTransactions, totalWithdrawals }: AdminStatsProps) {
  const stats = [
    {
      title: "Active Users",
      value: activeUsers,
      description: "Currently online",
      icon: Users,
      color: "bg-gradient-primary",
      trend: "+12% from last week"
    },
    {
      title: "Monthly Traffic",
      value: monthlyTraffic,
      description: "Total visitors this month",
      icon: TrendingUp,
      color: "bg-gradient-success",
      trend: "+25% from last month"
    },
    {
      title: "Total Transactions",
      value: totalTransactions,
      description: "Completed tasks",
      icon: Activity,
      color: "bg-gradient-coin",
      trend: "+8% from yesterday"
    },
    {
      title: "Total Withdrawals",
      value: `₹${totalWithdrawals}`,
      description: "Amount withdrawn",
      icon: DollarSign,
      color: "bg-trust text-white",
      trend: "₹2,450 pending"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="shadow-card hover:shadow-coin/10 transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${stat.color}`}>
                <Icon className="w-4 h-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <CardDescription className="text-xs">{stat.description}</CardDescription>
              <Badge variant="secondary" className="mt-2 text-xs">
                {stat.trend}
              </Badge>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}