import { readFileSync } from "node:fs";

const page = readFileSync("app/page.tsx", "utf8");
const globals = readFileSync("app/globals.css", "utf8");
const characterReveal = readFileSync(
  "components/portfolio/interactions/CharacterSkeletonReveal.tsx",
  "utf8",
);

const expectations = [
  ["portfolio owner", "ALDREN KENT CIRUNAY"],
  ["hero thesis", "ENGINEERED FOR THE REAL WORLD"],
  ["premium meta line", "Mechanical Engineer / Software Systems / Applied AI"],
  ["saved reveal component", "CharacterSkeletonReveal"],
  ["saved portrait asset", "/assets/hero-cutout.png"],
  ["saved skeleton reveal asset", "/assets/hero-skeleton-cutout.png"],
  ["hero scroll runway", "hero-scroll-zone"],
  ["center back-view asset layout", "hero-backdrop-object"],
  ["hero meta layout", "hero-meta-line"],
  ["grain texture", "grain"],
  ["responsive rules", "@media (max-width: 820px)"],
];

const missing = expectations.filter(([, value]) => {
  return (
    !page.includes(value) &&
    !globals.includes(value) &&
    !characterReveal.includes(value)
  );
});

if (missing.length) {
  console.error("Hero verification failed. Missing:");
  for (const [label, value] of missing) {
    console.error(`- ${label}: ${value}`);
  }
  process.exit(1);
}

const removedHeroClutter = [
  ["bottom systems band", "systems-band"],
  ["resume metric", "06+"],
  ["metric label", "years across engineering"],
  ["decorative spark row", "spark-row"],
  ["decorative arrow row", "arrow-row"],
  ["hero reveal component usage", "CharacterSkeletonReveal enabled="],
  ["hero dossier panel", "dossier-panel"],
  ["right portrait layout", "dossier-portrait-object"],
  ["decorative registered mark", "registered-mark"],
  ["registered mark icon import", "CircleDot"],
  ["dark identity rail", "identity-rail"],
  ["rail mark", "rail-mark"],
  ["duplicate center monogram", "monogram"],
  ["dark menu background", "background: var(--ink)"],
];

const stillPresent = removedHeroClutter.filter(([, value]) => {
  return page.includes(value) || globals.includes(value);
});

if (stillPresent.length) {
  console.error("Hero verification failed. Removed clutter still present:");
  for (const [label, value] of stillPresent) {
    console.error(`- ${label}: ${value}`);
  }
  process.exit(1);
}

console.log("Hero verification passed.");
