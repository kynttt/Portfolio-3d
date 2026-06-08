"use client";

import { RefObject } from "react";
import { useGSAP } from "@gsap/react";
import { registerGsap } from "@/lib/gsap/registerGsap";

const CLOCK_FRAME_COUNT = 96;
const CLOCK_FRAME_SIZE = 960;
const ORIGIN_END_SCENE_TIME = 6.65;
const END_SCENE_BASE_ROTATION_X = 58;
const END_SCENE_BASE_ROTATION_Z = -9;
const END_SCENE_GRID_SCALE = 0.54;
const END_SCENE_TOPO_SCALE = 0.92;

type OriginTimelineOptions = {
  enabled?: boolean;
  reducedMotion?: boolean;
};

function clockFramePath(index: number) {
  return `/assets/mech-clock/ezgif-frame-${String(index + 1).padStart(3, "0")}.png`;
}

function removeWhiteBackground(image: HTMLImageElement) {
  const processed = document.createElement("canvas");
  processed.width = CLOCK_FRAME_SIZE;
  processed.height = CLOCK_FRAME_SIZE;

  const context = processed.getContext("2d", { willReadFrequently: true });
  if (!context) {
    return image;
  }

  context.drawImage(image, 0, 0, CLOCK_FRAME_SIZE, CLOCK_FRAME_SIZE);

  const frame = context.getImageData(0, 0, CLOCK_FRAME_SIZE, CLOCK_FRAME_SIZE);
  const pixels = frame.data;

  for (let index = 0; index < pixels.length; index += 4) {
    const red = pixels[index];
    const green = pixels[index + 1];
    const blue = pixels[index + 2];
    const brightest = Math.max(red, green, blue);
    const darkest = Math.min(red, green, blue);

    if (darkest > 228 && brightest - darkest < 26) {
      pixels[index + 3] = 0;
    } else if (darkest > 214 && brightest - darkest < 22) {
      pixels[index + 3] = Math.round(pixels[index + 3] * ((228 - darkest) / 14));
    }
  }

  context.putImageData(frame, 0, 0);

  return processed;
}

function drawClockFrame(
  canvas: HTMLCanvasElement,
  image: CanvasImageSource,
  frameIndex: number,
) {
  const context = canvas.getContext("2d");
  if (!context) {
    return;
  }

  const pixelRatio = window.devicePixelRatio || 1;
  const displayWidth = canvas.clientWidth || CLOCK_FRAME_SIZE;
  const displayHeight = canvas.clientHeight || CLOCK_FRAME_SIZE;
  const canvasWidth = Math.round(displayWidth * pixelRatio);
  const canvasHeight = Math.round(displayHeight * pixelRatio);

  if (canvas.width !== canvasWidth || canvas.height !== canvasHeight) {
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
  }

  context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  context.clearRect(0, 0, displayWidth, displayHeight);
  context.drawImage(image, 0, 0, displayWidth, displayHeight);
  canvas.dataset.frame = String(frameIndex);
}

