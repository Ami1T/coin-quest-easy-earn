import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Share2, Copy, Users, Gift } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ReferralSectionProps {
  userEmail: string;
  referralCount?: number;
  referralEarnings?: number;
}

export function ReferralSection({ userEmail, referralCount = 0, referralEarnings = 0 }: ReferralSectionProps) {
  const { toast } = useToast();
  
  // Generate referral code based on user email
  const referralCode = userEmail.split('@')[0].toUpperCase() + Math.random().toString(36).substr(2, 4).toUpperCase();
  const referralLink = `${window.location.origin}?ref=${referralCode}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    toast({
      title: "Link Copied!",
      description: "Referral link copied to clipboard",
    });
  };

  const handleShareWhatsApp = () => {
    const text = `Join Easy Earn and start earning money by completing simple tasks! Use my referral code: ${referralCode}. ${referralLink}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleShareTelegram = () => {
    const text = `Join Easy Earn and start earning money by completing simple tasks! Use my referral code: ${referralCode}. ${referralLink}`;
    window.open(`https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleShareFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`, '_blank');
  };

  const handleShareTwitter = () => {
    const text = `Join Easy Earn and start earning money by completing simple tasks! Use my referral code: ${referralCode}`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(referralLink)}`, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Referral Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="shadow-card">
          <CardContent className="flex items-center p-6">
            <div className="w-12 h-12 bg-gradient-success rounded-full flex items-center justify-center mr-4">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold">{referralCount}</p>
              <p className="text-sm text-muted-foreground">Total Referrals</p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="flex items-center p-6">
            <div className="w-12 h-12 bg-gradient-coin rounded-full flex items-center justify-center mr-4">
              <Gift className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold">₹{referralEarnings}</p>
              <p className="text-sm text-muted-foreground">Referral Earnings</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* How it Works */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="w-5 h-5" />
            How Referral Program Works
          </CardTitle>
          <CardDescription>
            Earn ₹1 for every friend you refer who joins Easy Earn
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-white font-bold">1</span>
              </div>
              <p className="text-sm font-medium">Share Your Link</p>
              <p className="text-xs text-muted-foreground">Send your referral link to friends</p>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-white font-bold">2</span>
              </div>
              <p className="text-sm font-medium">Friend Joins</p>
              <p className="text-xs text-muted-foreground">They sign up using your link</p>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-white font-bold">3</span>
              </div>
              <p className="text-sm font-medium">Earn ₹1</p>
              <p className="text-xs text-muted-foreground">Get ₹1 added to your wallet</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Referral Link */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Your Referral Link</CardTitle>
          <CardDescription>
            Share this link with your friends and family
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="referralCode">Your Referral Code</Label>
            <div className="flex gap-2">
              <Input
                id="referralCode"
                value={referralCode}
                readOnly
                className="flex-1"
              />
              <Badge variant="secondary" className="px-3 py-2">
                ₹1 per referral
              </Badge>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="referralLink">Referral Link</Label>
            <div className="flex gap-2">
              <Input
                id="referralLink"
                value={referralLink}
                readOnly
                className="flex-1"
              />
              <Button onClick={handleCopyLink} variant="outline">
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Social Media Sharing */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2 className="w-5 h-5" />
            Share on Social Media
          </CardTitle>
          <CardDescription>
            Share your referral link directly on social platforms
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button
              onClick={handleShareWhatsApp}
              variant="outline"
              className="flex-1 bg-green-50 hover:bg-green-100 border-green-200"
            >
              <span className="mr-2">📱</span>
              WhatsApp
            </Button>
            <Button
              onClick={handleShareTelegram}
              variant="outline"
              className="flex-1 bg-blue-50 hover:bg-blue-100 border-blue-200"
            >
              <span className="mr-2">✈️</span>
              Telegram
            </Button>
            <Button
              onClick={handleShareFacebook}
              variant="outline"
              className="flex-1 bg-blue-50 hover:bg-blue-100 border-blue-200"
            >
              <span className="mr-2">📘</span>
              Facebook
            </Button>
            <Button
              onClick={handleShareTwitter}
              variant="outline"
              className="flex-1 bg-sky-50 hover:bg-sky-100 border-sky-200"
            >
              <span className="mr-2">🐦</span>
              Twitter
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}