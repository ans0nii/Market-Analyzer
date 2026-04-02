import { MarketApi, Configuration } from "kalshi-typescript";
import dotenv from "dotenv";
dotenv.config();

const configuration = new Configuration({
  apiKey: process.env.KALSHI_API_KEY,
  privateKeyPath: process.env.KALSHI_PRIVATE_KEY_PATH,
  basePath: "https://api.elections.kalshi.com/trade-api/v2",
});

const apiInstance = new MarketApi(configuration);

export async function getMarkets() {
  try {
    const { data: tradesData } = await apiInstance.getTrades(1000);

    const uniqueTickers = [
      ...new Set(tradesData.trades?.map((trade) => trade.ticker)),
    ];

    console.log("Traded markets found:", uniqueTickers.length);

    return uniqueTickers;
  } catch (error) {
    console.log("Kalshi Api error", error);
    throw error;
  }
}

export async function getMarket(ticker: string) {
  try {
    const { data } = await apiInstance.getMarket(ticker);
    return data.market;
  } catch (error) {
    console.log(`Failed to get market ${ticker}:`, error);
    return null;
  }
}
