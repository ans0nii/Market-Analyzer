import { useState } from "react";

interface MarketResult {
  title: string;
  analysis: string;
}

function App() {
  const [results, setResults] = useState<MarketResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runAnalysis = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("http://localhost:8080/analysis");
      if (!res.ok) throw new Error("Failed to fetch analysis");
      const data = await res.json();
      setResults(data);
    } catch (err) {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Kalshi Market Analyzer</h1>
      <button onClick={runAnalysis} disabled={loading}>
        {loading ? "Analyzing..." : "Run analysis"}
      </button>
      {error && <p>{error}</p>}
      {results.map((result, index) => (
        <div key={index}>
          <h2>{result.title}</h2>
          <p>{result.analysis}</p>
        </div>
      ))}
    </div>
  );
}

export default App;
