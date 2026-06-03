"use client";

import { RefObject, useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { registerGsap } from "@/lib/gsap/registerGsap";

type MechanicalInspectionLensProps = {
  rootRef: RefObject<HTMLElement | null>;
  enabled?: boolean;
};

export function MechanicalInspectionLens({
  rootRef,
  enabled = true,
}: MechanicalInspectionLensProps) {
  const lensRef = useRef<HTMLDivElement | null>(null);
  const gsap = registerGsap();

  useGSAP(
    () => {
      const root = rootRef.current;
      const lens = lensRef.current;

      if (!root || !lens || !enabled) {
        if (lens) {
          gsap.set(lens, { "--lens-opacity": 0 });
        }
        return;
      }

      const xTo = gsap.quickTo(lens, "--lens-x", {
        duration: 0.42,
        ease: "power3.out",
      });
      const yTo = gsap.quickTo(lens, "--lens-y", {
        duration: 0.42,
        ease: "power3.out",
      });
      const sizeTo = gsap.quickTo(lens, "--lens-size", {
        duration: 0.52,
        ease: "power3.out",
      });
      const opacityTo = gsap.quickTo(lens, "--lens-opacity", {
        duration: 0.48,
        ease: "power2.out",
      });

      const onPointerEnter = (event: PointerEvent) => {
        const rect = root.getBoundingClientRect();
        xTo(event.clientX - rect.left);
        yTo(event.clientY - rect.top);
        sizeTo(220);
        opacityTo(1);
      };

      const onPointerMove = (event: PointerEvent) => {
        const rect = root.getBoundingClientRect();
        xTo(event.clientX - rect.left);
        yTo(event.clientY - rect.top);
      };

      const onPointerLeave = () => {
        sizeTo(150);
        opacityTo(0);
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
    { scope: rootRef, dependencies: [enabled] },
  );

  return (
    <div className="inspection-lens" ref={lensRef} aria-hidden="true">
      <div className="lens-reticle" />
      <div className="lens-grid" />
      <Image
        className="lens-portrait"
        src="/assets/hero-cutout.png"
        alt=""
        width={1122}
        height={1402}
      />
      <div className="lens-diagram lens-diagram-a" />
      <div className="lens-diagram lens-diagram-b" />
      <span className="lens-label label-a">SYS / 01</span>
      <span className="lens-label label-b">TORQUE AXIS</span>
      <span className="lens-label label-c">NODE / A-06</span>
      <span className="lens-label label-d">FIELD READY</span>
      <span className="lens-label label-e">DATA LINK</span>
    </div>
  );
}
