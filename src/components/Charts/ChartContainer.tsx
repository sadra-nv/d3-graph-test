import { useD3Chart } from "../../hooks/useD3Chart";
import type { LabeledChartData } from "../../lib/types/charts";

type Props = {
  chart: LabeledChartData;
};

export default function ChartContainer({ chart }: Props) {
  const { svgRef, containerRef, dimensions } = useD3Chart({
    data: chart.data,
    label: chart.label,
  });

  return (
    <div>
      <h2>{chart.title}</h2>
      <div ref={containerRef}>
        <svg
          ref={svgRef}
          width={dimensions.width}
          height={dimensions.height}
          viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
          preserveAspectRatio="xMidYMid meet"
        />
      </div>
    </div>
  );
}
