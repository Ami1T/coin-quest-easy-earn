
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface WalletCardProps {
  balance: number;
  upiId: string;
  onUpiUpdate: (upiId: string) => void;
  onWithdraw: (amount: number) => void;
}

export function WalletCard({ balance, upiId, onUpiUpdate, onWithdraw }: WalletCardProps) {
  const [newUpiId, setNewUpiId] = useState(upiId);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const { toast } = useToast();

  // Convert coins to rupees (100 coins = 1₹)
  const balanceInRupees = balance / 100;
  const minWithdrawalInCoins = 5000; // 50₹ = 5000 coins
  const minWithdrawalInRupees = minWithdrawalInCoins / 100;

  const handleUpiUpdate = () => {
    if (!newUpiId.trim()) {
      toast({
        title: "Invalid UPI ID",
        description: "Please enter a valid UPI ID",
        variant: "destructive"
      });
      return;
    }
    onUpiUpdate(newUpiId);
    toast({
      title: "UPI ID Updated",
      description: "Your UPI ID has been updated successfully",
    });
  };

  const handleWithdraw = () => {
    const amountInRupees = parseFloat(withdrawAmount);
    const amountInCoins = amountInRupees * 100;
    
    if (amountInRupees < minWithdrawalInRupees) {
      toast({
        title: "Minimum Withdrawal",
        description: `Minimum withdrawal amount is ₹${minWithdrawalInRupees} (${minWithdrawalInCoins} coins)`,
        variant: "destructive"
      });
      return;
    }
    if (amountInCoins > balance) {
      toast({
        title: "Insufficient Balance",
        description: "You don't have enough coins for this withdrawal",
        variant: "destructive"
      });
      return;
    }
    onWithdraw(amountInCoins);
    setWithdrawAmount("");
    toast({
      title: "Withdrawal Requested",
      description: `Withdrawal of ₹${amountInRupees} (${amountInCoins} coins) has been requested`,
    });
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-coin rounded-full flex items-center justify-center shadow-coin">
            <span className="text-white font-bold text-sm">₹</span>
          </div>
          My Wallet
        </CardTitle>
        <CardDescription>Manage your earnings and withdrawals</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Conversion Rate Info */}
        <div className="text-center p-4 bg-primary/10 rounded-lg border border-primary/20">
          <div className="text-lg font-semibold text-primary">100 coins = ₹1</div>
          <div className="text-sm text-muted-foreground">Current conversion rate</div>
        </div>

        {/* Balance Display */}
        <div className="text-center p-6 bg-gradient-success rounded-lg text-white">
          <div className="text-3xl font-bold">₹{balanceInRupees.toFixed(2)}</div>
          <div className="text-success-foreground/80">Available Balance</div>
          <Badge variant="secondary" className="mt-2 bg-white/20 text-white border-white/30">
            {balance} Coins
          </Badge>
        </div>

        {/* UPI ID Section */}
        <div className="space-y-3">
          <Label htmlFor="upiId">UPI ID</Label>
          <div className="flex gap-2">
            <Input
              id="upiId"
              value={newUpiId}
              onChange={(e) => setNewUpiId(e.target.value)}
              placeholder="yourname@upi"
              className="flex-1"
            />
            <Button onClick={handleUpiUpdate} variant="outline">
              Update
            </Button>
          </div>
          {upiId && (
            <div className="text-sm text-muted-foreground">
              Current UPI ID: <span className="font-medium">{upiId}</span>
            </div>
          )}
        </div>

        {/* Withdrawal Section */}
        <div className="space-y-3">
          <Label htmlFor="withdrawAmount">Withdraw Amount in ₹ (Min: ₹50)</Label>
          <div className="flex gap-2">
            <Input
              id="withdrawAmount"
              type="number"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              placeholder="Enter amount in ₹"
              min={minWithdrawalInRupees}
              max={balanceInRupees}
              step="0.01"
              className="flex-1"
            />
            <Button 
              onClick={handleWithdraw} 
              disabled={!withdrawAmount || parseFloat(withdrawAmount) < minWithdrawalInRupees || parseFloat(withdrawAmount) > balanceInRupees}
              className="bg-gradient-primary hover:opacity-90"
            >
              Withdraw
            </Button>
          </div>
          <div className="text-xs text-muted-foreground">
            Withdrawals are processed within 24-48 hours. You have {balance} coins (₹{balanceInRupees.toFixed(2)})
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
