"use client";

const galleryFrames = [
  {
    id: "signal-01",
    label: "Signal 01",
    title: "Terrain Frame",
    meta: "Placeholder / 01",
    description: "Terrain Frame studies structure, depth, and engineered movement.",
  },
  {
    id: "signal-02",
    label: "Signal 02",
    title: "Motion Study",
    meta: "Placeholder / 02",
    description: "Motion Study explores precise transitions across digital systems.",
  },
  {
    id: "signal-03",
    label: "Signal 03",
    title: "Field Capture",
    meta: "Placeholder / 03",
    description: "Field Capture translates operational detail into a visual record.",
  },
  {
    id: "signal-04",
    label: "Signal 04",
    title: "Depth Slice",
    meta: "Placeholder / 04",
    description: "Depth Slice reveals the technical layers beneath each interface.",
  },
  {
    id: "signal-05",
    label: "Signal 05",
    title: "Contour Echo",
    meta: "Placeholder / 05",
    description: "Contour Echo maps layered systems into one continuous terrain.",
  },
];

export function OriginHillsGallery() {
  return (
    <div className="origin-gallery" aria-hidden="true">
      <div className="origin-gallery-intro">
        <div>
          <span className="origin-gallery-kicker">Selected Systems</span>
          <p className="origin-gallery-description">
            {galleryFrames[0].description}
          </p>
        </div>
        <span className="origin-gallery-count">01 / 05</span>
      </div>

      <div className="origin-gallery-viewport">
        <div className="origin-gallery-track">
          {galleryFrames.map((frame, index) => (
            <article
              className="origin-gallery-card"
              data-description={frame.description}
              key={frame.id}
            >
              <div className="origin-gallery-frame">
                <div className="origin-gallery-image">
                  <span>{frame.label}</span>
                </div>
                <div className="origin-gallery-caption">
                  <p>{frame.title}</p>
                  <span>
                    {frame.meta}
                    {" / "}
                    {String(index + 1).padStart(2, "0")}
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
