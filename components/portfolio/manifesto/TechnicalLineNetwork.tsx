import type { CSSProperties } from "react";
import { systemAnnotations } from "@/data/manifesto-content";

export function TechnicalLineNetwork() {
  return (
    <div className="manifesto-network" aria-hidden="true">
      <svg viewBox="0 0 1200 780" role="presentation">
        <g className="manifesto-network-layer" data-layer="mechanical">
          <circle className="manifesto-line" cx="260" cy="350" r="96" />
          <circle className="manifesto-line" cx="260" cy="350" r="38" />
          <path className="manifesto-line" d="M116 350h420" />
          <path className="manifesto-line" d="M260 210v300" />
          <path className="manifesto-line" d="M188 278 332 422" />
          <path className="manifesto-line" d="M350 278c42 40 54 88 22 142" />
        </g>

        <g className="manifesto-network-layer" data-layer="field">
          <path className="manifesto-line" d="M482 596 C574 522 636 610 724 528 S892 420 1028 486" />
          <path className="manifesto-line" d="M544 594v-88" />
          <path className="manifesto-line" d="M724 528v-118" />
          <path className="manifesto-line" d="M944 456v-96" />
          <circle className="manifesto-line" cx="544" cy="506" r="20" />
          <circle className="manifesto-line" cx="724" cy="410" r="22" />
          <circle className="manifesto-line" cx="944" cy="360" r="20" />
        </g>

        <g className="manifesto-network-layer" data-layer="software">
          <path className="manifesto-line manifesto-network-resolve" d="M586 214h154v86H586z" />
          <path className="manifesto-line manifesto-network-resolve" d="M826 184h150v78H826z" />
          <path className="manifesto-line manifesto-network-resolve" d="M818 396h190v116H818z" />
          <path className="manifesto-line manifesto-network-resolve" d="M740 258 826 224" />
          <path className="manifesto-line manifesto-network-resolve" d="M740 300 818 424" />
          <path className="manifesto-line manifesto-network-resolve" d="M976 262 1008 396" />
          <path className="manifesto-line manifesto-network-resolve" d="M1010 510 1108 622" />
          <circle className="manifesto-line" cx="1108" cy="622" r="18" />
          <path className="manifesto-line" d="M852 430h128M852 462h86M852 494h118" />
        </g>
      </svg>

      <div className="manifesto-annotations">
        {systemAnnotations.slice(0, 7).map((annotation, index) => (
          <span key={annotation} style={{ "--annotation-index": index } as CSSProperties}>
            {annotation}
          </span>
        ))}
      </div>
    </div>
  );
}
