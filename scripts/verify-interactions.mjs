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

  const inspectionLensCount = await page.locator(".inspection-lens").count();
  if (inspectionLensCount !== 0) {
    throw new Error("Inspection lens hover effect is still rendered");
  }

  const assertNoHeroParallax = async (label) => {
    const transforms = await page.evaluate(() => {
      const selectors = [".portrait-placeholder", ".hero-copy"];

      return selectors.map((selector) => {
        const element = document.querySelector(selector);
        return {
          selector,
          transform: element ? window.getComputedStyle(element).transform : null,
          style: element?.getAttribute("style") ?? "",
        };
      });
    });

    const activeTransforms = transforms.filter(({ transform, style }) => {
      return (
        transform?.startsWith("matrix3d") ||
        style.includes("perspective(") ||
        style.includes("rotateX") ||
        style.includes("rotateY")
      );
    });

    if (activeTransforms.length > 0) {
      throw new Error(
        `${label}: hero-wide parallax transform is still active: ${JSON.stringify(
          activeTransforms,
        )}`,
      );
    }
  };

  await assertNoHeroParallax("Initial center hover");

  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(600);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(600);
  await page.mouse.move(center.x + center.width * 0.72, center.y + center.height * 0.38);
  await page.waitForTimeout(450);
  await assertNoHeroParallax("Returned center hover");

  await page.screenshot({
    path: `${outDir}/hero-no-inspection-lens.png`,
    fullPage: false,
  });

  const ctaCount = await page.locator(".detail-orbit").count();
  if (ctaCount !== 0) {
    throw new Error(`Hero CTA should remain removed in this layout. Found: ${ctaCount}`);
  }

  await page.screenshot({
    path: `${outDir}/hero-interaction-clean-state.png`,
    fullPage: false,
  });

  const revealCount = await page.locator(".character-reveal").count();
  if (revealCount !== 0) {
    throw new Error(`Character reveal should be set aside outside the hero. Found: ${revealCount}`);
  }

  console.log("Interaction verification passed. Screenshots written to artifacts/.");
  await page.close();
} finally {
  await browser.close();
}
