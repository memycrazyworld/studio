
"use client";

import { fetchDealById } from "@/app/actions";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, CalendarDays, Clock, DollarSign, Hotel, MapPin, Plane, Star, Ticket, Package as PackageIcon, Info, Users, Loader2, ArrowRight } from "lucide-react";
import type { TravelDeal } from "@/types";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react"; 
import { useParams } from "next/navigation";

// DealPageProps is no longer needed if params are not passed as props
// interface DealPageProps {
//   params: {
//     id: string;
//   };
// }

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


export default function DealPage() {
  const routeParams = useParams<{ id: string }>();
  const id = routeParams.id;

  const [deal, setDeal] = useState<TravelDeal | null | undefined>(undefined); 
  const [isDiscountApplied, setIsDiscountApplied] = useState(false);


  useEffect(() => {
    async function loadDeal() {
      if (id) { // Ensure id is available
        const fetchedDeal = await fetchDealById(id);
        setDeal(fetchedDeal || null); 
      }
    }
    if (id) {
        loadDeal();
        const discountStatus = localStorage.getItem("discountApplied") === "true";
        setIsDiscountApplied(discountStatus);
    }
  }, [id]);

  const handleDiscountToggle = (isDiscounted: boolean) => {
    setIsDiscountApplied(isDiscounted);
    localStorage.setItem("discountApplied", isDiscounted ? "true" : "false");
  };

  if (deal === undefined) { 
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Header onDiscountToggle={handleDiscountToggle} />
        <main className="flex-grow container mx-auto px-4 py-8 flex flex-col items-center justify-center">
          <Loader2 className="h-16 w-16 text-primary animate-spin mb-4" />
          <h1 className="text-3xl font-bold mb-2 text-center text-primary">Loading Your Getaway...</h1>
          <p className="text-muted-foreground text-center">
            Fetching the amazing details of your selected deal!
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
  
  const displayPrice = isDiscountApplied ? deal.price * 0.9 : deal.price;
  const originalDisplayPrice = isDiscountApplied ? deal.price : deal.originalPrice;


  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header onDiscountToggle={handleDiscountToggle} />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button asChild variant="outline" size="sm" className="hover:bg-accent/10">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to All Deals
            </Link>
          </Button>
        </div>

        <Card className="overflow-hidden shadow-xl rounded-xl">
          <div className="grid md:grid-cols-2 gap-0">
            <div className="relative w-full h-72 md:h-auto min-h-[300px] md:min-h-[450px]">
              <Image
                src={deal.imageUrl.replace('600x400', '800x600')} 
                alt={deal.destination}
                layout="fill"
                objectFit="cover"
                data-ai-hint={deal.imageHint || "travel destination"}
                priority
                className="md:rounded-l-xl"
              />
               {isDiscountApplied && (
                <Badge variant="destructive" className="absolute top-3 left-3 text-base px-3 py-1.5">10% OFF APPLIED</Badge>
              )}
            </div>
            <div className="flex flex-col bg-card">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                    <div>
                        <Badge variant="secondary" className="capitalize flex items-center gap-1.5 mb-2 text-sm px-3 py-1">
                           <DealTypeIcon type={deal.type} /> {deal.type}
                        </Badge>
                        <CardTitle className="text-4xl font-headline text-primary">{deal.destination}</CardTitle>
                    </div>
                    {deal.rating && (
                      <div className="flex items-center gap-1 text-lg bg-amber-400/10 px-3 py-1.5 rounded-lg">
                        <Star className="h-6 w-6 text-amber-500 fill-amber-500" />
                        <span className="font-semibold text-amber-600">{deal.rating.toFixed(1)}</span>
                      </div>
                    )}
                </div>
                 <TypeSpecificDetails deal={deal} />
              </CardHeader>
              <CardContent className="space-y-6 flex-grow text-base">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center text-muted-foreground">
                    <CalendarDays className="h-5 w-5 mr-2.5 text-primary" />
                    <span>{deal.dates}</span>
                  </div>
                  {deal.duration && (
                    <div className="flex items-center text-muted-foreground">
                      <Clock className="h-5 w-5 mr-2.5 text-primary" />
                      <span>{deal.duration}</span>
                    </div>
                  )}
                </div>
                
                <Separator />

                <h3 className="font-semibold text-xl text-foreground">About this deal</h3>
                <CardDescription className="text-base leading-relaxed whitespace-pre-line">
                  {deal.description}
                </CardDescription>
                
              </CardContent>
              <CardFooter className="flex flex-col sm:flex-row items-center justify-between pt-6 mt-auto bg-muted/30 p-6 border-t">
                <div className="mb-4 sm:mb-0 text-center sm:text-left">
                  <p className="text-4xl font-bold text-primary">${displayPrice.toFixed(2)}</p>
                  {originalDisplayPrice && originalDisplayPrice > displayPrice && (
                    <p className="text-md text-muted-foreground line-through">${originalDisplayPrice.toFixed(2)}</p>
                  )}
                   { deal.type === 'hotel' && <span className="text-sm text-muted-foreground ml-1">per night</span> }
                </div>
                <Button size="lg" asChild className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground text-lg py-3 px-8 rounded-lg">
                  <Link href={`/checkout/${deal.id}`}>
                    Book Now
                    <ArrowRight className="h-5 w-5 ml-2" /> 
                  </Link>
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

