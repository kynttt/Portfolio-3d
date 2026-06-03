import { mkdirSync } from "node:fs";
import { chromium } from "playwright-core";

const outDir = "artifacts";
mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch({
  executablePath: "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
});

try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 960 } });
  await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
  await page.waitForTimeout(1200);

  const center = await page.locator(".center-column").boundingBox();
  if (!center) {
    throw new Error("Missing center hero panel");
  }

  await page.mouse.move(center.x + center.width * 0.67, center.y + center.height * 0.34);
  await page.waitForTimeout(650);

  const lensOpacity = await page.locator(".inspection-lens").evaluate((element) => {
    return Number(window.getComputedStyle(element).opacity);
  });

  if (lensOpacity < 0.45) {
    throw new Error(`Inspection lens did not activate. Opacity: ${lensOpacity}`);
  }

  await page.screenshot({
    path: `${outDir}/hero-lens-active.png`,
    fullPage: false,
  });

  const cta = await page.locator(".detail-orbit").boundingBox();
  if (!cta) {
    throw new Error("Missing magnetic CTA");
  }

  await page.mouse.move(cta.x + cta.width * 0.82, cta.y + cta.height * 0.28);
  await page.waitForTimeout(450);

  const ctaTransform = await page.locator(".detail-orbit").evaluate((element) => {
    return window.getComputedStyle(element).transform;
  });

  if (ctaTransform === "none") {
    throw new Error("Magnetic CTA did not receive a transform on hover");
  }

  await page.screenshot({
    path: `${outDir}/hero-cta-active.png`,
    fullPage: false,
  });

  const portrait = await page.locator(".character-reveal").boundingBox();
  if (!portrait) {
    throw new Error("Missing character reveal target");
  }

  await page.mouse.move(portrait.x + portrait.width * 0.46, portrait.y + portrait.height * 0.28);
  await page.waitForTimeout(550);

  const skeletonOpacity = await page.locator(".character-skeleton-image").evaluate((element) => {
    return Number(window.getComputedStyle(element).opacity);
  });

  if (skeletonOpacity < 0.45) {
    throw new Error(`Skeleton reveal did not activate. Opacity: ${skeletonOpacity}`);
  }

  await page.screenshot({
    path: `${outDir}/hero-skeleton-active.png`,
    fullPage: false,
  });

  console.log("Interaction verification passed. Active lens screenshot written to artifacts/.");
  await page.close();
} finally {
  await browser.close();
}
