
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { Wallet, UserCircle, LogOut, Tag, Settings, ChevronDown } from "lucide-react";

interface WalletConnectButtonProps {
  onDiscountToggle: (isDiscounted: boolean) => void;
}

export function WalletConnectButton({ onDiscountToggle }: WalletConnectButtonProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [uptBalance, setUptBalance] = useState(0);
  const [discountAppliedInternal, setDiscountAppliedInternal] = useState(false);
  const { toast } = useToast();
  const mockWalletAddress = "So11...1112"; // Shortened for display

  useEffect(() => {
    const storedConnectionStatus = localStorage.getItem("walletConnected") === "true";
    const storedUptBalance = localStorage.getItem("uptBalance");
    const storedDiscountStatus = localStorage.getItem("discountApplied") === "true";

    if (storedConnectionStatus) {
      setIsConnected(true);
      setUptBalance(storedUptBalance ? parseInt(storedUptBalance, 10) : 0);
      if (storedDiscountStatus) {
        setDiscountAppliedInternal(true);
        onDiscountToggle(true);
      }
    }
  }, [onDiscountToggle]);

  const handleConnect = () => {
    const newBalance = Math.floor(Math.random() * 500) + 50;
    setIsConnected(true);
    setUptBalance(newBalance);
    localStorage.setItem("walletConnected", "true");
    localStorage.setItem("uptBalance", newBalance.toString());
    toast({ title: "Wallet Connected", description: `Successfully connected to your Uprock wallet. Balance: ${newBalance} $UPT` });
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setUptBalance(0);
    setDiscountAppliedInternal(false);
    onDiscountToggle(false);
    localStorage.removeItem("walletConnected");
    localStorage.removeItem("uptBalance");
    localStorage.removeItem("discountApplied");
    toast({ title: "Wallet Disconnected", description: "You have been successfully disconnected." });
  };

  const handleApplyDiscount = () => {
    if (uptBalance >= 100) {
      const newBalance = uptBalance - 100;
      setUptBalance(newBalance);
      localStorage.setItem("uptBalance", newBalance.toString());
      
      setDiscountAppliedInternal(true);
      onDiscountToggle(true);
      localStorage.setItem("discountApplied", "true");
      toast({ title: "Discount Applied!", description: "100 $UPT redeemed for a 10% discount." });
      setIsDialogOpen(false);
    } else {
      toast({ variant: "destructive", title: "Insufficient Balance", description: "Not enough $UPT to apply discount." });
    }
  };

  const handleRemoveDiscount = () => {
    setDiscountAppliedInternal(false);
    onDiscountToggle(false);
    localStorage.setItem("discountApplied", "false");
    // We don't refund tokens here to simulate them being spent.
    toast({ title: "Discount Removed", description: "The 10% discount has been removed." });
    setIsDialogOpen(false);
  };

  if (isConnected) {
    return (
      <>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant={discountAppliedInternal ? "secondary" : "outline"} 
              className={`flex items-center ${discountAppliedInternal ? "bg-green-600 hover:bg-green-700 text-white" : "border-primary text-primary hover:bg-primary/10"}`}
            >
              <Wallet className="mr-2 h-4 w-4" />
              <span>{discountAppliedInternal ? "Discount Active" : "Wallet"} ({uptBalance} $UPT)</span>
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Wallet ({mockWalletAddress})</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/account" className="flex items-center cursor-pointer">
                <UserCircle className="mr-2 h-4 w-4" />
                My Account
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setIsDialogOpen(true)} className="flex items-center cursor-pointer">
              <Tag className="mr-2 h-4 w-4" />
              <span>{discountAppliedInternal ? "Manage Discount" : "Apply Discount"}</span>
            </DropdownMenuItem>
             <DropdownMenuItem onClick={() => alert("Feature coming soon!")} className="flex items-center cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              Wallet Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleDisconnect} className="flex items-center text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer">
              <LogOut className="mr-2 h-4 w-4" />
              Disconnect
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Uprock Wallet Discount</DialogTitle>
              <DialogDescription>
                You have {uptBalance} $UPT tokens available.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              {discountAppliedInternal ? (
                <p className="text-sm text-green-600 font-semibold">A 10% discount is currently active on deals!</p>
              ): (
                <p className="text-sm">Redeem 100 $UPT tokens for a 10% discount on your travel deals.</p>
              )}
            </div>
            <DialogFooter>
              {discountAppliedInternal ? (
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
