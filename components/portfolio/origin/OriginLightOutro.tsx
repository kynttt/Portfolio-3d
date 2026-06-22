"use client";

import { OriginOutroShaderReveal } from "@/components/portfolio/origin/OriginOutroShaderReveal";

export function OriginLightOutro() {
  return (
    <div
      className="origin-light-outro"
      role="status"
      aria-label="Selected Systems chapter complete"
    >
      <div className="origin-light-outro-wash" aria-hidden="true" />

      <div className="origin-outro-portrait-stage">
        <OriginOutroShaderReveal className="origin-outro-shader" />
      </div>

      <div className="origin-light-outro-marker">
        <section className="origin-light-outro-copy" aria-labelledby="origin-outro-title">
          <div className="origin-light-outro-kicker">
            <span>04</span>
            <span>Selected systems</span>
          </div>

          <h3 className="origin-light-outro-title" id="origin-outro-title">
            <span>Systems{" "}</span>
            <span>documented.{" "}</span>
            <span>Returning to{" "}</span>
            <span>the field.</span>
          </h3>

          <p className="origin-light-outro-summary">
            A record of the systems, experiments, and decisions that shaped the work.
            The chapter closes; the practice continues.
          </p>

          <div className="origin-light-outro-status">
            <span className="origin-light-outro-status-dot" aria-hidden="true" />
            <span>Chapter complete</span>
            <span>Scroll to continue</span>
          </div>
        </section>

        <aside className="origin-light-outro-index" aria-label="Chapter completion register">
          <div className="origin-light-outro-register">
            <span className="origin-light-outro-register-label">Completion register</span>
            <strong>04 / 04</strong>
          </div>

          <dl className="origin-light-outro-register-details">
            <div>
              <dt>Section</dt>
              <dd>Selected systems</dd>
            </div>
            <div>
              <dt>State</dt>
              <dd>Documented</dd>
            </div>
            <div>
              <dt>Interaction</dt>
              <dd>Pointer ripple</dd>
            </div>
          </dl>
        </aside>
      </div>
    </div>
  );
}