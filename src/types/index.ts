export interface TravelDeal {
  id: string;
  type: 'flight' | 'hotel' | 'activity' | 'package';
  destination: string;
  price: number;
  originalPrice?: number;
  dates: string; 
  rating?: number; 
  imageUrl: string;
  imageHint?: string;
  description: string;
  provider?: string;
  airline?: string; // For flights
  hotelName?: string; // For hotels
  activityName?: string; // For activities
  duration?: string; // e.g., "7 Days" or "3 Hours"
}

export interface UserPreferences {
  destination: string;
  departureCity: string;
  budget: number;
  startDate?: Date;
  endDate?: Date;
  interests: string[];
}

export interface DealFilters {
  priceRange: [number, number];
  minRating: number;
  types: ('flight' | 'hotel' | 'activity' | 'package')[];
  sortBy: 'price_asc' | 'price_desc' | 'rating_desc' | 'default';
}
