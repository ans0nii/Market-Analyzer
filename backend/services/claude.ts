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
          content: `You are a prediction market analyst. Analyse this Kalshi market and tell me if theres a favorable trading oppurtunity. Market: ${market.title} Current YES price: ${market.yes_bid_dollars} cents. 
          (implies ${parseFloat(market.yes_bid_dollars) * 100}% probability) 
          Current NO price: ${market.no_ask_dollars} dollars
          Closes: ${market.close_time}
          What YES means: ${market.yes_sub_title}
          What NO means: ${market.no_sub_title}

          Based on your knowledge of this topic and only current/very recent news from reputable sources:
        1. What do you think the real probability of YES is?
        2. Is the market mispriced? By how much? (difference between real probability and current price)
        3. Should I bet YES, NO, or skip this market entirely?
        4. How confident are you in this assessment? (low/medium/high)
        5. Brief reasoning for your recommendation and One sentence reasoning citing your source.
        The goal is to make as much money as possible but in a safe manner. So if a market has 70% on one side but 30% on the other
        if that 30% is actually maybe 50% or higher in your evaluation I would like to be informed those are just example numbers, point is the lower percentage
        is actually higher in your predicition.
        For each market imagine you have 10 dollar budget (you do not have to use the entire budget), if you said YES take the trade how many dollars would you put on it. 
        Be direct and specific. Only recommend a trade if the edge is greater than 15 percentage points. Otherwise say SKIP.`,
        },
      ],
    });

    const textBlocks = response.content
      .filter((block) => block.type === "text")
      .map((block) => (block.type === "text" ? block.text : ""))
      .join("\n");
      return textBlocks
  } catch (error) {
    console.error("Claude API error:", error);
    throw error;
  }
}
