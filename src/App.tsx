import ChartContainer from "./components/Charts/ChartContainer";
import "./App.css";
import { useChartData } from "./hooks/useChartData";

export default function App() {
  const { validatedCharts, error, isLoading } = useChartData("/data.json");

  if (isLoading)
    return (
      <section>
        <p>Loading charts data...</p>
      </section>
    );

  if (error)
    return (
      <section>
        <p>{error}</p>
      </section>
    );

  return (
    <section>
      {validatedCharts.map((chart, i) => (
        <ChartContainer key={i} chart={chart} />
      ))}
    </section>
  );
}
