"use client";

import { fetchDealById } from "@/app/actions";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, CalendarDays, Clock, DollarSign, Hotel, MapPin, Plane, Star, Ticket, Package as PackageIcon, Info, Users } from "lucide-react";
import type { TravelDeal } from "@/types";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react"; // Import useState and useEffect for client component

interface DealPageProps {
  params: {
    id: string;
  };
}

const TypeSpecificDetails = ({ deal }: { deal: TravelDeal }) => {
  return (
    <div className="space-y-2">
      {deal.type === 'flight' && deal.airline && (
        <div className="flex items-center text-sm text-muted-foreground">
          <Plane className="h-4 w-4 mr-2 text-primary" />
          Airline: {deal.airline}
        </div>
      )}
      {deal.type === 'hotel' && deal.hotelName && (
        <div className="flex items-center text-sm text-muted-foreground">
          <Hotel className="h-4 w-4 mr-2 text-primary" />
          Hotel: {deal.hotelName}
        </div>
      )}
      {deal.type === 'activity' && deal.activityName && (
        <div className="flex items-center text-sm text-muted-foreground">
          <Ticket className="h-4 w-4 mr-2 text-primary" />
          Activity: {deal.activityName}
        </div>
      )}
      {deal.type === 'package' && (
         <div className="flex items-center text-sm text-muted-foreground">
          <PackageIcon className="h-4 w-4 mr-2 text-primary" />
          Package Deal
        </div>
      )}
    </div>
  );
};

const DealTypeIcon = ({ type }: { type: TravelDeal['type'] }) => {
  switch (type) {
    case 'flight': return <Plane className="h-5 w-5 text-primary" />;
    case 'hotel': return <Hotel className="h-5 w-5 text-primary" />;
    case 'activity': return <Ticket className="h-5 w-5 text-primary" />;
    case 'package': return <PackageIcon className="h-5 w-5 text-primary" />;
    default: return <Info className="h-5 w-5 text-primary" />;
  }
};


export default function DealPage({ params }: DealPageProps) {
  const [deal, setDeal] = useState<TravelDeal | null | undefined>(undefined); // undefined for loading, null for not found

  useEffect(() => {
    async function loadDeal() {
      const fetchedDeal = await fetchDealById(params.id);
      setDeal(fetchedDeal || null); // Set to null if not found
    }
    loadDeal();
  }, [params.id]);


  // For Header discount toggle - it doesn't actually apply to this page's price directly
  // but we need to pass the prop. We'll assume no discount for simplicity here or
  // a more complex state management would be needed if it should persist.
  const handleDiscountToggle = (isDiscounted: boolean) => {
    // This function is a stub for the Header prop
    console.log("Discount toggle on deal page:", isDiscounted);
  };

  if (deal === undefined) { // Loading state
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Header onDiscountToggle={handleDiscountToggle} />
        <main className="flex-grow container mx-auto px-4 py-8 flex flex-col items-center justify-center">
          <PackageIcon className="h-16 w-16 text-primary animate-pulse mb-4" />
          <h1 className="text-3xl font-bold mb-2 text-center">Loading Deal...</h1>
          <p className="text-muted-foreground text-center mb-6">
            Please wait while we fetch the details of your amazing getaway!
          </p>
        </main>
        <Footer />
      </div>
    );
  }


  if (!deal) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Header onDiscountToggle={handleDiscountToggle} />
        <main className="flex-grow container mx-auto px-4 py-8 flex flex-col items-center justify-center">
          <MapPin className="h-16 w-16 text-destructive mb-4" />
          <h1 className="text-3xl font-bold mb-2 text-center">Deal Not Found</h1>
          <p className="text-muted-foreground text-center mb-6">
            Sorry, we couldn't find the deal you're looking for. It might have expired or been removed.
          </p>
          <Button asChild variant="outline">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to All Deals
            </Link>
          </Button>
        </main>
        <Footer />
      </div>
    );
  }
  
  // Default to non-discounted price for detail page display
  const displayPrice = deal.price;
  const originalDisplayPrice = deal.originalPrice;


  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header onDiscountToggle={handleDiscountToggle} />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button asChild variant="outline" size="sm">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to All Deals
            </Link>
          </Button>
        </div>

        <Card className="overflow-hidden shadow-xl">
          <div className="grid md:grid-cols-2 gap-0">
            <div className="relative w-full h-64 md:h-auto min-h-[300px] md:min-h-[400px]">
              <Image
                src={deal.imageUrl.replace('600x400', '800x600')} // Request larger image
                alt={deal.destination}
                layout="fill"
                objectFit="cover"
                data-ai-hint={deal.imageHint || "travel destination"}
                priority
              />
            </div>
            <div className="flex flex-col">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                    <div>
                        <Badge variant="secondary" className="capitalize flex items-center gap-1 mb-2">
                           <DealTypeIcon type={deal.type} /> {deal.type}
                        </Badge>
                        <CardTitle className="text-3xl font-headline">{deal.destination}</CardTitle>
                    </div>
                    {deal.rating && (
                      <div className="flex items-center gap-1 text-sm bg-amber-400/10 px-2 py-1 rounded-md">
                        <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
                        <span className="font-semibold text-amber-600">{deal.rating.toFixed(1)}</span>
                      </div>
                    )}
                </div>
                 <TypeSpecificDetails deal={deal} />
              </CardHeader>
              <CardContent className="space-y-4 flex-grow">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center text-muted-foreground">
                    <CalendarDays className="h-4 w-4 mr-2 text-primary" />
                    <span>{deal.dates}</span>
                  </div>
                  {deal.duration && (
                    <div className="flex items-center text-muted-foreground">
                      <Clock className="h-4 w-4 mr-2 text-primary" />
                      <span>{deal.duration}</span>
                    </div>
                  )}
                </div>
                
                <Separator />

                <h3 className="font-semibold text-lg text-foreground">About this deal</h3>
                <CardDescription className="text-base leading-relaxed whitespace-pre-line">
                  {deal.description}
                </CardDescription>
                
              </CardContent>
              <CardFooter className="flex flex-col sm:flex-row items-center justify-between pt-6 mt-auto bg-muted/50 p-6">
                <div className="mb-4 sm:mb-0">
                  <p className="text-3xl font-bold text-primary">${displayPrice.toFixed(2)}</p>
                  {originalDisplayPrice && originalDisplayPrice > displayPrice && (
                    <p className="text-sm text-muted-foreground line-through">${originalDisplayPrice.toFixed(2)}</p>
                  )}
                   { deal.type === 'hotel' && <span className="text-xs text-muted-foreground ml-1">per night</span> }
                </div>
                <Button size="lg" className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground">
                  Book Now
                  <ArrowLeft className="mr-2 h-4 w-4 transform rotate-[135deg] ml-2" /> {/* Simulating an arrow right */}
                </Button>
              </CardFooter>
            </div>
          </div>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
