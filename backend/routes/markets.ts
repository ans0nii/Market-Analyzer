import { getMarkets } from "../services/kalshi";
import express from "express";
import type { Request, Response } from "express";

const marketsRouter = express.Router();

marketsRouter.get("/", async (_req : Request, res : Response) => {
    try {
        const data = await getMarkets();

        if(!data){
            console.log("getMarkets failed!")
            return;
        }

        res.json(data);

    } catch {
        console.log("Failed to GET markets")
    }
})

export default marketsRouter;