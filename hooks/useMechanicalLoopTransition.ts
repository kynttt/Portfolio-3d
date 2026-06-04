"use client";

import { RefObject } from "react";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { registerGsap } from "@/lib/gsap/registerGsap";

type MechanicalLoopOptions = {
  enabled?: boolean;
  reducedMotion?: boolean;
};

export function useMechanicalLoopTransition(
  rootRef: RefObject<HTMLElement | null>,
  { enabled = true, reducedMotion = false }: MechanicalLoopOptions = {},
) {
  const gsap = registerGsap();

  useGSAP(
    () => {
      const root = rootRef.current;

      const isMobile = typeof window !== "undefined" && window.matchMedia("(max-width: 820px)").matches;

      if (!root || !enabled || reducedMotion || isMobile) {
        return;
      }

      const panels = gsap.utils.toArray<HTMLElement>(
        root.querySelectorAll(".mechanical-loop-panel"),
      );
      const pin = root.querySelector<HTMLElement>(".mechanical-loop-pin");
      const progressLabel = root.querySelector<HTMLElement>(".loop-progress-value");
      const titleBlock = root.querySelector<HTMLElement>(".loop-title-block");
      const hero = document.querySelector<HTMLElement>(".hero-frame");

      if (!pin || panels.length === 0) {
        return;
      }

      const panelCount = panels.length;
      const wrapPanel = gsap.utils.wrap(-1, panelCount - 1);

      const renderPanels = (offset: number) => {
        for (let index = 0; index < panelCount; index += 1) {
          const panel = panels[index];
          const wrappedPosition = wrapPanel(index - offset);
          const centerDistance = Math.abs(wrappedPosition);
          const isPrimary = centerDistance < 0.48;
          const diagram = panel.querySelector<HTMLElement>(".loop-panel-diagram");
          const textLayers = panel.querySelectorAll<HTMLElement>(
            ".loop-panel-copy, .loop-panel-labels, .loop-panel-index",
          );

          gsap.set(panel, {
            yPercent: wrappedPosition * 100,
            autoAlpha: centerDistance < 1.1 ? 1 : 0,
            scale: isPrimary ? 1 : 0.92,
            zIndex: isPrimary ? 4 : 1,
          });
          gsap.set(diagram, { autoAlpha: centerDistance < 1 ? 1 : 0.28 });
          gsap.set(textLayers, { autoAlpha: isPrimary ? 1 : 0 });
        }
      };

      renderPanels(0);

      const heroExit = hero
        ? gsap
            .timeline({
              scrollTrigger: {
                trigger: root,
                start: "top bottom",
                end: "top top",
                scrub: 0.8,
              },
            })
            .to(hero, { scale: 0.985, autoAlpha: 0.82, transformOrigin: "50% 100%" }, 0)
            .to(
              hero.querySelectorAll(".hero-copy p:last-child, .detail-orbit-wrap"),
              { y: -34, autoAlpha: 0.22 },
              0,
            )
            .to(hero.querySelectorAll(".portrait-placeholder"), { y: -44 }, 0)
        : null;

      const proxy = { offset: 0 };

      const loopTrigger = ScrollTrigger.create({
        trigger: root,
        start: "top top",
        end: () => (window.innerWidth >= 1180 ? "+=240%" : "+=180%"),
        pin,
        scrub: 1,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const progress = self.progress;
          const cruisingOffset = 6.2;
          const finalOffset = 7;
          const offset =
            progress < 0.82
              ? gsap.utils.mapRange(0, 0.82, 0, cruisingOffset, progress)
              : gsap.utils.interpolate(
                  cruisingOffset,
                  finalOffset,
                  gsap.parseEase("power3.out")(gsap.utils.mapRange(0.82, 1, 0, 1, progress)),
                );

          proxy.offset = offset;
          renderPanels(proxy.offset);
          root.style.setProperty("--loop-progress", progress.toFixed(3));
          if (titleBlock) {
            gsap.set(titleBlock, {
              autoAlpha:
                progress < 0.16
                  ? 1 - gsap.utils.mapRange(0, 0.16, 0, 1, progress)
                  : 0,
            });
          }
          if (progressLabel) {
            progressLabel.textContent = `${Math.round(progress * 100)
              .toString()
              .padStart(2, "0")}%`;
          }
        },
      });

      return () => {
        heroExit?.kill();
        loopTrigger.kill();
      };
    },
    { scope: rootRef, dependencies: [enabled, reducedMotion], revertOnUpdate: true },
  );
}
