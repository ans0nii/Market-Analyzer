import express from "express";
import type { Request, Response } from "express";
import { analyzeMarket } from "../services/claude";
import { getMarkets, getMarket } from "../services/kalshi";

const analysisRouter = express.Router();

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

analysisRouter.get("/", async (_req: Request, res: Response) => {
  try {
    const tickers = await getMarkets();
    console.log("Traded markets found:", tickers?.length);

    if (!tickers || tickers.length === 0) {
      res.json([]);
      return;
    }

    const markets = await Promise.all(
      tickers.slice(0, 5).map((ticker: any) => getMarket(ticker)),
    );

    const activeMarkets = markets.filter(
      (market: any) => market && market.status === "active",
    );

    console.log("Active markets count:", activeMarkets.length);

    const batches = [];
    for (let i = 0; i < activeMarkets.length; i += 1) {
      batches.push(activeMarkets.slice(i, i + 1));
    }

    const results = [];
    for (const batch of batches) {
      const batchResults = await Promise.all(
        batch.map((market: any) => analyzeMarket(market)),
      );
      results.push(...batchResults);
      await sleep(70000);
    }

    console.log("Results count:", results.length);
    res.json(results);
  } catch (error) {
    console.log("Failed to analyze market", error);
    res.status(500).json({ error: "Failed to analyze markets" });
  }
});

export default analysisRouter;
