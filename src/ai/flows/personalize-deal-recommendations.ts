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
    .describe('A list of current travel deals with details like price, destination, dates, and ratings.'),
  userPreferences: z
    .string()
    .describe(
      'A summary of the users travel preferences (e.g., beach vacation, adventure, relaxation)'
    ),
});
export type PersonalizeDealRecommendationsInput = z.infer<
  typeof PersonalizeDealRecommendationsInputSchema
>;

const PersonalizeDealRecommendationsOutputSchema = z.object({
  personalizedDeals: z
    .string()
    .describe(
      'A list of personalized travel deals based on the users past travel history and preferences.'
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
  prompt: `You are a travel expert specializing in personalizing travel deal recommendations for users based on their travel history and preferences.

Given the following information about the user and available travel deals, generate a list of personalized travel deals that are most relevant to the user.

User History: {{{userHistory}}}
Current Deals: {{{currentDeals}}}
User Preferences: {{{userPreferences}}}

Personalized Deals:`,
});

const personalizeDealRecommendationsFlow = ai.defineFlow(
  {
    name: 'personalizeDealRecommendationsFlow',
    inputSchema: PersonalizeDealRecommendationsInputSchema,
    outputSchema: PersonalizeDealRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
