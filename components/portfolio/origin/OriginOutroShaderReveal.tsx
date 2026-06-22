"use client";

import { CursorRipples, ImageTexture, Shader } from "shaders/react";

type OriginOutroShaderRevealProps = {
  className?: string;
};

export function OriginOutroShaderReveal({
  className,
}: OriginOutroShaderRevealProps) {
  return (
    <div
      className={className}
      role="img"
      aria-label="Mechanical humanoid portrait with an interactive ripple effect"
    >
      <Shader
        className="origin-outro-ripple-canvas"
        colorSpace="srgb"
        disableTelemetry
        style={{ width: "100%", height: "100%" }}
      >
        <CursorRipples
          intensity={9}
          decay={20}
          radius={0.45}
          chromaticSplit={0.7}
          edges="stretch"
        >
          <ImageTexture url="/assets/hero-cutout.png" objectFit="cover" />
        </CursorRipples>
      </Shader>
    </div>
  );
}