"use client";

import { RefObject } from "react";
import { useGSAP } from "@gsap/react";
import { registerGsap } from "@/lib/gsap/registerGsap";
import { usePointerVelocity } from "@/hooks/usePointerVelocity";

type SystemsRevealOptions = {
  enabled?: boolean;
  reducedMotion?: boolean;
};

export function useSystemsReveal(
  rootRef: RefObject<HTMLElement | null>,
  { enabled = true, reducedMotion = false }: SystemsRevealOptions = {},
) {
  const gsap = registerGsap();
  const { measureVelocity, resetVelocity } = usePointerVelocity();

  useGSAP(
    () => {
      const root = rootRef.current;

      if (!root || !enabled || reducedMotion) {
        if (root) {
          gsap.set(root, {
            "--reveal-opacity": 0,
            "--reveal-size": 190,
            "--reveal-intensity": 0.68,
          });
        }
        return;
      }

      const revealXTo = gsap.quickTo(root, "--reveal-x", {
        duration: 0.28,
        ease: "power3.out",
      });
      const revealYTo = gsap.quickTo(root, "--reveal-y", {
        duration: 0.28,
        ease: "power3.out",
      });
      const revealSizeTo = gsap.quickTo(root, "--reveal-size", {
        duration: 0.46,
        ease: "power3.out",
      });
      const revealOpacityTo = gsap.quickTo(root, "--reveal-opacity", {
        duration: 0.36,
        ease: "power2.out",
      });
      const revealIntensityTo = gsap.quickTo(root, "--reveal-intensity", {
        duration: 0.34,
        ease: "power2.out",
      });

      const gridXTo = gsap.quickTo(root, "--grid-x", { duration: 0.62, ease: "power3.out" });
      const gridYTo = gsap.quickTo(root, "--grid-y", { duration: 0.62, ease: "power3.out" });
      const mechXTo = gsap.quickTo(root, "--mechanical-x", { duration: 0.52, ease: "power3.out" });
      const mechYTo = gsap.quickTo(root, "--mechanical-y", { duration: 0.52, ease: "power3.out" });
      const fieldXTo = gsap.quickTo(root, "--field-x", { duration: 0.58, ease: "power3.out" });
      const fieldYTo = gsap.quickTo(root, "--field-y", { duration: 0.58, ease: "power3.out" });
      const softwareXTo = gsap.quickTo(root, "--software-x", { duration: 0.66, ease: "power3.out" });
      const softwareYTo = gsap.quickTo(root, "--software-y", { duration: 0.66, ease: "power3.out" });

      const updatePosition = (event: PointerEvent) => {
        const rect = root.getBoundingClientRect();
        const localX = event.clientX - rect.left;
        const localY = event.clientY - rect.top;
        const normalizedX = (localX / rect.width - 0.5) * 2;
        const normalizedY = (localY / rect.height - 0.5) * 2;
        const velocity = measureVelocity(localX, localY);

        revealXTo(localX);
        revealYTo(localY);
        revealSizeTo(205 + velocity * 74);
        revealIntensityTo(0.68 + velocity * 0.24);
        gridXTo(normalizedX * 4);
        gridYTo(normalizedY * 4);
        mechXTo(normalizedX * 7);
        mechYTo(normalizedY * 6);
        fieldXTo(normalizedX * 10);
        fieldYTo(normalizedY * 8);
        softwareXTo(normalizedX * 14);
        softwareYTo(normalizedY * 11);
      };

      const onPointerEnter = (event: PointerEvent) => {
        updatePosition(event);
        revealOpacityTo(0.9);
      };

      const onPointerMove = (event: PointerEvent) => {
        updatePosition(event);
      };

      const onPointerLeave = () => {
        resetVelocity();
        revealSizeTo(184);
        revealOpacityTo(0);
        revealIntensityTo(0.68);
        gridXTo(0);
        gridYTo(0);
        mechXTo(0);
        mechYTo(0);
        fieldXTo(0);
        fieldYTo(0);
        softwareXTo(0);
        softwareYTo(0);
      };

      root.addEventListener("pointerenter", onPointerEnter, { passive: true });
      root.addEventListener("pointermove", onPointerMove, { passive: true });
      root.addEventListener("pointerleave", onPointerLeave);

      return () => {
        root.removeEventListener("pointerenter", onPointerEnter);
        root.removeEventListener("pointermove", onPointerMove);
        root.removeEventListener("pointerleave", onPointerLeave);
      };
    },
    { scope: rootRef, dependencies: [enabled, reducedMotion], revertOnUpdate: true },
  );
}
