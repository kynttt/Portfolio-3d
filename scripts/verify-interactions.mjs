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
      const selectors = [".portrait-placeholder", ".hero-copy", ".detail-orbit-wrap"];

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

  const portraitTransformState = await page.locator(".character-reveal").evaluate((element) => {
    const style = window.getComputedStyle(element);
    return {
      transform: style.transform,
      inlineStyle: element.getAttribute("style") ?? "",
    };
  });

  if (
    portraitTransformState.transform !== "none" ||
    portraitTransformState.inlineStyle.includes("perspective(") ||
    portraitTransformState.inlineStyle.includes("rotateX") ||
    portraitTransformState.inlineStyle.includes("rotateY")
  ) {
    throw new Error(
      `Hero portrait tilt is still active: ${JSON.stringify(portraitTransformState)}`,
    );
  }

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

  console.log("Interaction verification passed. Screenshots written to artifacts/.");
  await page.close();
} finally {
  await browser.close();
}
