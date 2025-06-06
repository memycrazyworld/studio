
"use server";

import type { TravelDeal, UserPreferences } from "@/types";
import { personalizeDealRecommendations } from "@/ai/flows/personalize-deal-recommendations";

// Simulate a delay to mimic API calls
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const mockDeals: TravelDeal[] = [
  {
    id: "1", type: "flight", destination: "Paris, France", price: 350, originalPrice: 400, dates: "Oct 10 - Oct 17", rating: 4.5,
    imageUrl: "https://placehold.co/800x600.png", imageHint: "Paris EiffelTower", description: "Round trip flight to the city of lights. Explore iconic landmarks like the Eiffel Tower, Louvre Museum, and Notre Dame Cathedral. Enjoy delicious French cuisine and charming Parisian streets.", airline: "Air France",
    duration: "7 Days",
  },
  {
    id: "2", type: "hotel", destination: "Tokyo, Japan", price: 120, originalPrice: 150, dates: "Nov 5 - Nov 12", rating: 4.8,
    imageUrl: "https://placehold.co/800x600.png", imageHint: "Tokyo skyline", description: "Stay in a modern hotel in bustling Shinjuku. Experience the vibrant culture, amazing food, and unique attractions of Tokyo. Close to Shinjuku Gyoen National Garden.", hotelName: "Shinjuku Grand",
    duration: "Per Night"
  },
  {
    id: "3", type: "activity", destination: "Rome, Italy", price: 75, dates: "Any day", rating: 4.2,
    imageUrl: "https://placehold.co/800x600.png", imageHint: "Rome Colosseum", description: "Guided tour of the Colosseum and Roman Forum. Step back in time and explore the heart of ancient Rome with an expert guide.", activityName: "Colosseum Tour",
    duration: "3 Hours"
  },
  {
    id: "4", type: "package", destination: "Bali, Indonesia", price: 1200, originalPrice: 1500, dates: "Dec 1 - Dec 10", rating: 4.9,
    imageUrl: "https://placehold.co/800x600.png", imageHint: "Bali beach", description: "All-inclusive Bali beach resort and spa package. Enjoy stunning beaches, lush rice paddies, and vibrant culture in this tropical paradise. Includes flights, accommodation, and daily breakfast.",
    duration: "10 Days"
  },
  {
    id: "5", type: "flight", destination: "New York, USA", price: 280, dates: "Sep 15 - Sep 20", rating: 4.3,
    imageUrl: "https://placehold.co/800x600.png", imageHint: "NewYork skyline", description: "Direct flight to the Big Apple. Experience Broadway shows, Central Park, Times Square, and world-class museums.", airline: "Delta",
    duration: "5 Days"
  },
  {
    id: "6", type: "hotel", destination: "London, UK", price: 150, originalPrice: 180, dates: "Jan 20 - Jan 27", rating: 4.6,
    imageUrl: "https://placehold.co/800x600.png", imageHint: "London BigBen", description: "Charming hotel near Buckingham Palace. Explore historic landmarks, enjoy afternoon tea, and visit famous markets.", hotelName: "The Royal Londoner",
    duration: "Per Night"
  },
   {
    id: "7", type: "package", destination: "Cancun, Mexico", price: 950, dates: "Feb 10 - Feb 17", rating: 4.7,
    imageUrl: "https://placehold.co/800x600.png", imageHint: "Cancun resort", description: "Relax at an all-inclusive resort in Cancun with flights and transfers. Enjoy beautiful beaches, crystal-clear waters, and exciting nightlife.",
    duration: "7 Days"
  },
  {
    id: "8", type: "activity", destination: "Kyoto, Japan", price: 60, dates: "Any day", rating: 4.9,
    imageUrl: "https://placehold.co/800x600.png", imageHint: "Kyoto temple", description: "Traditional tea ceremony experience in Gion. Immerse yourself in Japanese culture and learn the art of tea making.", activityName: "Tea Ceremony",
    duration: "1.5 Hours"
  }
];

export async function fetchPersonalizedDeals(
  preferences: UserPreferences
): Promise<{ deals?: TravelDeal[]; error?: string, dealIdsFromAI?: string[] }> {
  await delay(1500);
  console.log("Fetching deals with preferences:", preferences);

  try {
    const aiInput = {
      userHistory: `Previous trips: none. Budget conscious: ${preferences.budget < 1500}. Recent searches: ${preferences.destination}.`,
      currentDeals: JSON.stringify(mockDeals.map(d => ({id: d.id, destination: d.destination, price: d.price, type: d.type, rating: d.rating, description: d.description.substring(0,100) }))),
      userPreferences: `Seeking deals for ${preferences.destination || 'anywhere'}. Budget around $${preferences.budget}. Interests: ${preferences.interests.join(', ') || 'general travel'}. Departure from ${preferences.departureCity || 'any city'}. Travel dates around ${preferences.startDate ? preferences.startDate.toLocaleDateString() : 'flexible'} to ${preferences.endDate ? preferences.endDate.toLocaleDateString() : 'flexible'}.`,
    };

    console.log("AI Input for personalizeDealRecommendations:", JSON.stringify(aiInput, null, 2));

    const result = await personalizeDealRecommendations(aiInput);
    
    console.log("AI Output from personalizeDealRecommendations:", result);

    if (result.dealIds && Array.isArray(result.dealIds) && result.dealIds.length > 0) {
      const personalizedDeals = result.dealIds
        .map(id => mockDeals.find(deal => deal.id === id))
        .filter((deal): deal is TravelDeal => deal !== undefined);
      
      // Add some non-AI deals to make the list longer for demo purposes if AI returns few
      if (personalizedDeals.length < 5 && mockDeals.length > personalizedDeals.length) {
          const additionalDealsCount = Math.min(5 - personalizedDeals.length, mockDeals.length - personalizedDeals.length);
          const aiDealIdsSet = new Set(personalizedDeals.map(d => d.id));
          const additionalDeals = mockDeals.filter(d => !aiDealIdsSet.has(d.id)).slice(0, additionalDealsCount);
          return { deals: [...personalizedDeals, ...additionalDeals], dealIdsFromAI: result.dealIds };
      }
      return { deals: personalizedDeals, dealIdsFromAI: result.dealIds };
    } else {
      // Fallback to simple filtering if AI returns no specific deals or an error occurs in parsing
      console.log("AI did not return specific deal IDs, or an error occurred. Using fallback filtering.");
      let fallbackDeals = mockDeals;
      if (preferences.destination) {
        fallbackDeals = fallbackDeals.filter(deal => 
          deal.destination.toLowerCase().includes(preferences.destination.toLowerCase()) || Math.random() < 0.3
        );
      }
      if (preferences.budget) {
        fallbackDeals = fallbackDeals.filter(deal => deal.price <= preferences.budget || Math.random() < 0.2);
      }
      return { deals: fallbackDeals.sort(() => 0.5 - Math.random()).slice(0, 5) };
    }
  } catch (error) {
    console.error("Error calling AI flow or processing results:", error);
    // Fallback to random deals in case of any AI error
    const randomDeals = mockDeals.sort(() => 0.5 - Math.random()).slice(0, Math.min(3, mockDeals.length));
    return { deals: randomDeals, error: "Could not get personalized recommendations, showing some popular deals." };
  }
}

export async function fetchDealById(id: string): Promise<TravelDeal | undefined> {
  await delay(500); // Simulate API latency
  return mockDeals.find(deal => deal.id === id);
}
