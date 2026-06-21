"use client";

const galleryFrames = [
  {
    id: "signal-01",
    label: "Signal 01",
    title: "Terrain Frame",
    meta: "Placeholder / 01",
  },
  {
    id: "signal-02",
    label: "Signal 02",
    title: "Motion Study",
    meta: "Placeholder / 02",
  },
  {
    id: "signal-03",
    label: "Signal 03",
    title: "Field Capture",
    meta: "Placeholder / 03",
  },
  {
    id: "signal-04",
    label: "Signal 04",
    title: "Depth Slice",
    meta: "Placeholder / 04",
  },
  {
    id: "signal-05",
    label: "Signal 05",
    title: "Contour Echo",
    meta: "Placeholder / 05",
  },
];

export function OriginHillsGallery() {
  return (
    <div className="origin-gallery" aria-hidden="true">
      <div className="origin-gallery-intro">
        <div>
          <span className="origin-gallery-kicker">Selected Systems</span>
          <p>Scroll through a field study of engineered digital work.</p>
        </div>
        <span className="origin-gallery-count">01 / 05</span>
      </div>

      <div className="origin-gallery-viewport">
        <div className="origin-gallery-track">
          {galleryFrames.map((frame, index) => (
            <article className="origin-gallery-card" key={frame.id}>
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
