import { useEffect, useState, useRef, useCallback } from "react";

export function useContainerDimensions<T extends HTMLElement>() {
  const containerRef = useRef<T | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const updateDimensions = useCallback(() => {
    if (containerRef.current) {
      const { width } = containerRef.current.getBoundingClientRect();
      setDimensions({ width, height: width * 0.5 }); // 2:1 aspect ratio
    }
  }, []);

  useEffect(() => {
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, [updateDimensions]);

  return { containerRef, dimensions };
}
