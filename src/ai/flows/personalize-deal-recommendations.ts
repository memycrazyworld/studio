
'use server';
/**
 * @fileOverview Personalizes travel deal recommendations based on user history and preferences.
 *
 * - personalizeDealRecommendations - A function that personalizes travel deal recommendations.
 * - PersonalizeDealRecommendationsInput - The input type for the personalizeDealRecommendations function.
 * - PersonalizeDealRecommendationsOutput - The return type for the personalizeDealRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizeDealRecommendationsInputSchema = z.object({
  userHistory: z
    .string()
    .describe(
      'A summary of the users past travel history, including destinations, travel dates, budget, and interests.'
    ),
  currentDeals: z
    .string()
    .describe('A JSON string list of current travel deals with details like id, price, destination, dates, type, rating, and a short description. Example: [{"id":"1", "destination":"Paris", "price":300, "type":"flight", "description":"...", "rating":4.5}]'),
  userPreferences: z
    .string()
    .describe(
      'A summary of the users travel preferences (e.g., beach vacation, adventure, relaxation, budget, destination, dates)'
    ),
});
export type PersonalizeDealRecommendationsInput = z.infer<
  typeof PersonalizeDealRecommendationsInputSchema
>;

const DealIdentifierSchema = z.object({
  id: z.string().describe("The unique identifier of the recommended deal, matching an ID from the 'currentDeals' input."),
  reasoning: z.string().optional().describe("A brief explanation why this deal is recommended for the user.")
});

const PersonalizeDealRecommendationsOutputSchema = z.object({
  personalizedDeals: z
    .array(DealIdentifierSchema)
    .describe(
      'An array of objects, each containing an "id" of a recommended travel deal from the "currentDeals" input and an optional "reasoning". Aim for 3-5 top recommendations. Ensure IDs exist in the input.'
    ),
});
export type PersonalizeDealRecommendationsOutput = z.infer<
  typeof PersonalizeDealRecommendationsOutputSchema
>;

export async function personalizeDealRecommendations(
  input: PersonalizeDealRecommendationsInput
): Promise<PersonalizeDealRecommendationsOutput> {
  return personalizeDealRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizeDealRecommendationsPrompt',
  input: {schema: PersonalizeDealRecommendationsInputSchema},
  output: {schema: PersonalizeDealRecommendationsOutputSchema},
  prompt: `You are a travel expert specializing in personalizing travel deal recommendations.

Given the following user history, user preferences, and a list of current travel deals (in JSON format), identify the most relevant deals for the user.
Return your recommendations as a JSON array of objects, where each object contains the 'id' of the deal and an optional 'reasoning'.
Focus on matching the user's preferences for destination, budget, interests, and travel style.
Prioritize deals with higher ratings if multiple similar options exist.
Ensure the 'id' you return EXACTLY matches one of the 'id's from the 'currentDeals' input.

User History: {{{userHistory}}}
User Preferences: {{{userPreferences}}}

Current Deals:
{{{currentDeals}}}

Based on this, provide your personalized deal recommendations.
`,
});

const personalizeDealRecommendationsFlow = ai.defineFlow(
  {
    name: 'personalizeDealRecommendationsFlow',
    inputSchema: PersonalizeDealRecommendationsInputSchema,
    outputSchema: PersonalizeDealRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output || !output.personalizedDeals) {
      console.warn("AI did not return personalized deals in the expected format.");
      return { personalizedDeals: [] };
    }
    // Validate that personalizedDeals is an array, as sometimes the LLM might return a stringified JSON
    if (typeof output.personalizedDeals === 'string') {
      try {
        const parsedDeals = JSON.parse(output.personalizedDeals as any);
        if (Array.isArray(parsedDeals)) {
           return { personalizedDeals: parsedDeals.filter(deal => deal && typeof deal.id === 'string') };
        }
      } catch (e) {
        console.error("Error parsing stringified personalizedDeals from AI:", e);
        return { personalizedDeals: [] };
      }
    }
    return { personalizedDeals: output.personalizedDeals.filter(deal => deal && typeof deal.id === 'string') };
  }
);
