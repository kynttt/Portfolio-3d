"use client";

import { SelectedSystemVisual } from "@/components/portfolio/origin/SelectedSystemVisual";
import { selectedSystemsContent } from "@/data/selected-systems-content";

export function OriginHillsGallery() {
  const firstSystem = selectedSystemsContent.systems[0];

  return (
    <div
      className="origin-gallery"
      role="region"
      aria-label={selectedSystemsContent.sectionLabel}
    >
      <div className="origin-gallery-intro">
        <div>
          <span className="origin-gallery-kicker">
            {selectedSystemsContent.chapter} / {selectedSystemsContent.sectionLabel}
          </span>
          <p className="origin-gallery-description">
            {firstSystem.dynamicDescription}
          </p>
          <span className="origin-gallery-focus-meta">
            {firstSystem.category.toUpperCase()}
          </span>
        </div>
        <span className="origin-gallery-count">
          01 / {String(selectedSystemsContent.systems.length).padStart(2, "0")}
        </span>
      </div>

      <div className="origin-gallery-viewport">
        <div className="origin-gallery-track">
          {selectedSystemsContent.systems.map((system) => (
            <article
              className="origin-gallery-card"
              data-description={system.dynamicDescription}
              data-meta={system.category.toUpperCase()}
              key={system.id}
            >
              <div className="origin-gallery-frame">
                <SelectedSystemVisual
                  systemId={system.id}
                  title={system.title}
                  visualLabel={system.visualLabel}
                  imageSrc={system.imageSrc}
                  imageAlt={system.imageAlt}
                  placeholderVariant={system.placeholderVariant}
                />
                <div className="origin-gallery-caption">
                  <div>
                    <p className="origin-gallery-card-title">{system.title}</p>
                    <small>{system.shortCaption}</small>
                  </div>
                  <span>
                    {system.footerLeft}
                    <br />
                    {system.footerRight}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
