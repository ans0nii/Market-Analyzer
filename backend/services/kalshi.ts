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
    const { status: httpStatus, data } = await apiInstance.getMarkets();

    return data;
  } catch (error) {
    console.log("Kalshi Api error", error);
    throw error;
  }
}
