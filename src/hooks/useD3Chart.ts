import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { useContainerDimensions } from "./useContainerDimensions";
import type {
  LabeledChartData,
  MultiSeriesPoint,
  SingleSeriesPoint,
} from "../lib/types/charts";
import { renderStyledAxes } from "../lib/utils/charts";

const colors = ["blue", "green", "red", "gold"]; // Colors for multi-series and single-series

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
    svg.selectAll("*").remove(); // Clear previous content

    // X-axis scale (common for both chart types)
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
      // Handle SingleSeriesPoint data
      const filtered = (data as SingleSeriesPoint[]).filter(
        ([, value]) => value !== null
      ) as [number, number][];

      if (filtered.length === 0) return; // Skip if no valid data

      const y = d3
        .scaleLinear()
        .domain(
          d3.extent(filtered, (d: [number, number]) => d[1]) as [number, number]
        )
        .range([height - margin.bottom, margin.top]);

      const line = d3
        .line<[number, number]>()
        .x((d) => x(d[0]))
        .y((d) => y(d[1]));

      svg
        .append("path")
        .datum(filtered)
        .attr("fill", "none")
        .attr("stroke", colors[colors.length - 1]) // Use gold for single series
        .attr("stroke-width", 2)
        .attr("d", line);

      renderStyledAxes({ svg, x, y, width, height, margin });
    } else {
      // Handle MultiSeriesPoint data
      const seriesCount = (data as MultiSeriesPoint[])[0]?.[1]?.length || 0;
      if (seriesCount === 0) return;

      // Collect all y-values across series for y-scale
      const allYValues: number[] = [];
      for (let i = 0; i < seriesCount; i++) {
        allYValues.push(
          ...((data as MultiSeriesPoint[])
            .map((d) => d[1][i])
            .filter((v) => v !== null) as number[])
        );
      }

      if (allYValues.length === 0) return; // Skip if no valid y-values

      const y = d3
        .scaleLinear()
        .domain(d3.extent(allYValues) as [number, number])
        .range([height - margin.bottom, margin.top]);

      // Render each series
      for (let i = 0; i < seriesCount; i++) {
        const seriesData = (data as MultiSeriesPoint[])
          .map((d) => [d[0], d[1][i]] as [number, number | null])
          .filter(([, value]) => value !== null) as [number, number][];

        if (seriesData.length === 0) continue; // Skip empty series

        const line = d3
          .line<[number, number]>()
          .x((d) => x(d[0]))
          .y((d) => y(d[1]));

        svg
          .append("path")
          .datum(seriesData)
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
