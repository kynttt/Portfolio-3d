import { mkdirSync } from "node:fs";
import { chromium } from "playwright-core";

const outDir = "artifacts";
mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch({
  executablePath: "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
});

const viewports = [
  ["desktop", 1440, 960],
  ["tablet", 900, 1100],
  ["mobile", 390, 920],
];

try {
  for (const [name, width, height] of viewports) {
    const page = await browser.newPage({ viewport: { width, height } });
    await page.goto("http://localhost:3000", { waitUntil: "domcontentloaded" });
    await page.locator(".hero-frame").waitFor({ state: "visible", timeout: 20000 });
    await page.waitForTimeout(1400);

    const metrics = await page.evaluate(() => {
      const frame = document.querySelector(".hero-frame")?.getBoundingClientRect();
      const center = document.querySelector(".center-column")?.getBoundingClientRect();
      const portrait = document
        .querySelector(".portrait-placeholder")
        ?.getBoundingClientRect();
      const mark = document.querySelector(".oversized-mark")?.getBoundingClientRect();
      const bodyWidth = document.documentElement.clientWidth;

      return {
        bodyWidth,
        frame: frame && {
          width: frame.width,
          height: frame.height,
          left: frame.left,
          right: frame.right,
        },
        center: center && { width: center.width, height: center.height },
        portrait: portrait && { width: portrait.width, height: portrait.height },
        mark: mark && { width: mark.width, height: mark.height },
        text: document.body.innerText,
      };
    });

    if (!metrics.frame || !metrics.center || !metrics.portrait || !metrics.mark) {
      throw new Error(`${name}: missing required hero elements`);
    }

    if (!metrics.text.includes("ALDREN KENT CIRUNAY")) {
      throw new Error(`${name}: owner name is not visible`);
    }

    if (metrics.frame.width > metrics.bodyWidth) {
      throw new Error(`${name}: frame overflows viewport width`);
    }

    if (name === "desktop" && (metrics.frame.left !== 0 || metrics.frame.width !== metrics.bodyWidth)) {
      throw new Error(`${name}: frame is not full-bleed`);
    }

    if (metrics.center.height < 500) {
      throw new Error(`${name}: center panel is too short`);
    }

    if (metrics.portrait.width < 250 && width >= 900) {
      throw new Error(`${name}: portrait placeholder is too small`);
    }

    await page.screenshot({
      path: `${outDir}/hero-${name}.png`,
      fullPage: true,
    });

    await page.close();
  }

  console.log("Visual verification passed. Screenshots written to artifacts/.");
} finally {
  await browser.close();
}
