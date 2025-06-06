
"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { DealFilters, TravelDeal } from "@/types";
import { Star, Plane, Hotel, Ticket, Package as PackageIcon, FilterX } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const dealTypeOptions: { value: TravelDeal['type']; label: string; icon: React.ElementType }[] = [
  { value: "flight", label: "Flights", icon: Plane },
  { value: "hotel", label: "Hotels", icon: Hotel },
  { value: "activity", label: "Activities", icon: Ticket },
  { value: "package", label: "Packages", icon: PackageIcon },
];

const sortOptions = [
  { value: "default", label: "Default" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "rating_desc", label: "Rating: High to Low" },
];


interface DealFiltersProps {
  filters: DealFilters;
  onFiltersChange: (newFilters: Partial<DealFilters>) => void;
  maxPrice: number;
}

export function DealFiltersComponent({ filters, onFiltersChange, maxPrice }: DealFiltersProps) {

  const handlePriceChange = (value: number[]) => {
    onFiltersChange({ priceRange: [value[0], value[1]] });
  };

  const handleRatingChange = (value: number[]) => {
    onFiltersChange({ minRating: value[0] });
  };

  const handleTypeChange = (type: TravelDeal['type'], checked: boolean) => {
    const currentTypes = filters.types || [];
    const newTypes = checked
      ? [...currentTypes, type]
      : currentTypes.filter(t => t !== type);
    onFiltersChange({ types: newTypes });
  };
  
  const handleSortChange = (value: DealFilters['sortBy']) => {
    onFiltersChange({ sortBy: value });
  };

  return (
    <Card className="shadow-xl overflow-hidden relative border-primary/20">
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-10"
        style={{ backgroundImage: "url('https://placehold.co/600x800.png')" }}
        data-ai-hint="travel montage"
      ></div>
      <div className="relative z-10 bg-card/80 backdrop-blur-sm h-full">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl font-headline text-primary flex items-center">
            <FilterX className="mr-2 h-6 w-6" />
            Filter Deals
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="price-range" className="block mb-2 text-sm font-medium text-foreground/90">Price Range: ${filters.priceRange[0]} - ${filters.priceRange[1]}</Label>
            <Slider
              id="price-range"
              min={0}
              max={maxPrice}
              step={50}
              value={[filters.priceRange[0], filters.priceRange[1]]}
              onValueChange={handlePriceChange}
              className="[&>span:first-child]:h-1.5 [&>span:first-child]:bg-primary/30 [&_[role=slider]]:bg-primary [&_[role=slider]]:h-4 [&_[role=slider]]:w-4 [&_[role=slider]]:border-2 [&_[role=slider]]:border-primary-foreground hover:[&_[role=slider]]:bg-primary/80"
            />
          </div>

          <div>
            <Label htmlFor="min-rating" className="block mb-2 text-sm font-medium text-foreground/90">Minimum Rating: {filters.minRating} <Star className="inline h-4 w-4 text-yellow-400 fill-yellow-400" /></Label>
            <Slider
              id="min-rating"
              min={0}
              max={5}
              step={0.5}
              value={[filters.minRating]}
              onValueChange={handleRatingChange}
              className="[&>span:first-child]:h-1.5 [&>span:first-child]:bg-primary/30 [&_[role=slider]]:bg-primary [&_[role=slider]]:h-4 [&_[role=slider]]:w-4 [&_[role=slider]]:border-2 [&_[role=slider]]:border-primary-foreground hover:[&_[role=slider]]:bg-primary/80"
            />
          </div>

          <div>
            <Label className="block mb-2 text-sm font-medium text-foreground/90">Deal Type</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {dealTypeOptions.map(opt => {
                const Icon = opt.icon;
                return (
                <div key={opt.value} className="flex items-center space-x-2 p-2.5 rounded-lg hover:bg-primary/10 transition-colors border border-transparent hover:border-primary/30">
                  <Checkbox
                    id={`type-${opt.value}`}
                    checked={filters.types.includes(opt.value)}
                    onCheckedChange={(checked) => handleTypeChange(opt.value, !!checked)}
                    className="border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground h-5 w-5"
                  />
                  <Label htmlFor={`type-${opt.value}`} className="flex items-center gap-2 text-sm font-normal cursor-pointer text-foreground/90">
                    <Icon className="h-5 w-5 text-primary/80" />
                    {opt.label}
                  </Label>
                </div>
              )})}
            </div>
          </div>
          <div>
            <Label htmlFor="sort-by" className="block mb-2 text-sm font-medium text-foreground/90">Sort By</Label>
            <Select value={filters.sortBy} onValueChange={handleSortChange}>
              <SelectTrigger id="sort-by" className="focus:ring-primary focus:border-primary bg-input/50 hover:bg-input/70">
                <SelectValue placeholder="Sort deals" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map(opt => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button 
            variant="outline" 
            onClick={() => onFiltersChange({ 
              priceRange: [0, maxPrice], 
              minRating: 0, 
              types: ['flight', 'hotel', 'activity', 'package'],
              sortBy: 'default'
            })}
            className="w-full border-accent text-accent hover:bg-accent/10 hover:text-accent-foreground py-3 text-base"
          >
            Reset Filters
          </Button>
        </CardContent>
      </div>
    </Card>
  );
}
