
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
import { ArrowLeft, ShoppingCart, Bitcoin, Copy, QrCode } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import type { TravelDeal } from "@/types";
import { fetchDealById } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";


export default function CheckoutPage() {
  const params = useParams();
  const dealId = params.dealId as string;
  const [deal, setDeal] = useState<TravelDeal | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDiscountApplied, setIsDiscountApplied] = useState(false);
  const { toast } = useToast();
  const [selectedCrypto, setSelectedCrypto] = useState("UPT");
  const mockWalletAddress = "0x123abcDEF456ghiJKL789mnoPQR"; // A bit longer for realism

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
        title: "Crypto Payment Initiated (Simulated)",
        description: `Your booking for ${deal?.destination || 'the deal'} for $${finalPrice.toFixed(2)} (payable in ${selectedCrypto}) is processing!`,
    });
  };

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(mockWalletAddress);
    toast({
      title: "Wallet Address Copied!",
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
                        data-ai-hint={deal.imageHint || "travel checkout"}
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
                        <Bitcoin className="mr-2 h-5 w-5" />
                        Proceed with Crypto Payment
                    </Button>
                </CardContent>
            </Card>
            
            <Card className="shadow-xl">
                <CardHeader>
                    <CardTitle className="text-2xl font-headline text-primary">Crypto Information</CardTitle>
                    <CardDescription>Please find the crypto transaction details below.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div>
                        <Label htmlFor="cryptoSelect" className="block text-sm font-medium text-muted-foreground mb-2">Select Cryptocurrency</Label>
                        <Select value={selectedCrypto} onValueChange={setSelectedCrypto}>
                            <SelectTrigger id="cryptoSelect" className="w-full">
                                <SelectValue placeholder="Choose crypto" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="UPT">$UPT (Uprock)</SelectItem>
                                <SelectItem value="BTC">BTC (Bitcoin)</SelectItem>
                                <SelectItem value="ETH">ETH (Ethereum)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label className="block text-sm font-medium text-muted-foreground mb-1">Send to this Address:</Label>
                        <div className="flex items-center gap-2 p-2.5 border rounded-md bg-input text-sm">
                            <span className="truncate flex-grow font-mono">{mockWalletAddress}</span>
                            <Button variant="ghost" size="sm" onClick={handleCopyAddress} className="shrink-0">
                                <Copy className="h-4 w-4 mr-1.5" /> Copy
                            </Button>
                        </div>
                         <p className="text-xs text-muted-foreground mt-1.5">Network: {selectedCrypto === 'BTC' ? 'Bitcoin Network' : selectedCrypto === 'ETH' ? 'Ethereum (ERC20)' : 'Uprock Network (Simulated)'}</p>
                    </div>

                    <div className="flex flex-col items-center space-y-2">
                         <Label className="block text-sm font-medium text-muted-foreground">Or Scan QR Code</Label>
                        <div className="p-2 border rounded-md bg-white inline-block">
                           <Image src={`https://placehold.co/150x150.png`} alt="QR Code Placeholder" width={150} height={150} data-ai-hint="QR code payment" />
                        </div>
                    </div>
                     <div>
                        <p className="text-lg font-semibold">Amount Due: <span className="text-primary">${finalPrice.toFixed(2)} USD</span></p>
                        <p className="text-xs text-muted-foreground">Payable in {selectedCrypto}. Ensure you send the exact equivalent amount for your chosen cryptocurrency.</p>
                    </div>

                     <p className="text-xs text-muted-foreground mt-4 text-center">
                        This is a simulated crypto payment process. No real transaction will occur. Always double-check addresses and network compatibility in real transactions.
                    </p>
                </CardContent>
            </Card>
        </div>
        
      </main>
      <Footer />
    </div>
  );
}
