
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Wallet } from "lucide-react";

interface WalletConnectButtonProps {
  onDiscountToggle: (isDiscounted: boolean) => void;
}

export function WalletConnectButton({ onDiscountToggle }: WalletConnectButtonProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [uptBalance, setUptBalance] = useState(0);
  const [discountAppliedState, setDiscountAppliedState] = useState(false); // Renamed to avoid conflict with prop
  const { toast } = useToast();

  const handleConnect = () => {
    setIsConnected(true);
    setUptBalance(Math.floor(Math.random() * 500) + 50); 
    setIsDialogOpen(true);
    toast({ title: "Wallet Connected", description: "Successfully connected to your Uprock wallet." });
  };

  const handleApplyDiscount = () => {
    if (uptBalance >= 100) {
      setUptBalance(prev => prev - 100);
      setDiscountAppliedState(true);
      onDiscountToggle(true);
      toast({ title: "Discount Applied!", description: "100 $UPT redeemed for a 10% discount." });
      setIsDialogOpen(false);
    } else {
      toast({ variant: "destructive", title: "Insufficient Balance", description: "Not enough $UPT to apply discount." });
    }
  };

  const handleRemoveDiscount = () => {
    setDiscountAppliedState(false);
    onDiscountToggle(false);
    // To prevent refunding tokens every time dialog is opened after removing discount,
    // we don't automatically add back 100 $UPT here. This simulates tokens being spent.
    // If re-applying discount should be possible with same initial tokens, 
    // a more complex balance management would be needed.
    toast({ title: "Discount Removed", description: "The 10% discount has been removed." });
    setIsDialogOpen(false);
  }

  const openDialog = () => setIsDialogOpen(true);

  if (isConnected) {
    return (
      <>
        <Button onClick={openDialog} variant={discountAppliedState ? "secondary" : "outline"} className={discountAppliedState ? "bg-green-600 hover:bg-green-700 text-white" : ""}>
          <Wallet className="mr-2 h-4 w-4" />
          {discountAppliedState ? "Discount Active" : "Wallet Connected"} ({uptBalance} $UPT)
        </Button>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Uprock Wallet</DialogTitle>
              <DialogDescription>
                You have {uptBalance} $UPT tokens available.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              {discountAppliedState ? (
                <p className="text-sm text-green-600 font-semibold">A 10% discount is currently active on deals!</p>
              ): (
                <p className="text-sm">Redeem 100 $UPT tokens for a 10% discount on your travel deals.</p>
              )}
            </div>
            <DialogFooter>
              {discountAppliedState ? (
                <Button variant="destructive" onClick={handleRemoveDiscount}>Remove Discount</Button>
              ) : (
                <Button onClick={handleApplyDiscount} disabled={uptBalance < 100} className="bg-accent hover:bg-accent/90 text-accent-foreground">
                  Apply 10% Discount (100 $UPT)
                </Button>
              )}
               <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  return (
    <Button onClick={handleConnect} className="bg-primary hover:bg-primary/90">
      <Wallet className="mr-2 h-4 w-4" />
      Connect Wallet
    </Button>
  );
}
