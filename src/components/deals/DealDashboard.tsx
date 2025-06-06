"use client";

import { useState, useMemo } from "react";
import { DealCard } from "./DealCard";
import { DealFiltersComponent } from "./DealFilters";
import type { TravelDeal, DealFilters } from "@/types";
import { AlertCircle, SearchX } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";


interface DealDashboardProps {
  deals: TravelDeal[];
  isLoading: boolean;
  isDiscountApplied: boolean;
}

const initialFilters: DealFilters = {
  priceRange: [0, 5000], // Default max price, will be updated
  minRating: 0,
  types: ['flight', 'hotel', 'activity', 'package'],
  sortBy: 'default',
};

export function DealDashboard({ deals: initialDeals, isLoading, isDiscountApplied }: DealDashboardProps) {
  const [filters, setFilters] = useState<DealFilters>(initialFilters);
  
  const maxPrice = useMemo(() => {
    if (initialDeals.length === 0) return 5000; // Default if no deals
    return Math.max(...initialDeals.map(d => d.price), 5000);
  }, [initialDeals]);

  // Update initialFilters max price if needed, only once
  useState(() => {
    setFilters(prev => ({ ...prev, priceRange: [0, maxPrice]}));
  });


  const handleFiltersChange = (newFilterValues: Partial<DealFilters>) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      ...newFilterValues,
    }));
  };

  const filteredAndSortedDeals = useMemo(() => {
    let processedDeals = initialDeals.filter(deal => {
      const priceMatch = deal.price >= filters.priceRange[0] && deal.price <= filters.priceRange[1];
      const ratingMatch = (deal.rating || 0) >= filters.minRating;
      const typeMatch = filters.types.length === 0 || filters.types.includes(deal.type);
      return priceMatch && ratingMatch && typeMatch;
    });
    
    switch (filters.sortBy) {
      case 'price_asc':
        processedDeals.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        processedDeals.sort((a, b) => b.price - a.price);
        break;
      case 'rating_desc':
        processedDeals.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      default:
        // No specific sort or maintain original order
        break;
    }

    return processedDeals;
  }, [initialDeals, filters]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-8">
        <div className="hidden md:block">
          <Skeleton className="h-[500px] w-full rounded-lg" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-[380px] w-full rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-8 items-start">
      <aside className="sticky top-20"> {/* Adjust top value based on header height */}
        <DealFiltersComponent filters={filters} onFiltersChange={handleFiltersChange} maxPrice={maxPrice} />
      </aside>
      <main>
        {filteredAndSortedDeals.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredAndSortedDeals.map(deal => (
              <DealCard key={deal.id} deal={deal} isDiscountApplied={isDiscountApplied} />
            ))}
          </div>
        ) : (
          <Alert variant="default" className="bg-secondary">
            <SearchX className="h-5 w-5" />
            <AlertTitle>No Deals Found</AlertTitle>
            <AlertDescription>
              No travel deals match your current criteria. Try adjusting your preferences or filters.
            </AlertDescription>
          </Alert>
        )}
      </main>
    </div>
  );
}
