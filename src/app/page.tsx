
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
      } catch (error) {
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
      <main className="flex-grow container mx-auto px-4 py-8 space-y-12">
        <section id="preferences" aria-labelledby="preferences-heading">
          <div className="max-w-3xl mx-auto bg-card p-6 sm:p-8 rounded-xl shadow-lg">
            <h1 id="preferences-heading" className="text-3xl font-bold mb-2 text-center font-headline text-primary">
              Discover Your Next Adventure
            </h1>
            <p className="text-muted-foreground text-center mb-8">
              Tell us your travel dreams, and we'll find the perfect getaway for you.
            </p>
            <PreferenceForm onSubmit={handlePreferencesSubmit} isLoading={isLoading && !initialLoadComplete} />
          </div>
        </section>
        
        <Separator />

        <section id="deals" aria-labelledby="deals-heading" className="min-h-[400px]">
          <h2 id="deals-heading" className="text-2xl font-bold mb-6 font-headline text-center">
            Your Personalized Travel Deals
          </h2>
          {(isLoading && deals.length === 0 && initialLoadComplete) && (
            <div className="flex justify-center items-center min-h-[200px]">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="ml-4 text-lg text-muted-foreground">Searching for the best getaways...</p>
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
      </main>
      <Footer />
    </div>
  );
}
