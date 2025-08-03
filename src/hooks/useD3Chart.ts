import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { useContainerDimensions } from "./useContainerDimensions";
import type {
  LabeledChartData,
  MultiSeriesPoint,
  SingleSeriesPoint,
} from "../lib/types/charts";
import { renderStyledAxes } from "../lib/utils/charts";

const colors = ["blue", "green", "red", "gold"]; // Blue, Green, Red for multi; Gold for single

type UseD3ChartProps = {
  data: LabeledChartData["data"];
  label: LabeledChartData["label"];
};

export const useD3Chart = ({ data, label }: UseD3ChartProps) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const { containerRef, dimensions } = useContainerDimensions<HTMLDivElement>();

  useEffect(() => {
    if (
      !svgRef.current ||
      !dimensions.width ||
      !dimensions.height ||
      data.length === 0
    )
      return;

    const { width, height } = dimensions;
    const margin = { top: 10, right: 10, bottom: 30, left: 40 };
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous chart

    // Shared X scale
    const x = d3
      .scaleLinear()
      .domain(
        d3.extent(data, (d: SingleSeriesPoint | MultiSeriesPoint) => d[0]) as [
          number,
          number
        ]
      )
      .range([margin.left, width - margin.right]);

    if (label === "single") {
      const yValues = (data as SingleSeriesPoint[])
        .map(([, value]) => value)
        .filter((v): v is number => v !== null);

      if (yValues.length === 0) return;

      const y = d3
        .scaleLinear()
        .domain(d3.extent(yValues) as [number, number])
        .range([height - margin.bottom, margin.top]);

      const line = d3
        .line<[number, number | null]>()
        .defined((d) => d[1] !== null)
        .x((d) => x(d[0]))
        .y((d) => y(d[1] as number));

      svg
        .append("path")
        .datum(data as SingleSeriesPoint[])
        .attr("fill", "none")
        .attr("stroke", "gold")
        .attr("stroke-width", 2)
        .attr("d", line);

      renderStyledAxes({ svg, x, y, width, height, margin });
    } else {
      const seriesCount = (data as MultiSeriesPoint[])[0]?.[1]?.length || 0;
      if (seriesCount === 0) return;

      const allYValues = (data as MultiSeriesPoint[])
        .flatMap(([, values]) => values)
        .filter((v): v is number => v !== null);

      if (allYValues.length === 0) return;

      const y = d3
        .scaleLinear()
        .domain(d3.extent(allYValues) as [number, number])
        .range([height - margin.bottom, margin.top]);

      for (let i = 0; i < seriesCount; i++) {
        const series = (data as MultiSeriesPoint[]).map(
          ([timestamp, values]) =>
            [timestamp, values[i]] as [number, number | null]
        );

        const line = d3
          .line<[number, number | null]>()
          .defined((d) => d[1] !== null)
          .x((d) => x(d[0]))
          .y((d) => y(d[1] as number));

        svg
          .append("path")
          .datum(series)
          .attr("fill", "none")
          .attr("stroke", colors[i % colors.length])
          .attr("stroke-width", 2)
          .attr("d", line);
      }

      renderStyledAxes({ svg, x, y, width, height, margin });
    }
  }, [data, label, dimensions]);

  return { svgRef, containerRef, dimensions };
};
