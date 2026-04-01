import express from "express";
import type { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import marketsRouter from "./routes/markets";
import analysisRouter from "./routes/analysis";

process.on("uncaughtException", (error) => {
  console.error("uncaught exception:", error);
  process.exit(1);
});

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use("/markets", marketsRouter);
app.use("/analysis", analysisRouter)

app.get("/", (_req: Request, res: Response) => {
  res.json({ message: "Server is running" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
