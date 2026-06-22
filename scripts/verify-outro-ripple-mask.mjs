import assert from "node:assert/strict";
import { mkdirSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright-core";
import sharp from "sharp";

const componentSource = await readFile(
  new URL("../components/portfolio/origin/OriginOutroShaderReveal.tsx", import.meta.url),
  "utf8",
);
const css = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");
assert.match(
  componentSource,
  /\/assets\/hero-cutout\.png/,
  "outro does not use the transparent hero cutout",
);
assert.doesNotMatch(
  componentSource,
  /hero-skeleton|\/assets\/hero\.png/,
  "opaque or skeleton assets remain",
);
const heroMetadata = await sharp(
  fileURLToPath(new URL("../public/assets/hero-cutout.png", import.meta.url)),
).metadata();
assert.equal(heroMetadata.hasAlpha, true, "hero cutout must preserve transparent pixels");
assert.doesNotMatch(
  componentSource,
  /createRippleMasks|createOrganicPath|TRAIL_DURATION_MS|mask-image/,
  "custom reveal and trail logic remains",
);
assert.doesNotMatch(
  css.slice(css.indexOf(".origin-outro-portrait-stage"), css.indexOf(".origin-topo-field")),
  /origin-outro-skeleton|origin-outro-portrait-cover|origin-outro-ripple-wave|mask-image/,
  "old layered reveal CSS remains",
);
const meanPixelDifference = async (left, right) => {
  const leftPixels = await sharp(left).removeAlpha().raw().toBuffer();
  const rightPixels = await sharp(right).removeAlpha().raw().toBuffer();
  return leftPixels.reduce(
    (total, value, index) => total + Math.abs(value - rightPixels[index]),
    0,
  ) / leftPixels.length;
};

const browser = await chromium.launch({
  executablePath: "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
});

try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 960 } });
  await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
  await page.evaluate(() => {
    const origin = document.querySelector(".origin-section");
    if (origin) {
      window.scrollTo(
        0,
        origin.getBoundingClientRect().top + window.scrollY + window.innerHeight * 9.15,
      );
    }
  });
  await page.waitForTimeout(900);

  const state = await page.evaluate(() => ({
    hasRoot: Boolean(document.querySelector(".origin-outro-shader")),
    hasCanvas: Boolean(document.querySelector(".origin-outro-ripple-canvas canvas")),
    hasSkeleton: Boolean(document.querySelector(".origin-outro-skeleton-layer")),
    hasCover: Boolean(document.querySelector(".origin-outro-portrait-cover")),
    hasWave: Boolean(document.querySelector(".origin-outro-ripple-wave")),
  }));

  assert.equal(state.hasRoot, true, "outro shader root is missing");
  assert.equal(state.hasCanvas, true, "ripple shader canvas is missing");
  assert.equal(state.hasSkeleton, false, "skeleton layer still renders");
  assert.equal(state.hasCover, false, "portrait reveal cover still renders");
  assert.equal(state.hasWave, false, "masked ripple wave still renders");

  const stage = page.locator(".origin-outro-portrait-stage");
  const box = await stage.boundingBox();
  assert.ok(box, "origin outro portrait stage has no bounds");

  const clip = {
    x: box.x + box.width * 0.32,
    y: box.y + box.height * 0.2,
    width: box.width * 0.36,
    height: box.height * 0.4,
  };
  const restingBefore = await page.screenshot({ clip });

  await page.mouse.move(box.x + box.width * 0.25, box.y + box.height * 0.3);
  await page.mouse.move(box.x + box.width * 0.65, box.y + box.height * 0.48, {
    steps: 9,
  });
  await page.waitForTimeout(90);
  const active = await page.screenshot({ clip });
  await page.waitForTimeout(3200);
  const settledA = await page.screenshot({ clip });
  await page.waitForTimeout(500);
  const settledB = await page.screenshot({ clip });

  const activeDifference = await meanPixelDifference(restingBefore, active);
  const settledDrift = await meanPixelDifference(settledA, settledB);

  assert.ok(
    activeDifference > 0.8,
    `cursor movement did not visibly ripple hero.png: mean difference ${activeDifference}`,
  );
  assert.ok(
    settledDrift < activeDifference * 0.35,
    `ripple did not settle after movement stopped: active ${activeDifference}, settled drift ${settledDrift}`,
  );

  mkdirSync("artifacts", { recursive: true });
  await page.screenshot({
    path: "artifacts/origin-outro-single-image-ripple.png",
    fullPage: false,
  });
} finally {
  await browser.close();
}

console.log("Origin outro uses the transparent hero cutout with a pointer ripple that settles at rest.");
