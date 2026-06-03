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
  ["left heading", "Licensed Mechanical Engineer"],
  ["metric", "06+"],
  ["portrait asset", "/assets/hero-cutout.png"],
  ["skeleton reveal asset", "/assets/hero-skeleton-cutout.png"],
  ["upper right asset", "/assets/hero-back.png"],
  ["right feature", "Operational Thinking"],
  ["dossier layout", "dossier-panel"],
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

console.log("Hero verification passed.");
