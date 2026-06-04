"use client";

import { useRef } from "react";
import { MechanicalTransitionPanel } from "@/components/portfolio/origin/MechanicalTransitionPanel";
import { originCopy, transitionPanels } from "@/data/origin-content";
import { useMechanicalLoopTransition } from "@/hooks/useMechanicalLoopTransition";
import { useReducedMotionPreference } from "@/hooks/useReducedMotionPreference";

export function MechanicalLoopTransition() {
  const rootRef = useRef<HTMLElement | null>(null);
  const prefersReducedMotion = useReducedMotionPreference();

  useMechanicalLoopTransition(rootRef, {
    enabled: true,
    reducedMotion: prefersReducedMotion,
  });

  return (
    <section
      className="mechanical-loop-transition"
      ref={rootRef}
      aria-label="Hero to Origin mechanical transition"
    >
      <div className="mechanical-loop-pin">
        <div className="loop-entry-label">
          <span>{originCopy.metadata.entry}</span>
          <span>{originCopy.metadata.disengaged}</span>
        </div>

        <div className="loop-title-block">
          <p>SCROLL VECTOR / FINITE LOOP</p>
          <h2>{originCopy.transitionTitle}</h2>
        </div>

        <div className="loop-panel-stage" aria-hidden="true">
          {transitionPanels.map((panel, index) => (
            <MechanicalTransitionPanel key={panel.id} panel={panel} index={index} />
          ))}
        </div>

        <div className="loop-progress-meter" aria-hidden="true">
          <span>DEPTH</span>
          <strong className="loop-progress-value">00%</strong>
        </div>
      </div>
    </section>
  );
}
