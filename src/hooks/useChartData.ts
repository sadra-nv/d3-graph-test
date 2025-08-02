// src/hooks/useChartData.ts
import { useEffect, useState } from "react";
import type { LabeledChartData } from "../lib/types/charts";
import { validateChartData } from "../lib/utils/charts";

export const useChartData = (url: string) => {
  const [validatedCharts, setValidatedCharts] = useState<LabeledChartData[]>(
    []
  );
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Im fetching the data from public folder instead of importing, for smaller bundle size and its also closer to the real world scenario, although there I would use swr or react-query
  useEffect(() => {
    setIsLoading(true);
    fetch(url)
      .then((res) => {
        if (!res.ok)
          throw new Error(
            `Failed to fetch data: ${res.status} ${res.statusText}`
          );
        return res.json();
      })
      .then((data) => {
        // since the component is not going to re-mount in the applications lifecycle caching the result of validateChartData is not necessary
        const validatedData = validateChartData(data);
        setValidatedCharts(validatedData);
        setError(null);
      })
      .catch((err) => {
        setError(`Unknown Error, unable to load chart data: ${err.message}`);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [url]);

  return { validatedCharts, error, isLoading };
};
