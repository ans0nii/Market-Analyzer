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

    const shuffled = [...tickers].sort(() => Math.random() - 0.5);

    const markets = await Promise.all(
      shuffled.slice(0, 20).map((ticker: any) => getMarket(ticker)),
    );

    const activeMarkets = markets.filter((market: any) => {
      if (!market || market.status !== "active") return false;
      const expiration = new Date(market.expected_expiration_time);
      const now = new Date();
      const today = new Date();
      const twoHoursFromNow = new Date(now.getTime() + 2 * 60 * 60 * 1000);
      return (
        expiration.toDateString() === today.toDateString() &&
        expiration > twoHoursFromNow
      );
    });

    console.log("Active markets expiring today:", activeMarkets.length);

    const marketsToAnalyze =
      activeMarkets.length >= 5 ? activeMarkets.slice(0, 5) : activeMarkets;

    const batches = [];
    for (let i = 0; i < marketsToAnalyze.length; i += 1) {
      batches.push(marketsToAnalyze.slice(i, i + 1));
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
