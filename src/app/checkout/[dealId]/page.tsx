
"use client";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ShoppingCart, Copy, QrCode } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import type { TravelDeal } from "@/types";
import { fetchDealById } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";

// Custom Solana icon (simple SVG)
const SolanaIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" clipRule="evenodd" d="M6.22569 3.80005H17.7743L15.5081 5.81255H8.4919L6.22569 3.80005ZM2.83501 6.80005H5.22569V8.60005H2.83501V6.80005ZM18.7743 6.80005H21.165V8.60005H18.7743V6.80005ZM9.75811 7.12505L11.9398 5.18755L14.2419 7.12505H9.75811ZM2.83501 9.80005H5.22569V11.6H2.83501V9.80005ZM18.7743 9.80005H21.165V11.6H18.7743V9.80005ZM6.22569 12.8H17.7743L15.5081 14.8125H8.4919L6.22569 12.8ZM2.83501 12.8H5.22569V14.6H2.83501V12.8ZM18.7743 12.8H21.165V14.6H18.7743V12.8ZM9.75811 13.125L11.9398 11.1875L14.2419 13.125H9.75811ZM2.83501 15.8H5.22569V17.6H2.83501V15.8ZM18.7743 15.8H21.165V17.6H18.7743V15.8ZM6.22569 18.8H17.7743L15.5081 20.8125H8.4919L6.22569 18.8ZM9.75811 19.125L11.9398 17.1875L14.2419 19.125H9.75811Z" fill="currentColor"/>
  </svg>
);


