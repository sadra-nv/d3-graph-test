import { useEffect, useState } from "react";
import ChartContainer from "./components/Charts/ChartContainer";
import type { ChartData } from "./lib/types/charts";
import "./App.css";

export default function App() {
  const [charts, setCharts] = useState<ChartData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Im fetching the data from public folder instead of importing, for smaller bundle size and its also closer to the real world scenario, there i would use swr or react-query
  useEffect(() => {
    setIsLoading(true);
    fetch("/data.json")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch data.json");
        return res.json();
      })
      .then((json) => {
        setCharts(json as ChartData[]);
      })
      .catch((err) => {
        console.error(err);
        setError("Unknowen Error, unable to load chart data.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  if (error)
    return (
      <section>
        <p>{error}</p>
      </section>
    );

  if (isLoading)
    return (
      <section>
        <p>Loading charts data...</p>
      </section>
    );

  return (
    <section>
      {charts.map((chart, i) => (
        <ChartContainer key={i} chart={chart} />
      ))}
    </section>
  );
}
