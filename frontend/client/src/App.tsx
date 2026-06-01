import { useState } from "react";
import "./App.css";

interface MarketResult {
  title: string;
  analysis: string;
}

function App() {
  const [results, setResults] = useState<MarketResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getReccomendation = (analysis: string): string => {
    const match = analysis.match(/Recommendation:\s*(YES|NO|SKIP)/);
    return match ? match[1] : "SKIP";
  };

  const runAnalysis = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("http://localhost:8080/analysis");
      if (!res.ok) throw new Error("Failed to fetch analysis");
      const data = await res.json();
      setResults(data);
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <h1>Kalshi Market Analyzer</h1>
      <button onClick={runAnalysis} disabled={loading} className="run_button">
        {loading ? "Analyzing..." : "Run analysis"}
      </button>
      {error && <p className="error">{error}</p>}
      {results.map((result, index) => {
        const rec = getReccomendation(result.analysis);
        return (
          <div key={index} className="market-card">
            <h2 className="market-title">{result.title}</h2>
            <p className={`recommendation ${rec.toLowerCase()}`}>{rec}</p>
            <p className="market-analysis">{result.analysis}</p>
          </div>
        );
      })}
    </div>
  );
}

export default App;
