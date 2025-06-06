// Summarize key details of a travel deal.
'use server';
/**
 * @fileOverview Summarizes the key details of a travel deal, such as attractions.
 *
 * - summarizeDealDetails - A function that summarizes the travel deal details.
 * - SummarizeDealDetailsInput - The input type for the summarizeDealDetails function.
 * - SummarizeDealDetailsOutput - The return type for the summarizeDealDetails function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeDealDetailsInputSchema = z.object({
  dealDetails: z
    .string()
    .describe('The full details of the travel deal to be summarized.'),
});
export type SummarizeDealDetailsInput = z.infer<
  typeof SummarizeDealDetailsInputSchema
>;

const SummarizeDealDetailsOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the travel deal details.'),
});
export type SummarizeDealDetailsOutput = z.infer<
  typeof SummarizeDealDetailsOutputSchema
>;

export async function summarizeDealDetails(
  input: SummarizeDealDetailsInput
): Promise<SummarizeDealDetailsOutput> {
  return summarizeDealDetailsFlow(input);
}

const summarizeDealDetailsPrompt = ai.definePrompt({
  name: 'summarizeDealDetailsPrompt',
  input: {schema: SummarizeDealDetailsInputSchema},
  output: {schema: SummarizeDealDetailsOutputSchema},
  prompt: `You are a travel expert summarizing travel deals for users.

  Given the following travel deal details, provide a concise summary highlighting the main attractions and key benefits:

  Deal Details:
  {{dealDetails}}
  `,
});

const summarizeDealDetailsFlow = ai.defineFlow(
  {
    name: 'summarizeDealDetailsFlow',
    inputSchema: SummarizeDealDetailsInputSchema,
    outputSchema: SummarizeDealDetailsOutputSchema,
  },
  async input => {
    const {output} = await summarizeDealDetailsPrompt(input);
    return output!;
  }
);
