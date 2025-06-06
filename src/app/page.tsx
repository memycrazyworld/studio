
"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PreferenceForm } from "@/components/forms/PreferenceForm";
import { DealDashboard } from "@/components/deals/DealDashboard";
import type { TravelDeal, UserPreferences } from "@/types";
import { fetchPersonalizedDeals } from "./actions";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button"; 

export default function HomePage() {
  const [deals, setDeals] = useState<TravelDeal[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const [isDiscountApplied, setIsDiscountApplied] = useState(false);
  const { toast } = useToast();

  const handlePreferencesSubmit = async (preferences: UserPreferences) => {
    setIsLoading(true);
    setDeals([]);
    try {
      const result = await fetchPersonalizedDeals(preferences);
      if (result.error) {
        toast({ variant: "destructive", title: "Error", description: result.error });
        setDeals([]);
      } else {
        setDeals(result.deals || []);
        if (!result.deals || result.deals.length === 0) {
             toast({ title: "No Deals Found", description: "Try adjusting your preferences or search again later." });
        }
      }
    } catch (error) {
      console.error("Failed to fetch deals:", error);
      toast({ variant: "destructive", title: "Error", description: "Could not fetch travel deals. Please try again." });
      setDeals([]);
    } finally {
      setIsLoading(false);
      setInitialLoadComplete(true);
    }
  };

  useEffect(() => {
    const loadInitialDeals = async () => {
      setIsLoading(true);
       try {
        const result = await fetchPersonalizedDeals({
            destination: "",
            departureCity: "",
            budget: 5000,
            interests: []
        });
        if (result.deals) {
          setDeals(result.deals);
        }
      } catch (error)
{
        console.error("Failed to fetch initial deals:", error);
      } finally {
        setIsLoading(false);
        setInitialLoadComplete(true);
      }
    };
    loadInitialDeals();
  }, []);

  const handleDiscountToggle = (isDiscounted: boolean) => {
    setIsDiscountApplied(isDiscounted);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header onDiscountToggle={handleDiscountToggle} />
      <main className="flex-grow">
        <section
          id="preferences"
          aria-labelledby="preferences-heading"
          className="relative bg-cover bg-center py-16 sm:py-24 md:py-32 flex items-center min-h-[70vh] md:min-h-[80vh] lg:min-h-screen"
          style={{ backgroundImage: "url('https://placehold.co/1920x1080.png')" }}
          data-ai-hint="tropical beach"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30 md:via-black/40 md:to-transparent z-0"></div>

          <div className="relative z-10 container px-4 mx-auto w-full">
            <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
              {/* Left Column: Text */}
              <div className="text-center md:text-left">
                <h1 id="preferences-heading" className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-white font-headline leading-tight">
                  Your Journey Begins Here.
                </h1>
                <p className="text-lg sm:text-xl text-neutral-200 mb-8 md:mb-10 max-w-xl md:max-w-none mx-auto md:mx-0">
                  Craft your dream vacation. WanderWeb's AI curates personalized travel deals, just for you.
                </p>
              </div>

              {/* Right Column: Form Card */}
              <div className="w-full max-w-md lg:max-w-lg mx-auto"> {/* Changed md:mx-0 to mx-auto for consistent centering */}
                <div className="bg-card/85 backdrop-blur-md p-6 sm:p-8 rounded-xl shadow-2xl">
                  <h2 className="text-2xl font-semibold mb-6 text-center text-card-foreground">
                    Find Your Perfect Getaway
                  </h2>
                  <PreferenceForm onSubmit={handlePreferencesSubmit} isLoading={isLoading && !initialLoadComplete} />
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-12 space-y-12">
          <Separator />
          <section id="deals" aria-labelledby="deals-heading" className="min-h-[400px]">
            <h2 id="deals-heading" className="text-3xl font-bold mb-8 font-headline text-center text-primary">
              Your Personalized Travel Deals
            </h2>
            {(isLoading && deals.length === 0 && initialLoadComplete) && (
              <div className="flex flex-col justify-center items-center min-h-[200px] space-y-4">
                <Loader2 className="h-16 w-16 animate-spin text-primary" />
                <p className="text-xl text-muted-foreground">Searching for the best getaways...</p>
              </div>
            )}
            {(!isLoading || deals.length > 0) && (
              <DealDashboard deals={deals} isLoading={isLoading && deals.length === 0 && !initialLoadComplete} isDiscountApplied={isDiscountApplied} />
            )}
            {(!isLoading && deals.length === 0 && initialLoadComplete) && (
               <div className="text-center py-10">
                  <p className="text-xl text-muted-foreground">No deals match your current search.</p>
                  <p className="text-sm text-muted-foreground">Try adjusting your preferences above or check back later!</p>
              </div>
            )}
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