export function useOriginAssemblyTimeline(
  rootRef: RefObject<HTMLElement | null>,
  { enabled = true, reducedMotion = false }: OriginTimelineOptions = {},
) {
  const gsap = registerGsap();

  useGSAP(
    () => {
      const root = rootRef.current;

      const isMobile = typeof window !== "undefined" && window.matchMedia("(max-width: 820px)").matches;

      if (!root) {
        return;
      }

      const pin = root.querySelector<HTMLElement>(".origin-pin");
      const progressLabel = root.querySelector<HTMLElement>(".assembly-progress-value");
      const clockCanvas = root.querySelector<HTMLCanvasElement>(".origin-clock-sequence");
      const originGrid = root.querySelector<HTMLElement>(".origin-grid");
      const topoField = root.querySelector<HTMLElement>(".origin-topo-field");
      const hero = document.querySelector<HTMLElement>(".hero-frame");

      if (!pin || !originGrid || !topoField) {
        return;
      }

      const clockImages = Array.from({ length: CLOCK_FRAME_COUNT }, (_, index) => {
        const image = new window.Image();
        image.src = clockFramePath(index);
        return image;
      });
      const processedClockFrames: Array<CanvasImageSource | null> = Array.from(
        { length: CLOCK_FRAME_COUNT },
        () => null,
      );

      const renderClockFrame = (progress: number) => {
        if (!clockCanvas) {
          return;
        }

        const frameIndex = Math.min(
          CLOCK_FRAME_COUNT - 1,
          Math.max(0, Math.round(progress * (CLOCK_FRAME_COUNT - 1))),
        );
        const image = clockImages[frameIndex];

        if (image.complete) {
          processedClockFrames[frameIndex] ??= removeWhiteBackground(image);
          drawClockFrame(clockCanvas, processedClockFrames[frameIndex], frameIndex);
          clockCanvas.classList.add("is-ready");
        } else {
          image.onload = () => {
            processedClockFrames[frameIndex] ??= removeWhiteBackground(image);
            drawClockFrame(clockCanvas, processedClockFrames[frameIndex], frameIndex);
            clockCanvas.classList.add("is-ready");
          };
        }
      };

      renderClockFrame(reducedMotion || isMobile ? 1 : 0);

      if (!enabled || reducedMotion || isMobile) {
        root.style.setProperty("--assembly-progress", "1");
        if (progressLabel) {
          progressLabel.textContent = "100%";
        }
        return;
      }

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

      gsap.set(root.querySelectorAll(".origin-marker"), { autoAlpha: 0, y: 18 });
      gsap.set(root.querySelectorAll(".origin-clock-sequence"), { autoAlpha: 0.3, scale: 0.96 });
      gsap.set(root.querySelectorAll(".origin-clock-reticle"), { autoAlpha: 0.35, scale: 0.9 });
      gsap.set(root.querySelectorAll(".origin-annotation"), { autoAlpha: 0, y: 14 });
      gsap.set(root.querySelectorAll(".origin-final-statement"), {
        "--final-rule-scale": 0,
        "--final-veil-alpha": 0,
        "--final-veil-scale": 0.36,
        autoAlpha: 0,
        y: 24,
      });
      gsap.set(root.querySelectorAll(".origin-final-word"), {
        autoAlpha: 0,
        skewX: -8,
        x: -28,
        y: 18,
      });
      gsap.set(root.querySelectorAll(".origin-exit-stage"), {
        autoAlpha: 0,
      });
      gsap.set(root.querySelectorAll(".origin-topo-field"), {
        "--origin-topo-alpha": 0,
        rotationX: END_SCENE_BASE_ROTATION_X,
        rotationY: 0,
        rotationZ: END_SCENE_BASE_ROTATION_Z,
        scale: END_SCENE_TOPO_SCALE,
        y: 6,
        transformPerspective: 1500,
        transformOrigin: "50% 50%",
      });
      gsap.set(root.querySelectorAll(".origin-exit-caption"), {
        autoAlpha: 0,
        y: 18,
      });

      const timeline = gsap.timeline({
        defaults: { ease: "power2.out" },
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: () => (window.innerWidth >= 1180 ? "+=500%" : "+=350%"),
          pin,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const assemblyProgress = Math.min(
              1,
              self.progress / (ORIGIN_END_SCENE_TIME / (self.animation?.duration() || ORIGIN_END_SCENE_TIME)),
            );
            root.style.setProperty("--assembly-progress", assemblyProgress.toFixed(3));
            renderClockFrame(assemblyProgress);
            if (progressLabel) {
              progressLabel.textContent = `${Math.round(assemblyProgress * 100)
                .toString()
                .padStart(2, "0")}%`;
            }
            root.dataset.endSceneActive =
              self.progress >= ORIGIN_END_SCENE_TIME / (self.animation?.duration() || ORIGIN_END_SCENE_TIME)
                ? "true"
                : "false";
            if (root.dataset.endSceneActive !== "true") {
              resetSharedPlaneToRest();
            }
          },
        },
      });

      const [markerOne, markerTwo, markerThree] = gsap.utils.toArray<HTMLElement>(
        root.querySelectorAll(".origin-marker"),
      );
      const gridRotationXTo = gsap.quickTo(originGrid, "rotationX", {
        duration: 0.45,
        ease: "power3.out",
      });
      const gridRotationZTo = gsap.quickTo(originGrid, "rotationZ", {
        duration: 0.45,
        ease: "power3.out",
      });
      const gridXTo = gsap.quickTo(originGrid, "x", {
        duration: 0.45,
        ease: "power3.out",
      });
      const gridYTo = gsap.quickTo(originGrid, "y", {
        duration: 0.45,
        ease: "power3.out",
      });
      const topoRotationXTo = gsap.quickTo(topoField, "rotationX", {
        duration: 0.45,
        ease: "power3.out",
      });
      const topoRotationZTo = gsap.quickTo(topoField, "rotationZ", {
        duration: 0.45,
        ease: "power3.out",
      });
      const topoXTo = gsap.quickTo(topoField, "x", {
        duration: 0.45,
        ease: "power3.out",
      });
      const topoYTo = gsap.quickTo(topoField, "y", {
        duration: 0.45,
        ease: "power3.out",
      });

      const resetSharedPlaneToEndPose = () => {
        gridRotationXTo(END_SCENE_BASE_ROTATION_X);
        gridRotationZTo(END_SCENE_BASE_ROTATION_Z);
        gridXTo(0);
        gridYTo(-8);
        topoRotationXTo(END_SCENE_BASE_ROTATION_X);
        topoRotationZTo(END_SCENE_BASE_ROTATION_Z);
        topoXTo(0);
        topoYTo(6);
      };

      const resetSharedPlaneToRest = () => {
        gsap.set(originGrid, {
          boxShadow: "none",
          clearProps: "rotationX,rotationY,rotationZ,transformPerspective,x,y",
        });
        gsap.set(topoField, {
          clearProps: "rotationX,rotationY,rotationZ,transformPerspective,x,y",
        });
      };

      const handlePointerMove = (event: PointerEvent) => {
        if (root.dataset.endSceneActive !== "true") {
          return;
        }

        const normalizedX = (event.clientX / window.innerWidth - 0.5) * 2;
        const normalizedY = (event.clientY / window.innerHeight - 0.5) * 2;

        gridRotationXTo(END_SCENE_BASE_ROTATION_X - normalizedY * 4);
        gridRotationZTo(END_SCENE_BASE_ROTATION_Z + normalizedX * 3.5);
        gridXTo(normalizedX * 14);
        gridYTo(-8 + normalizedY * 10);

        topoRotationXTo(END_SCENE_BASE_ROTATION_X - normalizedY * 4);
        topoRotationZTo(END_SCENE_BASE_ROTATION_Z + normalizedX * 3.5);
        topoXTo(normalizedX * 22);
        topoYTo(6 + normalizedY * 14);
      };

      timeline
        .addLabel("origin-enter", 0)
        .fromTo(
          root.querySelectorAll(".origin-eyebrow, .origin-heading, .origin-body, .origin-instruction"),
          { autoAlpha: 0, y: 24 },
          { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.07 },
          "origin-enter",
        )
        .to(root.querySelectorAll(".origin-clock-sequence"), { autoAlpha: 1, scale: 1, duration: 0.8 }, 0.15)
        .to(root.querySelectorAll(".origin-clock-reticle"), { autoAlpha: 0.72, scale: 1, duration: 0.8 }, 0.18)
        .addLabel("assembly-start", 1)
        .to(markerOne, { autoAlpha: 1, y: 0, duration: 0.55 }, "assembly-start+=0.25")
        .addLabel("marker-02", 2.25)
        .to(markerOne, { autoAlpha: 0, y: -12, duration: 0.35 }, "marker-02")
        .to(root.querySelectorAll(".origin-clock-sequence"), { filter: "contrast(1.05) saturate(0.92)", duration: 0.8 }, "marker-02")
        .to(markerTwo, { autoAlpha: 1, y: 0, duration: 0.55 }, "marker-02+=0.3")
        .addLabel("marker-03", 3.55)
        .to(markerTwo, { autoAlpha: 0, y: -12, duration: 0.35 }, "marker-03")
        .to(root.querySelectorAll(".origin-annotation"), { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.05 }, "marker-03+=0.1")
        .to(markerThree, { autoAlpha: 1, y: 0, duration: 0.55 }, "marker-03+=0.25")
        .addLabel("digital-transform", 4.85)
        .to(root.querySelectorAll(".origin-clock-reticle"), { autoAlpha: 0.95, rotation: 18, duration: 0.75 }, "digital-transform")
        .to(root.querySelectorAll(".origin-clock-sequence"), { scale: 1.035, duration: 0.75 }, "digital-transform")
        .addLabel("origin-exit", 6.1)
        .to(root.querySelectorAll(".origin-annotation"), { autoAlpha: 0, y: -8, duration: 0.35 }, "origin-exit-=0.1")
        .to(
          root.querySelectorAll(".origin-final-statement"),
          {
            "--final-rule-scale": 1,
            "--final-veil-alpha": 1,
            "--final-veil-scale": 1,
            autoAlpha: 1,
            duration: 0.7,
            ease: "power3.out",
            y: 0,
          },
          "origin-exit",
        )
        .to(
          root.querySelectorAll(".origin-final-word"),
          {
            autoAlpha: 1,
            duration: 0.72,
            ease: "power3.out",
            skewX: 0,
            stagger: { each: 0.045, from: "start" },
            x: 0,
            y: 0,
          },
          "origin-exit+=0.16",
        )
        .to(root.querySelectorAll(".origin-instruction"), { autoAlpha: 0, y: -10, duration: 0.45 }, "origin-exit")
        .addLabel("origin-end-scene", ORIGIN_END_SCENE_TIME)
        .to(
          root.querySelectorAll(".origin-exit-stage"),
          {
            autoAlpha: 1,
            duration: 0.32,
          },
          "origin-end-scene",
        )
        .to(
          root.querySelectorAll(".origin-grid"),
          {
            autoAlpha: 1,
            rotationX: END_SCENE_BASE_ROTATION_X,
            rotationY: 0,
            rotationZ: END_SCENE_BASE_ROTATION_Z,
            scale: END_SCENE_GRID_SCALE,
            y: -8,
            boxShadow: "0 58px 150px rgba(0, 0, 0, 0.44)",
            transformPerspective: 1500,
            transformOrigin: "50% 50%",
            duration: 1.18,
            ease: "power3.inOut",
          },
          "origin-end-scene+=0.02",
        )
        .to(
          root.querySelectorAll(".origin-topo-field"),
          {
            "--origin-topo-alpha": 1,
            rotationX: END_SCENE_BASE_ROTATION_X,
            rotationY: 0,
            rotationZ: END_SCENE_BASE_ROTATION_Z,
            scale: END_SCENE_TOPO_SCALE,
            y: 6,
            transformPerspective: 1500,
            duration: 1.18,
            ease: "none",
          },
          "origin-end-scene+=0.08",
        )
        .to(
          root.querySelectorAll(".origin-exit-caption"),
          { autoAlpha: 1, y: 0, duration: 0.55 },
          "origin-end-scene+=0.82",
        )
        .to({}, { duration: 0.62 });

      root.dataset.endSceneActive = "false";
      resetSharedPlaneToRest();
      window.addEventListener("pointermove", handlePointerMove);
      root.addEventListener("pointerleave", resetSharedPlaneToEndPose);
      const onResize = () => renderClockFrame(Number(root.style.getPropertyValue("--assembly-progress")) || 0);
      window.addEventListener("resize", onResize);

      return () => {
        root.dataset.endSceneActive = "false";
        window.removeEventListener("pointermove", handlePointerMove);
        root.removeEventListener("pointerleave", resetSharedPlaneToEndPose);
        window.removeEventListener("resize", onResize);
        heroExit?.scrollTrigger?.kill();
        heroExit?.kill();
        timeline.scrollTrigger?.kill();
        timeline.kill();
      };
    },
    { scope: rootRef, dependencies: [enabled, reducedMotion], revertOnUpdate: true },
  );
}
