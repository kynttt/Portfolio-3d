"use client";

import { RefObject } from "react";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { registerGsap } from "@/lib/gsap/registerGsap";

type ManifestoTimelineOptions = {
  enabled?: boolean;
  reducedMotion?: boolean;
};

export function useManifestoTimeline(
  rootRef: RefObject<HTMLElement | null>,
  { enabled = true, reducedMotion = false }: ManifestoTimelineOptions = {},
) {
  const gsap = registerGsap();

  useGSAP(
    () => {
      const root = rootRef.current;

      if (!root) {
        return;
      }

      const isMobile = window.matchMedia("(max-width: 820px)").matches;
      const originStage = document.querySelector<HTMLElement>(".origin-exit-stage");
      const originCenterPiece = document.querySelector<HTMLElement>(".origin-exit-slab");
      const syncOriginFieldToViewport = () => {
        if (!originStage) {
          return;
        }

        const currentY = Number(gsap.getProperty(originStage, "y")) || 0;
        const stageTop = originStage.getBoundingClientRect().top;
        gsap.set(originStage, { y: currentY - stageTop });
      };
      const revealOriginField = () => {
        if (originStage) {
          gsap.set(originStage, { autoAlpha: 1 });
        }
        syncOriginFieldToViewport();
      };
      if (!enabled || reducedMotion || isMobile) {
        gsap.set(root.querySelectorAll(".manifesto-animated"), {
          autoAlpha: 1,
          clearProps: "transform",
        });
        gsap.set(root.querySelectorAll(".manifesto-line"), { strokeDashoffset: 0 });
        root.style.setProperty("--mobile-reveal-progress", reducedMotion ? "1" : "0.55");

        if (!reducedMotion) {
          gsap.to(root, {
            "--mobile-reveal-progress": 1,
            ease: "none",
            scrollTrigger: {
              trigger: root,
              start: "top 80%",
              end: "bottom 35%",
              scrub: 0.8,
            },
          });
        }
        return;
      }

      const lines = gsap.utils.toArray<SVGPathElement>(root.querySelectorAll(".manifesto-line"));
      lines.forEach((line) => {
        const length = line.getTotalLength();
        gsap.set(line, {
          strokeDasharray: length,
          strokeDashoffset: length,
        });
      });

      gsap.set(root.querySelectorAll(".manifesto-bridge-node, .manifesto-bridge-data-line"), {
        autoAlpha: 0,
        scale: 0.86,
        transformOrigin: "center",
      });
      gsap.set(root.querySelectorAll(".manifesto-surface"), { autoAlpha: 0, y: 36 });
      gsap.set(root, {
        "--manifesto-handoff": 1,
        "--manifesto-topo-drift": "0px",
      });
      gsap.set(root.querySelectorAll(".manifesto-copy-line-text"), {
        autoAlpha: 0,
        filter: "blur(10px)",
        skewX: -8,
        yPercent: 112,
      });
      gsap.set(root.querySelectorAll(".manifesto-copy-support, .manifesto-closing, .manifesto-instruction"), {
        autoAlpha: 0,
        filter: "blur(8px)",
        y: 20,
      });
      gsap.set(root.querySelectorAll(".manifesto-next"), { autoAlpha: 0, y: 18 });
      gsap.set(root.querySelectorAll("[data-layer='field'], [data-layer='software']"), { autoAlpha: 0.22 });

      const timeline = gsap.timeline({
        defaults: { ease: "power2.out" },
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: () => (window.innerWidth >= 1180 ? "+=220%" : "+=170%"),
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onEnter: revealOriginField,
          onEnterBack: revealOriginField,
          onRefresh: syncOriginFieldToViewport,
          onUpdate: syncOriginFieldToViewport,
          onLeaveBack: () => {
            if (originStage) {
              gsap.set(originStage, { y: 0 });
            }
          },
        },
      });

      timeline
        .addLabel("origin-bridge", 0)
        .to(
          originCenterPiece ? [originCenterPiece] : [],
          { autoAlpha: 0, y: -380, scale: 0.28, duration: 0.72, ease: "power3.inOut" },
          0,
        )
        .fromTo(
          root,
          {
            "--manifesto-handoff": 1,
            "--manifesto-topo-drift": "0px",
          },
          {
            "--manifesto-handoff": 0.34,
            "--manifesto-topo-drift": "-26px",
            duration: 1.24,
            ease: "none",
          },
          0,
        )
        .to(root.querySelectorAll(".manifesto-surface"), { autoAlpha: 1, y: 0, duration: 0.82, ease: "power3.out" }, 0)
        .to(root.querySelectorAll(".manifesto-bridge-gear"), { autoAlpha: 0.2, scale: 0.94, duration: 0.72 }, 0)
        .to(root.querySelectorAll(".manifesto-bridge-teeth"), { autoAlpha: 0, duration: 0.52 }, 0.12)
        .to(root.querySelectorAll(".manifesto-bridge-node"), { autoAlpha: 1, scale: 1, duration: 0.68 }, 0.12)
        .to(root.querySelectorAll(".manifesto-bridge-data-line"), { autoAlpha: 1, scaleX: 1, duration: 0.76 }, 0.2)
        .to(root.querySelectorAll(".manifesto-grid-plane"), { autoAlpha: 0.72, duration: 0.45 }, 0.52)
        .addLabel("typography-entrance", 0.95)
        .from(root.querySelectorAll(".manifesto-eyebrow, .manifesto-meta"), {
          autoAlpha: 0,
          y: 12,
          duration: 0.34,
          stagger: 0.06,
        }, "typography-entrance")
        .to(root.querySelectorAll(".manifesto-copy-line-text"), {
          yPercent: 0,
          autoAlpha: 1,
          duration: 0.82,
          ease: "power4.out",
          filter: "blur(0px)",
          skewX: 0,
          stagger: { each: 0.13, from: "start" },
        }, "typography-entrance+=0.12")
        .to(root.querySelectorAll(".manifesto-copy-support"), { autoAlpha: 1, filter: "blur(0px)", y: 0, duration: 0.56 }, 2.05)
        .to(root.querySelectorAll(".manifesto-closing"), { autoAlpha: 1, filter: "blur(0px)", y: 0, duration: 0.5 }, 2.28)
        .to(root.querySelectorAll(".manifesto-instruction"), { autoAlpha: 1, filter: "blur(0px)", y: 0, duration: 0.4 }, 2.5)
        .addLabel("interactive-hold", 2.7)
        .to(lines, { strokeDashoffset: 0, duration: 0.84, stagger: 0.018, ease: "none" }, 2.78)
        .to(root.querySelectorAll("[data-layer='field']"), { autoAlpha: 0.48, duration: 0.55 }, 3.0)
        .to(root.querySelectorAll("[data-layer='software']"), { autoAlpha: 0.56, duration: 0.55 }, 3.12)
        .to({}, { duration: 1.72 })
        .addLabel("network-resolution", 4.75)
        .to(root.querySelectorAll("[data-layer='mechanical']"), { autoAlpha: 0.16, duration: 0.54 }, "network-resolution")
        .to(root.querySelectorAll("[data-layer='field']"), { autoAlpha: 0.28, duration: 0.54 }, "network-resolution")
        .to(root.querySelectorAll("[data-layer='software']"), { autoAlpha: 0.82, duration: 0.62 }, "network-resolution")
        .to(root.querySelectorAll(".manifesto-network-resolve"), { autoAlpha: 1, duration: 0.52 }, "network-resolution+=0.1")
        .to(root.querySelectorAll(".manifesto-next"), { autoAlpha: 1, y: 0, duration: 0.45 }, "network-resolution+=0.22")
        .addLabel("manifesto-exit", 5.8);

      return () => {
        ScrollTrigger.getAll()
          .filter((trigger) => trigger.trigger === root)
          .forEach((trigger) => trigger.kill());
        timeline.kill();
      };
    },
    { scope: rootRef, dependencies: [enabled, reducedMotion], revertOnUpdate: true },
  );
}
