
"use client";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Link from "next/link";
import { ArrowLeft, ShoppingCart, CreditCard } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import type { TravelDeal } from "@/types";
import { fetchDealById } from "@/app/actions";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";


export default function CheckoutPage() {
  const params = useParams();
  const dealId = params.dealId as string;
  const [deal, setDeal] = useState<TravelDeal | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDiscountApplied, setIsDiscountApplied] = useState(false); // This would ideally come from a global state or query param
  const { toast } = useToast();

  // Stub for discount toggle, not fully functional on this page without global state
  const handleDiscountToggleStub = (isDiscounted: boolean) => {
    console.log("Discount toggle on checkout page (stub):", isDiscounted);
    // In a real app, this might come from a context or URL parameter
    // For now, we'll let WalletConnectButton manage its own display,
    // but the actual price calculation here won't reflect it dynamically
    // unless we pass it explicitly or use a shared state.
    // We can simulate checking if a discount was applied perhaps via localStorage or a simple prop if needed.
  };


  useEffect(() => {
    if (dealId) {
      fetchDealById(dealId).then(fetchedDeal => {
        setDeal(fetchedDeal || null);
        setIsLoading(false);
      });
      // Check if discount was applied (e.g. from a global state or localStorage for demo)
      // This is a simplified check.
      const discountStatus = localStorage.getItem("discountApplied") === "true";
      setIsDiscountApplied(discountStatus);

    }
  }, [dealId]);

  const finalPrice = deal ? (isDiscountApplied ? deal.price * 0.9 : deal.price) : 0;
  const originalDisplayPrice = deal ? (isDiscountApplied ? deal.price : deal.originalPrice) : undefined;


  const handleConfirmBooking = () => {
    toast({
        title: "Booking Confirmed (Simulated)",
        description: `Your booking for ${deal?.destination || 'the deal'} for $${finalPrice.toFixed(2)} is confirmed!`,
    });
    // Here you would typically redirect to a confirmation page or dashboard
  }

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
                        <ShoppingCart className="mr-3 h-8 w-8" /> Checkout
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
                        <CreditCard className="mr-2 h-5 w-5" />
                        Confirm & Book Now
                    </Button>
                </CardContent>
            </Card>
            
            {/* Placeholder for Payment Form */}
            <Card className="shadow-xl">
                <CardHeader>
                    <CardTitle className="text-2xl font-headline text-primary">Payment Information</CardTitle>
                    <CardDescription>Enter your payment details below.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <label htmlFor="cardName" className="block text-sm font-medium text-muted-foreground mb-1">Name on Card</label>
                        <input type="text" id="cardName" className="w-full p-2 border rounded-md bg-input" placeholder="John M. Doe" />
                    </div>
                    <div>
                        <label htmlFor="cardNumber" className="block text-sm font-medium text-muted-foreground mb-1">Card Number</label>
                        <input type="text" id="cardNumber" className="w-full p-2 border rounded-md bg-input" placeholder="•••• •••• •••• ••••" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="expiryDate" className="block text-sm font-medium text-muted-foreground mb-1">Expiry Date</label>
                            <input type="text" id="expiryDate" className="w-full p-2 border rounded-md bg-input" placeholder="MM/YY" />
                        </div>
                        <div>
                            <label htmlFor="cvc" className="block text-sm font-medium text-muted-foreground mb-1">CVC</label>
                            <input type="text" id="cvc" className="w-full p-2 border rounded-md bg-input" placeholder="•••" />
                        </div>
                    </div>
                    <div className="flex items-center space-x-2 mt-2">
                        <input type="checkbox" id="saveCard" className="rounded border-primary text-primary focus:ring-primary" />
                        <label htmlFor="saveCard" className="text-sm text-muted-foreground">Save card for future purchases</label>
                    </div>
                     <p className="text-xs text-muted-foreground mt-4">
                        This is a simulated payment form. No real transaction will occur.
                    </p>
                </CardContent>
            </Card>
        </div>
        
      </main>
      <Footer />
    </div>
  );
}

