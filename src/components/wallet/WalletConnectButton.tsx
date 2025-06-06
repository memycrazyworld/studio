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
  const [isOpen, setIsOpen] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [uptBalance, setUptBalance] = useState(0);
  const [discountApplied, setDiscountApplied] = useState(false);
  const { toast } = useToast();

  const handleConnect = () => {
    // Simulate wallet connection
    setIsConnected(true);
    setUptBalance(Math.floor(Math.random() * 500) + 50); // Random balance
    setIsOpen(true);
    toast({ title: "Wallet Connected", description: "Successfully connected to your Uprock wallet." });
  };

  const handleApplyDiscount = () => {
    if (uptBalance >= 100) {
      setUptBalance(prev => prev - 100);
      setDiscountApplied(true);
      onDiscountToggle(true);
      toast({ title: "Discount Applied!", description: "100 $UPT redeemed for a 10% discount." });
      setIsOpen(false);
    } else {
      toast({ variant: "destructive", title: "Insufficient Balance", description: "Not enough $UPT to apply discount." });
    }
  };

  const handleRemoveDiscount = () => {
    setDiscountApplied(false);
    onDiscountToggle(false);
    // Optionally, refund tokens in a real scenario
    // setUptBalance(prev => prev + 100); 
    toast({ title: "Discount Removed", description: "The 10% discount has been removed." });
    setIsOpen(false);
  }

  if (isConnected && discountApplied) {
    return (
      <Button onClick={() => setIsOpen(true)} variant="outline" className="bg-accent text-accent-foreground hover:bg-accent/90">
        <Wallet className="mr-2 h-4 w-4" />
        Discount Active ({uptBalance} $UPT)
      </Button>
    );
  }
  
  if (isConnected) {
    return (
      <Button onClick={() => setIsOpen(true)} variant="outline">
        <Wallet className="mr-2 h-4 w-4" />
        {uptBalance} $UPT
      </Button>
    );
  }

  return (
    <>
      <Button onClick={handleConnect}>
        <Wallet className="mr-2 h-4 w-4" />
        Connect Wallet
      </Button>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isConnected ? "Uprock Wallet" : "Connect Wallet"}</DialogTitle>
            <DialogDescription>
              {isConnected ? `You have ${uptBalance} $UPT tokens.` : "Connect your Uprock wallet to use $UPT tokens for discounts."}
            </DialogDescription>
          </DialogHeader>
          {isConnected && (
            <div className="py-4">
              {discountApplied ? (
                <p className="text-sm text-green-600">A 10% discount is currently active on deals!</p>
              ): (
                <p className="text-sm">Redeem 100 $UPT tokens for a 10% discount on your next booking.</p>
              )}
            </div>
          )}
          <DialogFooter>
            {isConnected ? (
              discountApplied ? (
                <Button variant="destructive" onClick={handleRemoveDiscount}>Remove Discount</Button>
              ) : (
                <Button onClick={handleApplyDiscount} disabled={uptBalance < 100}>
                  Apply 10% Discount (100 $UPT)
                </Button>
              )
            ) : (
              <Button onClick={handleConnect}>Connect Now</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
