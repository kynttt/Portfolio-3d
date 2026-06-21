"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { SelectedSystemPlaceholderVariant } from "@/data/selected-systems-content";

type SelectedSystemVisualProps = {
  systemId: string;
  title: string;
  visualLabel: string;
  imageSrc?: string;
  imageAlt: string;
  placeholderVariant: SelectedSystemPlaceholderVariant;
};

const variantLabels: Record<SelectedSystemPlaceholderVariant, string[]> = {
  genius: ["UTILITY DIGITAL TWIN", "ASSET MAP", "NODE NETWORK"],
  "field-systems": ["OFFLINE FIELD CAPTURE", "MAP TILE CACHE", "SYNC READY"],
  poseidon: ["LOGISTICS WORKFLOW", "ROUTE PRICING", "BOOKING FLOW"],
  "ai-product-lab": ["AI WORKFLOW", "DOCUMENT RETRIEVAL", "RAG PIPELINE"],
};

function GeniusDiagram() {
  return (
    <>
      <path className="system-visual-route" d="M92 366 L202 284 L326 316 L444 196 L578 238 L704 126" />
      <path className="system-visual-route system-visual-route--faint" d="M124 114 L236 164 L354 102 L500 148 L664 92" />
      {[["92", "366"], ["202", "284"], ["326", "316"], ["444", "196"], ["578", "238"], ["704", "126"]].map(
        ([cx, cy], index) => (
          <g key={`${cx}-${cy}`}>
            <circle className="system-visual-node-ring" cx={cx} cy={cy} r="10" />
            <circle className="system-visual-node" cx={cx} cy={cy} r="3" />
            <text className="system-visual-svg-label" x={Number(cx) + 14} y={Number(cy) - 12}>
              P-{String(index + 1).padStart(2, "0")}
            </text>
          </g>
        ),
      )}
      <rect className="system-visual-panel" x="54" y="58" width="184" height="72" />
      <path className="system-visual-line" d="M72 82 H204 M72 103 H176" />
      <text className="system-visual-svg-label" x="558" y="426">14.6124 N / 121.0437 E</text>
    </>
  );
}

function FieldSystemsDiagram() {
  return (
    <>
      <rect className="system-visual-panel" x="92" y="62" width="226" height="370" rx="14" />
      <rect className="system-visual-panel system-visual-panel--strong" x="116" y="100" width="178" height="238" />
      <path className="system-visual-route" d="M132 298 C166 246 202 272 224 214 S268 180 276 132" />
      {[["142", "286"], ["202", "254"], ["234", "208"], ["274", "142"]].map(([cx, cy]) => (
        <g key={`${cx}-${cy}`}>
          <circle className="system-visual-node-ring" cx={cx} cy={cy} r="9" />
          <circle className="system-visual-node" cx={cx} cy={cy} r="3" />
        </g>
      ))}
      <rect className="system-visual-panel" x="380" y="84" width="320" height="122" />
      <rect className="system-visual-panel" x="380" y="226" width="144" height="142" />
      <rect className="system-visual-panel" x="544" y="226" width="156" height="142" />
      <path className="system-visual-line" d="M406 118 H616 M406 145 H662 M406 172 H560" />
      <circle className="system-visual-progress" cx="634" cy="310" r="36" />
      <path className="system-visual-progress-fill" d="M634 274 A36 36 0 0 1 666 326" />
      <text className="system-visual-svg-label" x="398" y="392">CACHE / 24 TILES</text>
      <text className="system-visual-svg-label" x="572" y="392">SYNC / 100%</text>
    </>
  );
}

