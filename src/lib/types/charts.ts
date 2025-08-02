export type SingleSeriesPoint = [number, number | null];
export type MultiSeriesPoint = [number, (number | null)[]];

export interface ChartData {
  title: string;
  data: SingleSeriesPoint[] | MultiSeriesPoint[];
}
