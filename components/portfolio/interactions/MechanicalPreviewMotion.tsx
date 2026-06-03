"use client";

import { RefObject } from "react";
import { useGSAP } from "@gsap/react";
import { registerGsap } from "@/lib/gsap/registerGsap";

type MechanicalPreviewMotionProps = {
  rootRef: RefObject<HTMLElement | null>;
  enabled?: boolean;
};

export function useMechanicalPreviewMotion({
  rootRef,
  enabled = true,
}: MechanicalPreviewMotionProps) {
  const gsap = registerGsap();

  useGSAP(
    () => {
      const root = rootRef.current;
      const image = root?.querySelector<HTMLElement>(".technical-object");

      if (!root || !image || !enabled) {
        return;
      }

      const xTo = gsap.quickTo(image, "x", { duration: 0.5, ease: "power3.out" });
      const yTo = gsap.quickTo(image, "y", { duration: 0.5, ease: "power3.out" });
      const scaleTo = gsap.quickTo(image, "scale", {
        duration: 0.5,
        ease: "power3.out",
      });

      const onPointerMove = (event: PointerEvent) => {
        const rect = root.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        const y = ((event.clientY - rect.top) / rect.height) * 2 - 1;

        xTo(x * 10);
        yTo(y * 8);
        scaleTo(1.025);
      };

      const reset = () => {
        xTo(0);
        yTo(0);
        scaleTo(1);
      };

      root.addEventListener("pointermove", onPointerMove, { passive: true });
      root.addEventListener("pointerleave", reset);

      return () => {
        root.removeEventListener("pointermove", onPointerMove);
        root.removeEventListener("pointerleave", reset);
      };
    },
    { scope: rootRef, dependencies: [enabled] },
  );
}
