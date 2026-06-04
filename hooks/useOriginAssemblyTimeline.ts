"use client";

import { RefObject } from "react";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { registerGsap } from "@/lib/gsap/registerGsap";

type OriginTimelineOptions = {
  enabled?: boolean;
  reducedMotion?: boolean;
};

export function useOriginAssemblyTimeline(
  rootRef: RefObject<HTMLElement | null>,
  { enabled = true, reducedMotion = false }: OriginTimelineOptions = {},
) {
  const gsap = registerGsap();

  useGSAP(
    () => {
      const root = rootRef.current;

      const isMobile = typeof window !== "undefined" && window.matchMedia("(max-width: 820px)").matches;

      if (!root || !enabled || reducedMotion || isMobile) {
        if (root) {
          root.style.setProperty("--assembly-progress", "1");
          const progress = root.querySelector<HTMLElement>(".assembly-progress-value");
          if (progress) {
            progress.textContent = "100%";
          }
        }
        return;
      }

      const pin = root.querySelector<HTMLElement>(".origin-pin");
      const progressLabel = root.querySelector<HTMLElement>(".assembly-progress-value");

      if (!pin) {
        return;
      }

      gsap.set(root.querySelectorAll(".origin-marker"), { autoAlpha: 0, y: 18 });
      gsap.set(root.querySelectorAll(".origin-cad-line"), {
        strokeDasharray: 1,
        strokeDashoffset: 1,
        autoAlpha: 0.35,
      });
      gsap.set(root.querySelectorAll(".origin-part"), {
        transformOrigin: "50% 50%",
        autoAlpha: 0.28,
      });
      gsap.set(root.querySelectorAll('[data-part="main-shaft"]'), { x: -84 });
      gsap.set(root.querySelectorAll('[data-part="secondary-shaft"]'), { x: 72, y: -34 });
      gsap.set(root.querySelectorAll('[data-part="mechanical-linkage"]'), { x: -42, y: 52 });
      gsap.set(root.querySelectorAll(".digital-node, .data-route"), { autoAlpha: 0 });
      gsap.set(root.querySelectorAll(".origin-final-statement"), { autoAlpha: 0, y: 24 });

      const timeline = gsap.timeline({
        defaults: { ease: "power2.out" },
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: () => (window.innerWidth >= 1180 ? "+=380%" : "+=290%"),
          pin,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            root.style.setProperty("--assembly-progress", self.progress.toFixed(3));
            if (progressLabel) {
              progressLabel.textContent = `${Math.round(self.progress * 100)
                .toString()
                .padStart(2, "0")}%`;
            }
          },
        },
      });

      const [markerOne, markerTwo, markerThree] = gsap.utils.toArray<HTMLElement>(
        root.querySelectorAll(".origin-marker"),
      );

      timeline
        .addLabel("origin-enter", 0)
        .fromTo(
          root.querySelectorAll(".origin-eyebrow, .origin-heading, .origin-body, .origin-instruction"),
          { autoAlpha: 0, y: 24 },
          { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.07 },
          "origin-enter",
        )
        .to(root.querySelectorAll(".origin-part"), { autoAlpha: 1, duration: 0.5 }, 0.15)
        .to(root.querySelectorAll(".origin-cad-line"), { strokeDashoffset: 0, duration: 0.8 }, 0.18)
        .addLabel("assembly-start", 1)
        .to('[data-part="central-gear"]', { rotation: 220, duration: 2.3 }, "assembly-start")
        .to('[data-part="secondary-gear-a"]', { rotation: -360, duration: 2.3 }, "assembly-start")
        .to('[data-part="secondary-gear-b"]', { rotation: -280, duration: 2.3 }, "assembly-start")
        .to('[data-part="outer-bearing"]', { rotation: 90, duration: 2.3 }, "assembly-start")
        .to('[data-part="main-shaft"]', { x: 0, autoAlpha: 1, duration: 0.9 }, "assembly-start+=0.1")
        .to('[data-part="inner-bearing"]', { scale: 1.02, autoAlpha: 1, duration: 0.7 }, "assembly-start+=0.2")
        .to(markerOne, { autoAlpha: 1, y: 0, duration: 0.55 }, "assembly-start+=0.25")
        .addLabel("marker-02", 2.25)
        .to(markerOne, { autoAlpha: 0, y: -12, duration: 0.35 }, "marker-02")
        .to('[data-part="secondary-shaft"]', { x: 0, y: 0, autoAlpha: 1, duration: 0.9 }, "marker-02")
        .to('[data-part="mechanical-linkage"]', { x: 0, y: 0, autoAlpha: 1, duration: 0.85 }, "marker-02+=0.1")
        .to(root.querySelectorAll(".torque-arrow"), { autoAlpha: 1, scale: 1, duration: 0.55 }, "marker-02+=0.18")
        .to(markerTwo, { autoAlpha: 1, y: 0, duration: 0.55 }, "marker-02+=0.3")
        .addLabel("marker-03", 3.55)
        .to(markerTwo, { autoAlpha: 0, y: -12, duration: 0.35 }, "marker-03")
        .to(root.querySelectorAll(".alignment-ring"), { autoAlpha: 1, scale: 1, duration: 0.65 }, "marker-03")
        .to(root.querySelectorAll(".origin-annotation"), { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.05 }, "marker-03+=0.1")
        .to(markerThree, { autoAlpha: 1, y: 0, duration: 0.55 }, "marker-03+=0.25")
        .addLabel("digital-transform", 4.85)
        .to(root.querySelectorAll(".mechanical-assembly-layer"), { autoAlpha: 0.58, duration: 0.75 }, "digital-transform")
        .to(root.querySelectorAll(".digital-node, .data-route"), { autoAlpha: 1, duration: 0.8, stagger: 0.04 }, "digital-transform+=0.1")
        .to(root.querySelectorAll(".data-route"), { strokeDashoffset: 0, duration: 0.9 }, "digital-transform+=0.15")
        .to(root.querySelectorAll(".digital-node"), { scale: 1.08, duration: 0.55, stagger: 0.04 }, "digital-transform+=0.3")
        .addLabel("origin-exit", 6.1)
        .to(root.querySelectorAll(".origin-final-statement"), { autoAlpha: 1, y: 0, duration: 0.8 }, "origin-exit")
        .to(root.querySelectorAll(".origin-instruction"), { autoAlpha: 0, y: -10, duration: 0.45 }, "origin-exit");

      return () => {
        timeline.scrollTrigger?.kill();
        timeline.kill();
      };
    },
    { scope: rootRef, dependencies: [enabled, reducedMotion], revertOnUpdate: true },
  );
}
