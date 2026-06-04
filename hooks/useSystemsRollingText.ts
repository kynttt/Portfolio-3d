"use client";

import { RefObject } from "react";
import { useGSAP } from "@gsap/react";
import { registerGsap } from "@/lib/gsap/registerGsap";

type SystemsRollingTextOptions = {
  enabled?: boolean;
  reducedMotion?: boolean;
};

export function useSystemsRollingText(
  rootRef: RefObject<HTMLElement | null>,
  { enabled = true, reducedMotion = false }: SystemsRollingTextOptions = {},
) {
  const gsap = registerGsap();

  useGSAP(
    () => {
      const root = rootRef.current;
      const transition = document.querySelector<HTMLElement>(".mechanical-loop-transition");

      if (!root || !transition || !enabled || reducedMotion) {
        return;
      }

      const chars = gsap.utils.toArray<HTMLElement>(
        root.querySelectorAll(".systems-roll-char"),
      );

      if (chars.length === 0) {
        return;
      }

      const depth = -Math.max(54, root.getBoundingClientRect().height * 0.42);
      const transformOrigin = `50% 50% ${depth}px`;

      gsap.set(root, {
        perspective: 900,
        transformStyle: "preserve-3d",
      });
      gsap.set(chars, {
        rotationX: 0,
        transformOrigin,
        transformStyle: "preserve-3d",
        backfaceVisibility: "hidden",
        force3D: true,
        willChange: "transform",
      });

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: transition,
          start: "top bottom",
          end: "top 18%",
          scrub: 0.9,
          invalidateOnRefresh: true,
        },
      });

      timeline
        .to(
          chars,
          {
            rotationX: 360,
            yPercent: -8,
            stagger: 0.065,
            ease: "none",
          },
          0,
        )
        .to(root, { autoAlpha: 0.08, ease: "none" }, 0.18);

      return () => {
        timeline.scrollTrigger?.kill();
        timeline.kill();
      };
    },
    { scope: rootRef, dependencies: [enabled, reducedMotion], revertOnUpdate: true },
  );
}
