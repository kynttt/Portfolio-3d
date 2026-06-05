"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { registerGsap } from "@/lib/gsap/registerGsap";

const FRAME_COUNT = 181;
const FRAME_WIDTH = 828;
const FRAME_HEIGHT = 1108;

function framePath(index: number) {
  return `/assets/hero-vid/ezgif-frame-${String(index + 1).padStart(3, "0")}.png`;
}

type HeroScrollSequenceProps = {
  className?: string;
  enabled?: boolean;
};

function drawFrame(
  canvas: HTMLCanvasElement,
  image: HTMLImageElement,
  frameIndex: number,
) {
  const context = canvas.getContext("2d");
  if (!context) {
    return;
  }

  const pixelRatio = window.devicePixelRatio || 1;
  const displayWidth = canvas.clientWidth || FRAME_WIDTH;
  const displayHeight = canvas.clientHeight || FRAME_HEIGHT;
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

export function HeroScrollSequence({
  className,
  enabled = true,
}: HeroScrollSequenceProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const gsap = registerGsap();

  useGSAP(
    () => {
      const canvas = canvasRef.current;
      const transition = document.querySelector<HTMLElement>(".origin-section");

      if (!canvas) {
        return;
      }

      const images = Array.from({ length: FRAME_COUNT }, (_, index) => {
        const image = new window.Image();
        image.src = framePath(index);
        return image;
      });
      const sequence = { frame: 0 };

      const render = () => {
        const frameIndex = Math.min(
          FRAME_COUNT - 1,
          Math.max(0, Math.round(sequence.frame)),
        );
        const image = images[frameIndex];

        if (image.complete) {
          drawFrame(canvas, image, frameIndex);
        } else {
          image.onload = () => drawFrame(canvas, image, frameIndex);
        }
      };

      images[0].onload = render;
      if (images[0].complete) {
        render();
      }

      if (!transition || !enabled) {
        return;
      }

      const tween = gsap.to(sequence, {
        frame: FRAME_COUNT - 1,
        ease: "none",
        snap: "frame",
        onUpdate: render,
        scrollTrigger: {
          trigger: transition,
          start: "top bottom",
          end: "top top",
          scrub: 0.9,
          invalidateOnRefresh: true,
        },
      });

      const onResize = () => render();
      window.addEventListener("resize", onResize);

      return () => {
        window.removeEventListener("resize", onResize);
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    },
    { scope: canvasRef, dependencies: [enabled], revertOnUpdate: true },
  );

  return (
    <canvas
      className={className}
      data-frame="0"
      height={FRAME_HEIGHT}
      ref={canvasRef}
      role="img"
      width={FRAME_WIDTH}
      aria-label="Scroll-controlled mechanical portrait preview"
    />
  );
}
