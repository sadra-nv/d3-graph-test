import * as d3 from "d3";

type AxisOptions = {
  svg: d3.Selection<SVGSVGElement | null, unknown, null, undefined>;
  x: d3.ScaleLinear<number, number>;
  y: d3.ScaleLinear<number, number>;
  width: number;
  height: number;
  margin: { top: number; right: number; bottom: number; left: number };
  color?: string;
};

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
