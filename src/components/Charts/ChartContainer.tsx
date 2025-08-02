import type {
  ChartData,
  MultiSeriesPoint,
  SingleSeriesPoint,
} from "../../lib/types/charts";
import MultiSeriesChart from "./MultiSeriesChart";
import SingleSeriesChart from "./SingleSeriesChart";

type Props = {
  chart: ChartData;
};

export default function ChartContainer({ chart }: Props) {
  const isMultiSeries = Array.isArray(chart.data[0][1]);

  return (
    <div>
      <h2>{chart.title}</h2>
      {isMultiSeries ? (
        // already have a safety check so its ok to cast the type of the data
        <MultiSeriesChart data={chart.data as MultiSeriesPoint[]} />
      ) : (
        <SingleSeriesChart data={chart.data as SingleSeriesPoint[]} />
      )}
    </div>
  );
}