export default function CheckoutPage() {
  const params = useParams();
  const dealId = params.dealId as string;
  const [deal, setDeal] = useState<TravelDeal | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDiscountApplied, setIsDiscountApplied] = useState(false);
  const { toast } = useToast();
  const [selectedCrypto, setSelectedCrypto] = useState("USDC-SOL"); // Default to a Solana based token
  const mockSolanaWalletAddress = "So11111111111111111111111111111111111111112"; 

  const handleDiscountToggleStub = (isDiscounted: boolean) => {
    // This is a stub, actual discount logic is managed via localStorage for demo
    // and reflected in finalPrice calculation.
  };

  useEffect(() => {
    if (dealId) {
      fetchDealById(dealId).then(fetchedDeal => {
        setDeal(fetchedDeal || null);
        setIsLoading(false);
      });
      const discountStatus = localStorage.getItem("discountApplied") === "true";
      setIsDiscountApplied(discountStatus);
    }
  }, [dealId]);

  const finalPrice = deal ? (isDiscountApplied ? deal.price * 0.9 : deal.price) : 0;
  const originalDisplayPrice = deal ? (isDiscountApplied ? deal.price : deal.originalPrice) : undefined;

  const handleConfirmBooking = () => {
    toast({
        title: "Solana Payment Initiated (Simulated)",
        description: `Your booking for ${deal?.destination || 'the deal'} for $${finalPrice.toFixed(2)} (payable in ${selectedCrypto}) is processing!`,
    });
  };

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(mockSolanaWalletAddress);
    toast({
      title: "Solana Wallet Address Copied!",
      description: "You can now paste it into your wallet.",
    });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Header onDiscountToggle={handleDiscountToggleStub} />
        <main className="flex-grow container mx-auto px-4 py-8 flex justify-center items-center">
          <p>Loading checkout details...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!deal) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Header onDiscountToggle={handleDiscountToggleStub} />
        <main className="flex-grow container mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold mb-4">Deal not found</h1>
          <Link href="/" passHref>
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
            </Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header onDiscountToggle={handleDiscountToggleStub} />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button asChild variant="outline" size="sm">
            <Link href={`/deals/${dealId}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Deal
            </Link>
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-start">
            <Card className="overflow-hidden shadow-xl">
                 <CardHeader>
                    <CardTitle className="text-3xl font-headline text-primary flex items-center">
                        <ShoppingCart className="mr-3 h-8 w-8" /> Checkout Summary
                    </CardTitle>
                    <CardDescription>Confirm your booking for this amazing travel deal.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div>
                        <h2 className="text-2xl font-semibold">{deal.destination}</h2>
                        <p className="text-muted-foreground">{deal.type.charAt(0).toUpperCase() + deal.type.slice(1)} Deal</p>
                    </div>
                    
                    <div className="relative w-full h-60 rounded-lg overflow-hidden">
                        <Image
                        src={deal.imageUrl.replace('600x400', '800x600')}
                        alt={deal.destination}
                        layout="fill"
                        objectFit="cover"
                        data-ai-hint={deal.imageHint || "travel destination"}
                        />
                        {isDiscountApplied && (
                            <div className="absolute top-2 right-2 bg-destructive text-destructive-foreground px-3 py-1 text-sm font-semibold rounded-md">
                                10% OFF APPLIED
                            </div>
                        )}
                    </div>

                    <div className="space-y-2">
                        <p><span className="font-semibold">Dates:</span> {deal.dates}</p>
                        {deal.duration && <p><span className="font-semibold">Duration:</span> {deal.duration}</p>}
                        {deal.airline && <p><span className="font-semibold">Airline:</span> {deal.airline}</p>}
                        {deal.hotelName && <p><span className="font-semibold">Hotel:</span> {deal.hotelName}</p>}
                    </div>

                    <div className="border-t pt-4">
                        <p className="text-sm text-muted-foreground">Price Details:</p>
                        {originalDisplayPrice && originalDisplayPrice > finalPrice && (
                           <p className="text-lg text-muted-foreground">Original: <span className="line-through">${deal.originalPrice?.toFixed(2)}</span></p>
                        )}
                         {isDiscountApplied && deal.price !== finalPrice && (
                            <p className="text-lg text-muted-foreground">Base Price: ${deal.price.toFixed(2)}</p>
                        )}
                        <p className="text-3xl font-bold text-primary">Total: ${finalPrice.toFixed(2)}</p>
                         { deal.type === 'hotel' && !isDiscountApplied && <span className="text-sm text-muted-foreground ml-1">per night</span> }
                         { deal.type === 'hotel' && isDiscountApplied && <span className="text-sm text-muted-foreground ml-1">per night (discounted)</span> }
                    </div>

                    <Button size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-lg py-3" onClick={handleConfirmBooking}>
                        <SolanaIcon />
                        Proceed with Solana Payment
                    </Button>
                </CardContent>
            </Card>
            
            <Card className="shadow-xl">
                <CardHeader>
                    <CardTitle className="text-2xl font-headline text-primary">Crypto Information</CardTitle>
                    <CardDescription>Please find the Solana transaction details below.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div>
                        <Label htmlFor="cryptoSelect" className="block text-sm font-medium text-muted-foreground mb-2">Select Token (Solana Network)</Label>
                        <Select value={selectedCrypto} onValueChange={setSelectedCrypto}>
                            <SelectTrigger id="cryptoSelect" className="w-full">
                                <SelectValue placeholder="Choose token" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="USDC-SOL">USDC (Solana)</SelectItem>
                                <SelectItem value="SOL">SOL (Solana)</SelectItem>
                                <SelectItem value="UPT-SOL">$UPT (Solana)</SelectItem>
                                <SelectItem value="USDT-SOL">USDT (Solana)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label className="block text-sm font-medium text-muted-foreground mb-1">Send to this Solana Address:</Label>
                        <div className="flex items-center gap-2 p-2.5 border rounded-md bg-input text-sm">
                            <span className="truncate flex-grow font-mono">{mockSolanaWalletAddress}</span>
                            <Button variant="ghost" size="sm" onClick={handleCopyAddress} className="shrink-0">
                                <Copy className="h-4 w-4 mr-1.5" /> Copy
                            </Button>
                        </div>
                         <p className="text-xs text-muted-foreground mt-1.5">Network: Solana</p>
                    </div>

                    <div className="flex flex-col items-center space-y-2">
                         <Label className="block text-sm font-medium text-muted-foreground">Or Scan QR Code</Label>
                        <div className="p-2 border rounded-md bg-white inline-block">
                           {/* Using a generic QR code for Solana */}
                           <Image src="https://placehold.co/150x150.png" alt="Solana QR Code Placeholder" width={150} height={150} data-ai-hint="QR Solana" />
                        </div>
                    </div>
                     <div>
                        <p className="text-lg font-semibold">Amount Due: <span className="text-primary">${finalPrice.toFixed(2)} USD</span></p>
                        <p className="text-xs text-muted-foreground">Payable in {selectedCrypto}. Ensure you send the exact equivalent amount for your chosen token on the Solana network.</p>
                    </div>

                     <p className="text-xs text-muted-foreground mt-4 text-center">
                        This is a simulated Solana payment process. No real transaction will occur. Always double-check addresses and network compatibility in real transactions.
                    </p>
                </CardContent>
            </Card>
        </div>
        
      </main>
      <Footer />
    </div>
  );
}
