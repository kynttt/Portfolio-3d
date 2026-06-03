"use client";

import { RefObject } from "react";
import { useGSAP } from "@gsap/react";
import { registerGsap } from "@/lib/gsap/registerGsap";

type ParallaxOptions = {
  enabled?: boolean;
};

type ParallaxTarget = HTMLElement & {
  dataset: {
    depthX?: string;
    depthY?: string;
    rotateX?: string;
    rotateY?: string;
  };
};

export function useHeroPointerParallax(
  rootRef: RefObject<HTMLElement | null>,
  { enabled = true }: ParallaxOptions = {},
) {
  const gsap = registerGsap();

  useGSAP(
    () => {
      const root = rootRef.current;

      if (!root || !enabled) {
        return;
      }

      const targets = Array.from(
        root.querySelectorAll<ParallaxTarget>("[data-depth-x], [data-depth-y]"),
      ).map((element) => {
        const depthX = Number(element.dataset.depthX ?? 0);
        const depthY = Number(element.dataset.depthY ?? 0);
        const rotateX = Number(element.dataset.rotateX ?? 0);
        const rotateY = Number(element.dataset.rotateY ?? 0);

        gsap.set(element, {
          transformPerspective: 900,
          force3D: true,
          willChange: "transform",
        });

        return {
          element,
          depthX,
          depthY,
          rotateX,
          rotateY,
          xTo: gsap.quickTo(element, "x", { duration: 0.65, ease: "power3.out" }),
          yTo: gsap.quickTo(element, "y", { duration: 0.65, ease: "power3.out" }),
          rotationXTo: gsap.quickTo(element, "rotationX", {
            duration: 0.75,
            ease: "power3.out",
          }),
          rotationYTo: gsap.quickTo(element, "rotationY", {
            duration: 0.75,
            ease: "power3.out",
          }),
        };
      });

      const onPointerMove = (event: PointerEvent) => {
        const rect = root.getBoundingClientRect();
        const normalizedX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        const normalizedY = ((event.clientY - rect.top) / rect.height) * 2 - 1;

        for (const target of targets) {
          target.xTo(normalizedX * target.depthX);
          target.yTo(normalizedY * target.depthY);
          target.rotationXTo(normalizedY * -target.rotateX);
          target.rotationYTo(normalizedX * target.rotateY);
        }
      };

      const reset = () => {
        for (const target of targets) {
          gsap.to(target.element, {
            x: 0,
            y: 0,
            rotationX: 0,
            rotationY: 0,
            duration: 0.95,
            ease: "power3.out",
            overwrite: true,
          });
        }
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
