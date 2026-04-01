import Anthropic from "@anthropic-ai/sdk";
import dotenv from "dotenv";
dotenv.config();

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function analyzeMarket(market: any) {
  try {
    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      tools: [
        {
          type: "web_search_20250305",
          name: "web_search",
        },
      ],
      messages: [
        {
          role: "user",
          content: `You are a prediction market analyst. Analyse this Kalshi market and tell me if theres a favorable trading oppurtunity. Market: ${market.title} Current YES price: ${market.yes_bid} cents. 
          (implies ${market.yes_bid}% probability) 
          Current NO price: ${market.no_ask} cents
          Closes: ${market.close_time}

          Based on your knowledge of this topic and only current/very recent news from reputable sources:
        1. What do you think the real probability of YES is?
        2. Is the market mispriced? By how much? (difference between real probability and current price)
        3. Should I bet YES, NO, or skip this market entirely?
        4. How confident are you in this assessment? (low/medium/high)
        5. Brief reasoning for your recommendation and One sentence reasoning citing your source.
        Be direct and specific. Only recommend a trade if the edge is greater than 15 percentage points. Otherwise say SKIP.`,
        },
      ],
    });

    return response.content[0];
  } catch (error) {
    console.error("Claude API error:", error);
    throw error;
  }
}
