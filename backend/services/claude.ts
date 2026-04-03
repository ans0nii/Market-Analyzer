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
          content: `You are a prediction market analyst. Analyse this Kalshi market and tell me if there is a favorable trading opportunity.
      Market: ${market.title}
      Current YES price: ${market.yes_bid_dollars} dollars (implies ${parseFloat(market.yes_bid_dollars) * 100}% probability)
      Current NO price: ${market.no_ask_dollars} dollars
      Closes: ${market.close_time}
      What YES means: ${market.yes_sub_title}
      What NO means: ${market.no_sub_title}

      Based on current and very recent news from reputable sources only:
      1. What is the real probability of YES?
      2. Is the market mispriced? By how much?
      3. Should I bet YES, NO, or SKIP?
      4. Confidence level: low/medium/high
      5. One sentence reasoning citing your source.

      Rules:
      - Only recommend trades where the current market price is between 45% and 85%
      - Markets below 45% or above 85% are always SKIP regardless of edge
      - Only recommend a trade if edge is greater than 15 percentage points
      - Take advantage of markets where the crowd is close but there a gaps in true value. In example, if a market has a 51% YES but in your recommendations it should be a 66% YES, inform me. 
      - If recommending a trade, how much of a $10 budget would you allocate?`,
        },
      ],
    });

    const textBlocks = response.content
      .filter((block) => block.type === "text")
      .map((block) => (block.type === "text" ? block.text : ""))
      .join("\n");
    return textBlocks;
  } catch (error) {
    console.error("Claude API error:", error);
    throw error;
  }
}
