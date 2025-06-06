"use server";

import type { TravelDeal, UserPreferences } from "@/types";
// import { personalizeDealRecommendations } from "@/ai/flows/personalize-deal-recommendations"; // GenAI import

// Simulate a delay to mimic API calls
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const mockDeals: TravelDeal[] = [
  {
    id: "1", type: "flight", destination: "Paris, France", price: 350, originalPrice: 400, dates: "Oct 10 - Oct 17", rating: 4.5,
    imageUrl: "https://placehold.co/600x400.png", imageHint: "Paris EiffelTower", description: "Round trip flight to the city of lights. Explore iconic landmarks.", airline: "Air France",
    duration: "7 Days",
  },
  {
    id: "2", type: "hotel", destination: "Tokyo, Japan", price: 120, originalPrice: 150, dates: "Nov 5 - Nov 12", rating: 4.8,
    imageUrl: "https://placehold.co/600x400.png", imageHint: "Tokyo skyline", description: "Stay in a modern hotel in bustling Shinjuku.", hotelName: "Shinjuku Grand",
    duration: "Per Night"
  },
  {
    id: "3", type: "activity", destination: "Rome, Italy", price: 75, dates: "Any day", rating: 4.2,
    imageUrl: "https://placehold.co/600x400.png", imageHint: "Rome Colosseum", description: "Guided tour of the Colosseum and Roman Forum.", activityName: "Colosseum Tour",
    duration: "3 Hours"
  },
  {
    id: "4", type: "package", destination: "Bali, Indonesia", price: 1200, originalPrice: 1500, dates: "Dec 1 - Dec 10", rating: 4.9,
    imageUrl: "https://placehold.co/600x400.png", imageHint: "Bali beach", description: "All-inclusive Bali beach resort and spa package.",
    duration: "10 Days"
  },
  {
    id: "5", type: "flight", destination: "New York, USA", price: 280, dates: "Sep 15 - Sep 20", rating: 4.3,
    imageUrl: "https://placehold.co/600x400.png", imageHint: "NewYork skyline", description: "Direct flight to the Big Apple. Experience Broadway and Central Park.", airline: "Delta",
    duration: "5 Days"
  },
  {
    id: "6", type: "hotel", destination: "London, UK", price: 150, originalPrice: 180, dates: "Jan 20 - Jan 27", rating: 4.6,
    imageUrl: "https://placehold.co/600x400.png", imageHint: "London BigBen", description: "Charming hotel near Buckingham Palace.", hotelName: "The Royal Londoner",
    duration: "Per Night"
  },
   {
    id: "7", type: "package", destination: "Cancun, Mexico", price: 950, dates: "Feb 10 - Feb 17", rating: 4.7,
    imageUrl: "https://placehold.co/600x400.png", imageHint: "Cancun beach", description: "Relax at an all-inclusive resort in Cancun with flights and transfers.",
    duration: "7 Days"
  },
  {
    id: "8", type: "activity", destination: "Kyoto, Japan", price: 60, dates: "Any day", rating: 4.9,
    imageUrl: "https://placehold.co/600x400.png", imageHint: "Kyoto temple", description: "Traditional tea ceremony experience in Gion.", activityName: "Tea Ceremony",
    duration: "1.5 Hours"
  }
];

export async function fetchPersonalizedDeals(
  preferences: UserPreferences
): Promise<{ deals?: TravelDeal[]; error?: string }> {
  await delay(1500); // Simulate API latency

  console.log("Fetching deals with preferences:", preferences);

  // In a real scenario, you would:
  // 1. Prepare input for `personalizeDealRecommendations` AI flow.
  //    const aiInput = {
  //      userHistory: "Mock user history: Prefers beach vacations, budget conscious.", // Or construct from real history
  //      currentDeals: JSON.stringify(mockDeals.slice(0,5)), // Provide a subset of available deals or fetch live
  //      userPreferences: `Destination: ${preferences.destination}, Budget: ${preferences.budget}, Interests: ${preferences.interests.join(', ')}, Departure: ${preferences.departureCity}, Dates: ${preferences.startDate} to ${preferences.endDate}`,
  //    };
  // 2. Call the AI flow:
  //    const result = await personalizeDealRecommendations(aiInput);
  // 3. Parse `result.personalizedDeals` string (assuming it's JSON or structured) into TravelDeal[].
  //    const deals = JSON.parse(result.personalizedDeals); // This is an assumption
  // For now, we return mock data filtered slightly by preferences for demonstration.

  let filteredDeals = mockDeals;

  if (preferences.destination) {
    filteredDeals = filteredDeals.filter(deal => 
      deal.destination.toLowerCase().includes(preferences.destination.toLowerCase()) ||
      // Add some random chance to include other deals to simulate broader AI matching
      Math.random() < 0.5 
    );
  }

  if (preferences.budget) {
    filteredDeals = filteredDeals.filter(deal => deal.price <= preferences.budget || Math.random() < 0.3);
  }

  if (preferences.interests && preferences.interests.length > 0) {
    // Simple interest matching for mock - real AI would be more sophisticated
    if (preferences.interests.includes("beach") || preferences.interests.includes("relaxation")) {
      const beachDeals = mockDeals.filter(d => d.destination.toLowerCase().includes("bali") || d.destination.toLowerCase().includes("cancun"));
      filteredDeals = [...new Set([...filteredDeals, ...beachDeals])];
    }
     if (preferences.interests.includes("adventure")) {
      const adventureDeals = mockDeals.filter(d => d.type === "activity" || d.destination.toLowerCase().includes("paris")); // e.g. paris could be adventure
      filteredDeals = [...new Set([...filteredDeals, ...adventureDeals])];
    }
  }
  
  // Ensure we always return some deals if the initial list is not empty, or an empty array.
  if (mockDeals.length > 0 && filteredDeals.length === 0) {
     // Return a random subset if filtering results in empty
    return { deals: mockDeals.sort(() => 0.5 - Math.random()).slice(0, Math.min(3, mockDeals.length)) };
  }


  // Simulate no deals found sometimes
  // if (Math.random() < 0.1 && preferences.destination !== "") {
  //   return { deals: [] };
  // }

  return { deals: filteredDeals.slice(0, 10) }; // Return up to 10 matched deals
}
