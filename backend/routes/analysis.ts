import express from "express";
import type { Request, Response } from "express";
import { analyzeMarket } from "../services/claude";
import { getMarkets } from "../services/kalshi";

const analysisRouter = express.Router();

analysisRouter.get("/", async (req: Request, res: Response) => {
  try {
    const markets = await getMarkets();

    if (!markets) {
      console.log("Failed to GET markets");
      return;
    }

    const batches = [];
    for (let i = 0; i < markets.length; i += 10) {
      batches.push(markets.slice(i, i + 10));
    }

    const results = [];
    for (const batch of batches) {
      const batchResults = await Promise.all(
        batch.map((market) => analyzeMarket(market)),
      );
      results.push(...batchResults);
    }
    res.json(results);
  } catch {
    console.log("Failed to analyze market");
  }
});

export default analysisRouter;