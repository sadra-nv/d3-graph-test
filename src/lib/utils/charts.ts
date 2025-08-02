import * as d3 from "d3";
import type {
  LabeledChartData,
  MultiSeriesPoint,
  SingleSeriesPoint,
} from "../types/charts";

type AxisOptions = {
  svg: d3.Selection<SVGSVGElement | null, unknown, null, undefined>;
  x: d3.ScaleLinear<number, number>;
  y: d3.ScaleLinear<number, number>;
  width: number;
  height: number;
  margin: { top: number; right: number; bottom: number; left: number };
  color?: string;
};

// for coloring the axis of charts
export function renderStyledAxes({
  svg,
  x,
  y,
  height,
  margin,
  color = "white",
}: AxisOptions) {
  const xAxis = svg
    .append("g")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x));

  const yAxis = svg
    .append("g")
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y));

  xAxis.selectAll("text").attr("fill", color);
  yAxis.selectAll("text").attr("fill", color);

  xAxis.select(".domain").attr("stroke", color).attr("stroke-width", 2);
  yAxis.select(".domain").attr("stroke", color).attr("stroke-width", 2);

  xAxis.selectAll("line").attr("stroke", color);
  yAxis.selectAll("line").attr("stroke", color);
}

// Utility function to validate a SingleSeriesPoint
export const isSingleSeriesPoint = (
  point: unknown
): point is SingleSeriesPoint => {
  return (
    Array.isArray(point) &&
    point.length === 2 &&
    typeof point[0] === "number" &&
    (typeof point[1] === "number" || point[1] === null)
  );
};

// Utility function to validate a MultiSeriesPoint
export const isMultiSeriesPoint = (
  point: unknown
): point is MultiSeriesPoint => {
  return (
    Array.isArray(point) &&
    point.length === 2 &&
    typeof point[0] === "number" &&
    Array.isArray(point[1]) &&
    point[1].every((value) => typeof value === "number" || value === null)
  );
};

export const validateChartData = (data: unknown): LabeledChartData[] => {
  // Check if data is an array
  if (!Array.isArray(data)) {
    throw new Error("Data must be an array of chart objects.");
  }

  const validCharts: LabeledChartData[] = [];
  const errors: string[] = [];

  data.forEach((chart, index) => {
    // Validate chart object structure
    if (!chart || typeof chart !== "object") {
      errors.push(`Chart at index ${index} is not a valid object.`);
      return;
    }

    // Validate title
    if (typeof chart.title !== "string" || chart.title.trim() === "") {
      errors.push(`Chart at index ${index} has an invalid or missing title.`);
      return;
    }

    // Validate data array
    if (!Array.isArray(chart.data)) {
      errors.push(`Chart at index ${index} has invalid data (not an array).`);
      return;
    }

    // Validate each data point
    const isValidData = chart.data.every(
      (point: unknown) =>
        isSingleSeriesPoint(point) || isMultiSeriesPoint(point)
    );

    if (!isValidData) {
      errors.push(`Chart "${chart.title}" contains invalid data points.`);
      return;
    }

    // Add a chart label, for later rendering "multi" and "single" charts seperatly in ChartContainerComponent
    const labeledChart = chart as LabeledChartData;

    labeledChart.label = isMultiSeriesPoint(chart.data[0]) ? "multi" : "single";

    // If all validations pass, add to validCharts
    validCharts.push(labeledChart);
  });

  if (errors.length > 0) {
    throw new Error(`Validation errors: ${errors.join("; ")}`);
  }

  if (validCharts.length === 0) {
    throw new Error("No valid chart data found.");
  }

  return validCharts;
};
