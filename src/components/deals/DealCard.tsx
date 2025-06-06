
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { TravelDeal } from "@/types";
import { Plane, Hotel, Star, Tag, Ticket, Package as PackageIcon, ArrowRight } from "lucide-react";

interface DealCardProps {
  deal: TravelDeal;
  isDiscountApplied: boolean;
}

const TypeIcon = ({ type }: { type: TravelDeal['type'] }) => {
  switch (type) {
    case 'flight': return <Plane className="h-4 w-4 text-primary" />;
    case 'hotel': return <Hotel className="h-4 w-4 text-primary" />;
    case 'activity': return <Ticket className="h-4 w-4 text-primary" />;
    case 'package': return <PackageIcon className="h-4 w-4 text-primary" />;
    default: return <Tag className="h-4 w-4 text-primary" />;
  }
};


export function DealCard({ deal, isDiscountApplied }: DealCardProps) {
  const finalPrice = isDiscountApplied ? deal.price * 0.9 : deal.price;
  const priceToShowAsOriginal = isDiscountApplied ? deal.price : deal.originalPrice;

  return (
    
      <Card className="group overflow-hidden transition-all hover:shadow-2xl duration-300 ease-in-out transform hover:-translate-y-2 hover:scale-[1.02] flex flex-col h-full">
        <Link href={`/deals/${deal.id}`} passHref legacyBehavior>
          <a className="block cursor-pointer">
            <div className="relative w-full h-48 overflow-hidden"> {/* Added overflow-hidden */}
              <Image
                src={deal.imageUrl}
                alt={deal.destination}
                layout="fill"
                objectFit="cover"
                data-ai-hint={deal.imageHint || "travel scene"}
                className="transition-transform duration-300 ease-in-out group-hover:scale-110" // Added image zoom effect
              />
              <Badge variant="secondary" className="absolute top-2 right-2 capitalize flex items-center gap-1">
                <TypeIcon type={deal.type} /> {deal.type}
              </Badge>
              {isDiscountApplied && (
                <Badge variant="destructive" className="absolute top-2 left-2">10% OFF</Badge>
              )}
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-headline truncate">{deal.destination}</CardTitle>
              { (deal.hotelName || deal.activityName || deal.airline) &&
                  <CardDescription className="truncate">
                      {deal.airline && `Airline: ${deal.airline}`}
                      {deal.hotelName && `Hotel: ${deal.hotelName}`}
                      {deal.activityName && `Activity: ${deal.activityName}`}
                  </CardDescription>
              }
            </CardHeader>
            <CardContent className="flex-grow space-y-2 text-sm">
              <p className="text-muted-foreground line-clamp-2">{deal.description}</p>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                  {deal.dates && <span>{deal.dates}</span>}
                  {deal.duration && <span>{deal.duration}</span>}
              </div>
              {deal.rating && (
                <div className="flex items-center">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < deal.rating! ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground"}`}
                    />
                  ))}
                  <span className="ml-1 text-xs">({deal.rating.toFixed(1)})</span>
                </div>
              )}
            </CardContent>
          </a>
        </Link>
        <CardFooter className="flex items-center justify-between pt-4 mt-auto">
          <div>
            <p className="text-xl font-bold text-primary">${finalPrice.toFixed(2)}</p>
            {priceToShowAsOriginal && priceToShowAsOriginal > finalPrice && (
              <p className="text-xs text-muted-foreground line-through">${priceToShowAsOriginal.toFixed(2)}</p>
            )}
          </div>
          <Button size="sm" asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
            <Link href={`/checkout/${deal.id}`}>
              Book Now 
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </CardFooter>
      </Card>
   
  );
}
