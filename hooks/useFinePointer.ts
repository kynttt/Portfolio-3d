"use client";

import { useEffect, useState } from "react";

export function useFinePointer() {
  const [hasFinePointer, setHasFinePointer] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setHasFinePointer(query.matches);

    update();
    query.addEventListener("change", update);

    return () => query.removeEventListener("change", update);
  }, []);

  return hasFinePointer;
}
