"use client";

import { Fragment, useRef } from "react";
import { CareerMarker } from "@/components/portfolio/origin/CareerMarker";
import { OriginHillsGallery } from "@/components/portfolio/origin/OriginHillsGallery";
import { MechanicalAssembly } from "@/components/portfolio/origin/MechanicalAssembly";
import { OriginEndScene } from "@/components/portfolio/origin/OriginEndScene";
import { OriginMetadata } from "@/components/portfolio/origin/OriginMetadata";
import { GLSLHills } from "@/components/ui/glsl-hills";
import { careerMarkers, originCopy } from "@/data/origin-content";
import { useOriginAssemblyTimeline } from "@/hooks/useOriginAssemblyTimeline";
import { useReducedMotionPreference } from "@/hooks/useReducedMotionPreference";

export function OriginSection() {
  const rootRef = useRef<HTMLElement | null>(null);
  const prefersReducedMotion = useReducedMotionPreference();

  useOriginAssemblyTimeline(rootRef, {
    enabled: true,
    reducedMotion: prefersReducedMotion,
  });

  return (
    <section
      className="origin-section"
      id="origin"
      ref={rootRef}
      aria-labelledby="origin-heading"
    >
      <div className="origin-pin">
        <div className="origin-shared-plane">
          <div className="origin-hover-plane">
            <div className="origin-grid">
              <div className="origin-copy-panel">
                <p className="origin-eyebrow">{originCopy.eyebrow}</p>
                <h2 className="origin-heading" id="origin-heading">
                  {originCopy.title.split("\n").map((line) => (
                    <span key={line}>{line}</span>
                  ))}
                </h2>
                <div className="origin-body">
                  <p>{originCopy.supporting}</p>
                  <p>{originCopy.secondary}</p>
                </div>
                <p className="origin-instruction">{originCopy.instruction}</p>
              </div>

              <div className="origin-assembly-panel">
                <MechanicalAssembly />
                <div className="origin-final-statement">
                  {originCopy.finalStatement.split("\n").map((line) => (
                    <Fragment key={line}>
                      <span className="origin-final-line">
                        {line.split(" ").map((word, index, words) => (
                          <span className="origin-final-word" key={`${line}-${word}-${index}`}>
                            {word}
                            {index < words.length - 1 ? " " : ""}
                          </span>
                        ))}
                      </span>
                      {"\n"}
                    </Fragment>
                  ))}
                </div>
              </div>

              <div className="origin-side-panel">
                <OriginMetadata />
                <div className="origin-marker-stack">
                  {careerMarkers.map((marker) => (
                    <CareerMarker key={marker.id} marker={marker} />
                  ))}
                </div>
              </div>
            </div>
            <OriginEndScene />
          </div>
        </div>
        <div className="origin-blackout-stage">
          <canvas className="origin-bloom-canvas" aria-hidden="true" />
          <div className="origin-blackout-atmosphere" aria-hidden="true" />
          <div className="origin-blackout-veil" aria-hidden="true" />
          <div className="origin-blackout-plate" aria-hidden="true" />
          <div className="origin-glsl-hills-stage">
            <GLSLHills
              className="origin-glsl-hills"
              width="100%"
              height="100%"
              cameraZ={118}
              planeSize={248}
              speed={0.36}
            />
            <OriginHillsGallery />
          </div>
        </div>
      </div>
    </section>
  );
}
