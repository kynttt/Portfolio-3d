"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { registerGsap } from "@/lib/gsap/registerGsap";

type CharacterSkeletonRevealProps = {
  enabled?: boolean;
};

export function CharacterSkeletonReveal({
  enabled = true,
}: CharacterSkeletonRevealProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const gsap = registerGsap();

  useGSAP(
    () => {
      const root = rootRef.current;

      if (!root || !enabled) {
        if (root) {
          gsap.set(root, {
            "--character-reveal-opacity": 0,
            clearProps: "transform,transformPerspective,willChange",
          });
        }
        return;
      }

      const xTo = gsap.quickTo(root, "--character-reveal-x", {
        duration: 0.34,
        ease: "power3.out",
      });
      const yTo = gsap.quickTo(root, "--character-reveal-y", {
        duration: 0.34,
        ease: "power3.out",
      });
      const sizeTo = gsap.quickTo(root, "--character-reveal-size", {
        duration: 0.48,
        ease: "power3.out",
      });
      const opacityTo = gsap.quickTo(root, "--character-reveal-opacity", {
        duration: 0.42,
        ease: "power2.out",
      });

      const updatePosition = (event: PointerEvent) => {
        const rect = root.getBoundingClientRect();
        const localX = event.clientX - rect.left;
        const localY = event.clientY - rect.top;

        xTo(localX);
        yTo(localY);
      };

      const onPointerEnter = (event: PointerEvent) => {
        updatePosition(event);
        sizeTo(154);
        opacityTo(1);
      };

      const onPointerMove = (event: PointerEvent) => {
        updatePosition(event);
      };

      const onPointerLeave = () => {
        sizeTo(112);
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
    <div className="character-reveal" ref={rootRef}>
      <Image
        className="portrait-image"
        src="/assets/hero-cutout.png"
        alt="Aldren Kent Cirunay hero portrait"
        width={1122}
        height={1402}
        priority
      />
      <div className="character-reveal-occluder" aria-hidden="true" />
      <Image
        className="character-skeleton-image"
        src="/assets/hero-skeleton-cutout.png"
        alt=""
        width={1122}
        height={1402}
        aria-hidden="true"
      />
      <div className="character-reveal-reticle" aria-hidden="true" />
    </div>
  );
}
