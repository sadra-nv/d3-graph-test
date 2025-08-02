import { useEffect, useRef } from "react";
import * as d3 from "d3";
import type { MultiSeriesPoint } from "../../lib/types/charts";
import { renderStyledAxes } from "../../lib/utils/charts";

type Props = {
  data: MultiSeriesPoint[];
};

const colors = ["blue", "green", "red"];

export default function MultiSeriesChart({ data }: Props) {
  const ref = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    const width = 400;
    const height = 200;
    const margin = { top: 10, right: 10, bottom: 30, left: 40 };

    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();

    const seriesCount = data[0][1].length;

    const x = d3
      .scaleLinear()
      .domain(d3.extent(data, (d) => d[0]) as [number, number])
      .range([margin.left, width - margin.right]);

    const allYValues: number[] = [];

    for (let i = 0; i < seriesCount; i++) {
      allYValues.push(
        ...(data.map((d) => d[1][i]).filter((v) => v !== null) as number[])
      );
    }

    const y = d3
      .scaleLinear()
      .domain(d3.extent(allYValues) as [number, number])
      .range([height - margin.bottom, margin.top]);

    for (let i = 0; i < seriesCount; i++) {
      const seriesData = data
        .map((d) => [d[0], d[1][i]] as [number, number | null])
        .filter(([, value]) => value !== null) as [number, number][];

      const line = d3
        .line<[number, number]>()
        .x((d) => x(d[0]))
        .y((d) => y(d[1]));

      svg
        .append("path")
        .datum(seriesData)
        .attr("fill", "none")
        .attr("stroke", colors[i])
        .attr("stroke-width", 2)
        .attr("d", line);
    }

    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x));
    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));

    renderStyledAxes({ height, margin, svg, width, x, y });
  }, [data]);

  return <svg ref={ref} width={400} height={200} />;
}
