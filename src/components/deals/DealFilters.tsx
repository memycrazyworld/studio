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
import { Star, Plane, Hotel, Ticket, Package } from "lucide-react"; // Using Package for package type

const dealTypeOptions: { value: TravelDeal['type']; label: string; icon: React.ElementType }[] = [
  { value: "flight", label: "Flights", icon: Plane },
  { value: "hotel", label: "Hotels", icon: Hotel },
  { value: "activity", label: "Activities", icon: Ticket },
  { value: "package", label: "Packages", icon: Package },
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
    <div className="space-y-6 p-4 border rounded-lg shadow-sm bg-card">
      <h3 className="text-lg font-semibold font-headline">Filter Deals</h3>
      
      <div>
        <Label htmlFor="price-range" className="block mb-2 text-sm font-medium">Price Range: ${filters.priceRange[0]} - ${filters.priceRange[1]}</Label>
        <Slider
          id="price-range"
          min={0}
          max={maxPrice}
          step={50}
          value={[filters.priceRange[0], filters.priceRange[1]]}
          onValueChange={handlePriceChange}
          className="[&>span:first-child]:h-1 [&>span:first-child]:bg-primary/20 [&_[role=slider]]:bg-primary [&_[role=slider]]:h-4 [&_[role=slider]]:w-4 [&_[role=slider]]:border-2"
        />
      </div>

      <div>
        <Label htmlFor="min-rating" className="block mb-2 text-sm font-medium">Minimum Rating: {filters.minRating} <Star className="inline h-4 w-4 text-yellow-400 fill-yellow-400" /></Label>
        <Slider
          id="min-rating"
          min={0}
          max={5}
          step={0.5}
          value={[filters.minRating]}
          onValueChange={handleRatingChange}
          className="[&>span:first-child]:h-1 [&>span:first-child]:bg-primary/20 [&_[role=slider]]:bg-primary [&_[role=slider]]:h-4 [&_[role=slider]]:w-4 [&_[role=slider]]:border-2"
        />
      </div>

      <div>
        <Label className="block mb-2 text-sm font-medium">Deal Type</Label>
        <div className="grid grid-cols-2 gap-2">
          {dealTypeOptions.map(opt => {
            const Icon = opt.icon;
            return (
            <div key={opt.value} className="flex items-center space-x-2">
              <Checkbox
                id={`type-${opt.value}`}
                checked={filters.types.includes(opt.value)}
                onCheckedChange={(checked) => handleTypeChange(opt.value, !!checked)}
              />
              <Label htmlFor={`type-${opt.value}`} className="flex items-center gap-1.5 text-sm font-normal cursor-pointer">
                <Icon className="h-4 w-4 text-muted-foreground" />
                {opt.label}
              </Label>
            </div>
          )})}
        </div>
      </div>
       <div>
        <Label htmlFor="sort-by" className="block mb-2 text-sm font-medium">Sort By</Label>
        <Select value={filters.sortBy} onValueChange={handleSortChange}>
          <SelectTrigger id="sort-by">
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
        className="w-full"
      >
        Reset Filters
      </Button>
    </div>
  );
}

