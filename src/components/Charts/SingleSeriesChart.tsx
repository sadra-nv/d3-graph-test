import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { renderStyledAxes } from "../../lib/utils/charts";
import { useContainerDimensions } from "../../hooks/useContainerDimensions";

type Props = {
  data: [number, number | null][];
};

export default function SingleSeriesChart({ data }: Props) {
  const ref = useRef<SVGSVGElement | null>(null);

  const { containerRef, dimensions } = useContainerDimensions<HTMLDivElement>();

  useEffect(() => {
    const filtered = data.filter(([, value]) => value !== null) as [
      number,
      number
    ][];

    const { width, height } = dimensions;
    const margin = { top: 10, right: 10, bottom: 30, left: 40 };

    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();

    const x = d3
      .scaleLinear()
      .domain(d3.extent(filtered, (d) => d[0]) as [number, number])
      .range([margin.left, width - margin.right]);

    const y = d3
      .scaleLinear()
      .domain(d3.extent(filtered, (d) => d[1]) as [number, number])
      .range([height - margin.bottom, margin.top]);

    const line = d3
      .line<[number, number]>()
      .x((d) => x(d[0]))
      .y((d) => y(d[1]));

    svg
      .append("path")
      .datum(filtered)
      .attr("fill", "none")
      .attr("stroke", "gold")
      .attr("stroke-width", 2)
      .attr("d", line);

    renderStyledAxes({ height, margin, svg, width, x, y });
  }, [data, dimensions]);

  return (
    <div ref={containerRef}>
      <svg
        ref={ref}
        width={dimensions.width}
        height={dimensions.height}
        viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
        preserveAspectRatio="xMidYMid meet"
      />
    </div>
  );
}
