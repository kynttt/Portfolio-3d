"use client";

import { Fragment, useRef } from "react";
import { ArrowDownRight } from "lucide-react";
import { manifestoContent } from "@/data/manifesto-content";
import { useFinePointer } from "@/hooks/useFinePointer";
import { useManifestoTimeline } from "@/hooks/useManifestoTimeline";
import { useReducedMotionPreference } from "@/hooks/useReducedMotionPreference";
import { useSystemsReveal } from "@/hooks/useSystemsReveal";
import { ManifestoTransitionBridge } from "@/components/portfolio/manifesto/ManifestoTransitionBridge";
import { TechnicalLineNetwork } from "@/components/portfolio/manifesto/TechnicalLineNetwork";

export function ManifestoSection() {
  const rootRef = useRef<HTMLElement | null>(null);
  const hasFinePointer = useFinePointer();
  const prefersReducedMotion = useReducedMotionPreference();
  const revealEnabled = hasFinePointer && !prefersReducedMotion;

  useManifestoTimeline(rootRef, {
    enabled: true,
    reducedMotion: prefersReducedMotion,
  });
  useSystemsReveal(rootRef, {
    enabled: revealEnabled,
    reducedMotion: prefersReducedMotion,
  });

  return (
    <section
      className="manifesto-section"
      id="manifesto"
      ref={rootRef}
      aria-labelledby="manifesto-heading"
    >
      <div className="manifesto-pin">
        <div className="manifesto-grid-plane" aria-hidden="true" />
        <ManifestoTransitionBridge />

        <div className="manifesto-hidden-system">
          <TechnicalLineNetwork />
        </div>

        <div className="manifesto-reveal-layer" aria-hidden="true">
          <TechnicalLineNetwork />
        </div>

        <div className="manifesto-surface">
          <header className="manifesto-header manifesto-animated">
            <p className="manifesto-eyebrow">{manifestoContent.eyebrow}</p>
            <div className="manifesto-meta">
              <span>{manifestoContent.technicalLabel}</span>
              <span>{manifestoContent.systemCode}</span>
            </div>
          </header>

          <div className="manifesto-copy">
            <h2 className="manifesto-heading" id="manifesto-heading">
              {manifestoContent.statement.map((line, index) =>
                line ? (
                  <span className="manifesto-copy-line" key={`${line}-${index}`}>
                    <span className="manifesto-copy-line-text manifesto-animated">
                      {line}
                    </span>
                  </span>
                ) : (
                  <span className="manifesto-copy-gap" aria-hidden="true" key={`gap-${index}`} />
                ),
              )}
            </h2>
            <p className="manifesto-copy-support manifesto-animated">
              {manifestoContent.supportingParagraph}
            </p>
            <p className="manifesto-closing manifesto-animated">
              {manifestoContent.closingSentence}
            </p>
          </div>

          <div className="manifesto-footer">
            <p className="manifesto-instruction manifesto-animated">
              {(revealEnabled
                ? manifestoContent.desktopInstruction
                : manifestoContent.mobileInstruction
              ).map((line) => (
                <Fragment key={line}>
                  {line}
                  <br />
                </Fragment>
              ))}
            </p>
            <a className="manifesto-next manifesto-animated" href="#selected-systems">
              <span>{manifestoContent.nextLabel}</span>
              <ArrowDownRight size={18} strokeWidth={1.7} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
