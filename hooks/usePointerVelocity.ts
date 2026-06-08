"use client";

import { useRef } from "react";

export function usePointerVelocity() {
  const previousRef = useRef({ x: 0, y: 0, time: 0, initialized: false });

  const measureVelocity = (x: number, y: number) => {
    const now = performance.now();
    const previous = previousRef.current;

    if (!previous.initialized) {
      previousRef.current = { x, y, time: now, initialized: true };
      return 0;
    }

    const distance = Math.hypot(x - previous.x, y - previous.y);
    const elapsed = Math.max(16, now - previous.time);
    const pixelsPerSecond = (distance / elapsed) * 1000;
    const normalized = Math.min(1, pixelsPerSecond / 1400);

    previousRef.current = { x, y, time: now, initialized: true };

    return normalized;
  };

  const resetVelocity = () => {
    previousRef.current.initialized = false;
  };

  return { measureVelocity, resetVelocity };
}
