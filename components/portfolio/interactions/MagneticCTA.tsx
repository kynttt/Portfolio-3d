"use client";

import { ReactNode, useRef } from "react";
import { useGSAP } from "@gsap/react";
import { registerGsap } from "@/lib/gsap/registerGsap";

type MagneticCTAProps = {
  href: string;
  className?: string;
  children: ReactNode;
  enabled?: boolean;
};

export function MagneticCTA({
  href,
  className,
  children,
  enabled = true,
}: MagneticCTAProps) {
  const rootRef = useRef<HTMLAnchorElement | null>(null);
  const contentRef = useRef<HTMLSpanElement | null>(null);
  const gsap = registerGsap();

  useGSAP(
    () => {
      const root = rootRef.current;
      const content = contentRef.current;

      if (!root || !content || !enabled) {
        return;
      }

      const xTo = gsap.quickTo(root, "x", { duration: 0.42, ease: "power3.out" });
      const yTo = gsap.quickTo(root, "y", { duration: 0.42, ease: "power3.out" });
      const scaleTo = gsap.quickTo(root, "scale", {
        duration: 0.42,
        ease: "power3.out",
      });
      const innerXTo = gsap.quickTo(content, "x", {
        duration: 0.38,
        ease: "power3.out",
      });
      const innerYTo = gsap.quickTo(content, "y", {
        duration: 0.38,
        ease: "power3.out",
      });

      const onPointerMove = (event: PointerEvent) => {
        const rect = root.getBoundingClientRect();
        const relX = event.clientX - rect.left - rect.width / 2;
        const relY = event.clientY - rect.top - rect.height / 2;
        const normalizedX = relX / (rect.width / 2);
        const normalizedY = relY / (rect.height / 2);

        xTo(Math.max(-14, Math.min(14, normalizedX * 12)));
        yTo(Math.max(-14, Math.min(14, normalizedY * 12)));
        innerXTo(Math.max(-20, Math.min(20, normalizedX * 18)));
        innerYTo(Math.max(-20, Math.min(20, normalizedY * 18)));
        scaleTo(1.055);
      };

      const reset = () => {
        xTo(0);
        yTo(0);
        innerXTo(0);
        innerYTo(0);
        scaleTo(1);
      };

      root.addEventListener("pointermove", onPointerMove, { passive: true });
      root.addEventListener("pointerleave", reset);
      root.addEventListener("blur", reset);

      return () => {
        root.removeEventListener("pointermove", onPointerMove);
        root.removeEventListener("pointerleave", reset);
        root.removeEventListener("blur", reset);
      };
    },
    { scope: rootRef, dependencies: [enabled] },
  );

  return (
    <a className={className} href={href} ref={rootRef}>
      <span className="magnetic-cta-content" ref={contentRef}>
        {children}
      </span>
    </a>
  );
}
