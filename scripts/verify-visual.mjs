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

const HERO_SEQUENCE_FINAL_FRAME = 180;

try {
  for (const [name, width, height] of viewports) {
    const page = await browser.newPage({ viewport: { width, height } });
    await page.goto("http://localhost:3000", { waitUntil: "domcontentloaded" });
    await page.locator(".hero-frame").waitFor({ state: "visible", timeout: 20000 });
    await page.waitForTimeout(1400);

    const metrics = await page.evaluate(() => {
      const frame = document.querySelector(".hero-frame")?.getBoundingClientRect();
      const center = document.querySelector(".center-column")?.getBoundingClientRect();
      const heroCopy = document.querySelector(".hero-copy")?.getBoundingClientRect();
      const portrait = document
        .querySelector(".portrait-placeholder")
        ?.getBoundingClientRect();
      const mark = document.querySelector(".oversized-mark")?.getBoundingClientRect();
      const bodyWidth = document.documentElement.clientWidth;
      const heroCanvas = document.querySelector(".hero-backdrop-object");
      const heroCanvasPixel = (() => {
        if (!(heroCanvas instanceof HTMLCanvasElement)) {
          return null;
        }

        const context = heroCanvas.getContext("2d");
        if (!context || heroCanvas.width < 4 || heroCanvas.height < 4) {
          return null;
        }

        const [r, g, b, a] = context.getImageData(2, 2, 1, 1).data;
        return { r, g, b, a };
      })();

      return {
        bodyWidth,
        frame: frame && {
          width: frame.width,
          height: frame.height,
          left: frame.left,
          right: frame.right,
        },
        center: center && { width: center.width, height: center.height },
        heroCopy: heroCopy && {
          centerX: heroCopy.left + heroCopy.width / 2,
          width: heroCopy.width,
        },
        portrait: portrait && { width: portrait.width, height: portrait.height },
        portraitCenterX: portrait ? portrait.left + portrait.width / 2 : null,
        mark: mark && { width: mark.width, height: mark.height },
        heroCanvasPixel,
        text: document.body.innerText,
      };
    });

    if (!metrics.frame || !metrics.center || !metrics.heroCopy || !metrics.portrait || !metrics.mark) {
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

    if (width >= 900) {
      const contentAxis = metrics.frame.width / 2;
      const copyDelta = Math.abs(metrics.heroCopy.centerX - contentAxis);
      const assetDelta = Math.abs((metrics.portraitCenterX ?? 0) - contentAxis);

      if (copyDelta > metrics.frame.width * 0.18 || assetDelta > metrics.frame.width * 0.18) {
        throw new Error(
          `${name}: hero composition is not symmetrical enough: ${JSON.stringify({
            copyDelta,
            assetDelta,
            frameWidth: metrics.frame.width,
          })}`,
        );
      }
    }

    if (!metrics.heroCanvasPixel) {
      throw new Error(`${name}: missing readable hero canvas pixel data`);
    }

    if (metrics.heroCanvasPixel.a > 16) {
      throw new Error(
        `${name}: hero canvas still has an opaque matte at its corner: ${JSON.stringify(
          metrics.heroCanvasPixel,
        )}`,
      );
    }

    await page.screenshot({
      path: `${outDir}/hero-${name}.png`,
      fullPage: true,
    });

    await page.evaluate(() => {
      const zone = document.querySelector(".hero-scroll-zone");
      if (!(zone instanceof HTMLElement)) {
        return;
      }

      window.scrollTo(0, Math.max(0, zone.offsetHeight - window.innerHeight - 2));
    });
    await page.waitForTimeout(1400);

    const handoff = await page.evaluate(() => {
      const canvas = document.querySelector(".hero-backdrop-object");
      const origin = document.querySelector(".origin-section");
      return {
        frame: canvas instanceof HTMLCanvasElement ? Number(canvas.dataset.frame ?? -1) : -1,
        originTop: origin?.getBoundingClientRect().top ?? -1,
        viewportHeight: window.innerHeight,
      };
    });

    if (handoff.frame < HERO_SEQUENCE_FINAL_FRAME - 1) {
      throw new Error(
        `${name}: hero sequence has not reached its final frame before Origin handoff: ${JSON.stringify(
          handoff,
        )}`,
      );
    }

    if (width >= 821 && handoff.originTop > 24) {
      throw new Error(
        `${name}: Origin panel does not fully cover the hero at handoff: ${JSON.stringify(
          handoff,
        )}`,
      );
    }

    await page.close();
  }

  console.log("Visual verification passed. Screenshots written to artifacts/.");
} finally {
  await browser.close();
}
