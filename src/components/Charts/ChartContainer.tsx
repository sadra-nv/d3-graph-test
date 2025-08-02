import type {
  LabeledChartData,
  MultiSeriesPoint,
  SingleSeriesPoint,
} from "../../lib/types/charts";
import MultiSeriesChart from "./MultiSeriesChart";
import SingleSeriesChart from "./SingleSeriesChart";

type Props = {
  chart: LabeledChartData;
};

export default function ChartContainer({ chart }: Props) {
  const isMultiSeries = chart.label === "multi";

  return (
    <div>
      <h2>{chart.title}</h2>
      {isMultiSeries ? (
        <MultiSeriesChart data={chart.data as MultiSeriesPoint[]} />
      ) : (
        <SingleSeriesChart data={chart.data as SingleSeriesPoint[]} />
      )}
    </div>
  );
}
