# Kalshi Market Analyzer

An AI - powered prediction market analysis tool

## What it does
- Fetches active Kalshi prediction markets expiring today
- Uses Claude AI with web search to analyze each market for mispricings
- Recommends YES, NO, or SKIP based on edge thresholds
- Built for personal trading use

## Demo Mode
This live version runs in demo mode -- clicking "Run Analysis" returns a sample market

To run real analysis:
1. Set `USE_MOCK = false` in `backend/routes/analysis.ts`
2. Add your own Kalshi API credentials to `.env`
3. Adjust thresholds in `backend/services/claude.ts` to your preference:
   - Price range filter (default: 45%-85%)
   - Minimum edge threshold (default: 15 percentage points)
   - Budget allocation per trade (default: $10)

## Rate Limits
The Claude API has rate limits that affect analysis speed. Each market analysis includes a 70 second delay between requests to stay within token limits. Analyzing 5 markets takes approximately 6 minutes.

## Disclaimer
This is an experimental personal project built for learning purposes. The AI analysis is not financial advice and there is no guarantee of accuracy or profitability. This tool has not been validated in live trading conditions and results may vary significantly. Use at your own risk.

## Tech Stack
- Backend: Node.js, Express, TypeScript
- AI: Anthropic Claude API with web search
- Frontend: React, TypeScript, Vite
- Deployment: Railway (backend), Vercel (frontend)

## Live Demo
https://tunnel-ebon.vercel.app/
