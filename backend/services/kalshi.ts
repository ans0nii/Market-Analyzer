import { MarketApi, Configuration } from "kalshi-typescript";
import dotenv from "dotenv";
dotenv.config();

const configuration = new Configuration({
  apiKey: process.env.KALSHI_API_KEY,
  privateKeyPath: process.env.KALSHI_PRIVATE_KEY_PATH,
  basePath: "https://api.elections.kalshi.com/trade-api/v2",
});

const startOfDay = Math.floor(new Date().setHours(0, 0, 0, 0) / 1000);
const endOfDay = Math.floor(new Date().setHours(23, 59, 59, 999) / 1000);

const apiInstance = new MarketApi(configuration);

export async function getMarkets() {
  try {
    const { status: httpStatus, data } = await apiInstance.getMarkets(
      undefined,
      undefined,
      undefined,
      undefined,
      endOfDay,
      startOfDay,
      undefined,
      undefined,
    );

    const openMarkets = data.markets?.filter(market => market.status == "active");
    return openMarkets
  } catch (error) {
    console.log("Kalshi Api error", error);
    throw error;
  }
}