function PoseidonDiagram() {
  return (
    <>
      <circle className="system-visual-node-ring" cx="104" cy="250" r="18" />
      <circle className="system-visual-node" cx="104" cy="250" r="5" />
      <circle className="system-visual-node-ring" cx="696" cy="152" r="18" />
      <circle className="system-visual-node" cx="696" cy="152" r="5" />
      <path className="system-visual-route" d="M122 250 C226 104 344 382 458 214 S610 180 678 152" />
      <path className="system-visual-route system-visual-route--faint" d="M122 264 C262 170 362 410 520 286" />
      <text className="system-visual-svg-label" x="74" y="286">ORIGIN / MNL</text>
      <text className="system-visual-svg-label" x="626" y="122">DEST / CEB</text>
      <rect className="system-visual-panel" x="466" y="300" width="264" height="132" />
      <path className="system-visual-line" d="M490 330 H610 M490 354 H696 M490 378 H652" />
      <rect className="system-visual-panel system-visual-panel--strong" x="64" y="68" width="222" height="94" />
      <text className="system-visual-metric" x="84" y="112">572.8 KM</text>
      <text className="system-visual-svg-label" x="84" y="140">CALCULATED ROUTE DISTANCE</text>
    </>
  );
}

function AiProductLabDiagram() {
  const nodes = [
    [114, 118],
    [258, 82],
    [382, 172],
    [526, 96],
    [682, 166],
    [190, 344],
    [366, 390],
    [548, 326],
    [698, 398],
  ];

  return (
    <>
      <path className="system-visual-route system-visual-route--faint" d="M114 118 L258 82 L382 172 L526 96 L682 166 M114 118 L190 344 L366 390 L548 326 L698 398 M382 172 L366 390 M682 166 L548 326" />
      {nodes.map(([cx, cy], index) => (
        <g key={`${cx}-${cy}`}>
          <circle className="system-visual-node-ring" cx={cx} cy={cy} r={index === 2 || index === 7 ? 16 : 10} />
          <circle className="system-visual-node" cx={cx} cy={cy} r={index === 2 || index === 7 ? 5 : 3} />
        </g>
      ))}
      <rect className="system-visual-panel" x="74" y="214" width="206" height="84" />
      <rect className="system-visual-panel" x="454" y="196" width="278" height="88" />
      <path className="system-visual-line" d="M94 238 H244 M94 260 H208 M478 220 H686 M478 244 H640 M478 264 H598" />
      <text className="system-visual-svg-label" x="82" y="322">CHUNK / 084</text>
      <text className="system-visual-svg-label" x="592" y="306">RANK / 0.947</text>
    </>
  );
}

function TechnicalDiagram({ variant }: { variant: SelectedSystemPlaceholderVariant }) {
  return (
    <svg
      className="selected-system-diagram"
      viewBox="0 0 800 500"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    >
      {variant === "genius" && <GeniusDiagram />}
      {variant === "field-systems" && <FieldSystemsDiagram />}
      {variant === "poseidon" && <PoseidonDiagram />}
      {variant === "ai-product-lab" && <AiProductLabDiagram />}
    </svg>
  );
}

export function SelectedSystemVisual({
  systemId,
  title,
  visualLabel,
  imageSrc,
  imageAlt,
  placeholderVariant,
}: SelectedSystemVisualProps) {
  const [imageAvailable, setImageAvailable] = useState(false);

  useEffect(() => {
    if (!imageSrc) {
      setImageAvailable(false);
      return;
    }

    const controller = new AbortController();

    fetch(imageSrc, { method: "HEAD", signal: controller.signal })
      .then((response) => setImageAvailable(response.ok))
      .catch(() => setImageAvailable(false));

    return () => controller.abort();
  }, [imageSrc]);

  return (
    <div
      className={`selected-system-visual selected-system-visual--${placeholderVariant}`}
      data-system-id={systemId}
    >
      {imageAvailable && imageSrc ? (
        <Image
          className="selected-system-image"
          src={imageSrc}
          alt={imageAlt}
          fill
          sizes="(min-width: 1180px) 46vw, (min-width: 821px) 55vw, 86vw"
        />
      ) : (
        <div
          className="selected-system-placeholder"
          role="img"
          aria-label={imageAlt}
        >
          <div className="selected-system-grid" aria-hidden="true" />
          <TechnicalDiagram variant={placeholderVariant} />
          <div className="selected-system-scanline" aria-hidden="true" />
          <div className="selected-system-center-label" aria-hidden="true">
            <span>{visualLabel}</span>
            <small>{title}</small>
          </div>
          <div className="selected-system-technical-labels" aria-hidden="true">
            {variantLabels[placeholderVariant].map((label) => (
              <span key={label}>{label}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
