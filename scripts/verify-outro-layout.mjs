import assert from "node:assert/strict";
import { mkdirSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { chromium } from "playwright-core";

const timelineSource = await readFile(
  new URL("../hooks/useOriginAssemblyTimeline.ts", import.meta.url),
  "utf8",
);
const washDuration = Number(
  timelineSource.match(/origin-light-outro-wash"\),\s*\{ yPercent: 0, duration: ([\d.]+)/s)?.[1] ?? "0",
);
const portraitDelay = Number(
  timelineSource.match(/origin-outro-portrait-stage"\),\s*\{\s*autoAlpha: 1[\s\S]*?\},\s*"origin-light-outro\+=([\d.]+)"/s)?.[1] ?? "0",
);

assert.ok(washDuration > 0, "light wash duration could not be read from timeline");
assert.ok(portraitDelay > 0, "portrait reveal delay could not be read from timeline");
assert.ok(
  portraitDelay >= washDuration,
  `portrait starts at ${portraitDelay}s before the ${washDuration}s light-page takeover completes`,
);
const browser = await chromium.launch({
  executablePath: "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
});

const viewports = [
  { name: "desktop", width: 1440, height: 960 },
  { name: "mobile", width: 390, height: 920 },
];

try {
  for (const viewport of viewports) {
    const page = await browser.newPage({ viewport });
    await page.goto("http://localhost:3000", { waitUntil: "networkidle" });

    if (viewport.name === "desktop") {
      let transitionState = null;
      const transitionSamples = [];
      for (let factor = 7.4; factor <= 9.3; factor += 0.08) {
        await page.evaluate((scrollFactor) => {
          const origin = document.querySelector(".origin-section");
          if (origin) {
            window.scrollTo(
              0,
              origin.getBoundingClientRect().top + window.scrollY + window.innerHeight * scrollFactor,
            );
          }
        }, factor);
        await page.waitForTimeout(110);

        const candidate = await page.evaluate(() => {
          const outro = document.querySelector(".origin-light-outro");
          const wash = document.querySelector(".origin-light-outro-wash");
          const portrait = document.querySelector(".origin-outro-portrait-stage");
          const washRect = wash?.getBoundingClientRect();
          return {
            outroOpacity: outro ? Number(window.getComputedStyle(outro).opacity) : 0,
            portraitOpacity: portrait ? Number(window.getComputedStyle(portrait).opacity) : 0,
            washTop: washRect?.top ?? -9999,
            viewportHeight: window.innerHeight,
          };
        });

        transitionSamples.push({ factor, ...candidate });

        if (
          candidate.outroOpacity > 0.5 &&
          candidate.washTop > 40 &&
          candidate.washTop < candidate.viewportHeight - 40
        ) {
          transitionState = candidate;
          break;
        }
      }

      assert.ok(
        transitionState,
        `desktop: could not observe the light-page takeover transition: ${JSON.stringify(transitionSamples)}`,
      );
      assert.ok(
        transitionState.portraitOpacity <= 0.02,
        `desktop: portrait leaked into the takeover transition: ${JSON.stringify(transitionState)}`,
      );
    }

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

    const state = await page.evaluate(() => {
      const marker = document.querySelector(".origin-light-outro-marker");
      const copy = document.querySelector(".origin-light-outro-copy");
      const index = document.querySelector(".origin-light-outro-index");
      const portrait = document.querySelector(".origin-outro-portrait-stage");
      const title = document.querySelector(".origin-light-outro-title");
      const summary = document.querySelector(".origin-light-outro-summary");
      const register = document.querySelector(".origin-light-outro-register");
      const markerStyle = marker ? window.getComputedStyle(marker) : null;
      const rect = (element) => {
        const value = element?.getBoundingClientRect();
        return value
          ? { left: value.left, right: value.right, top: value.top, bottom: value.bottom, width: value.width, height: value.height }
          : null;
      };

      return {
        markerDisplay: markerStyle?.display ?? "",
        gridColumns: markerStyle?.gridTemplateColumns ?? "",
        copy: rect(copy),
        index: rect(index),
        portrait: rect(portrait),
        title: title?.textContent?.replace(/\s+/g, " ").trim() ?? "",
        summary: summary?.textContent?.trim() ?? "",
        hasRegister: Boolean(register),
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight,
      };
    });

    assert.equal(state.title, "Systems documented. Returning to the field.", `${viewport.name}: closing title changed`);
    assert.ok(state.summary.length >= 45, `${viewport.name}: supporting context is too thin`);
    assert.equal(state.hasRegister, true, `${viewport.name}: completion register is missing`);
    assert.ok(state.copy && state.index && state.portrait, `${viewport.name}: outro layout elements are missing`);

    if (viewport.name === "desktop") {
      assert.equal(state.markerDisplay, "grid", "desktop: editorial marker is not a grid");
      assert.ok(state.copy.width >= 280, `desktop: left copy is too narrow: ${state.copy.width}`);
      assert.ok(state.index.width >= 200, `desktop: right register is too narrow: ${state.index.width}`);
      assert.ok(state.copy.right <= state.portrait.left - 24, "desktop: left copy overlaps portrait corridor");
      assert.ok(state.index.left >= state.portrait.right + 24, "desktop: right register overlaps portrait corridor");
      assert.ok(Math.abs(state.portrait.bottom - viewport.height) <= 4, "desktop: portrait bottom alignment changed");
      assert.ok(state.portrait.width >= 460 && state.portrait.width <= 620, "desktop: portrait width changed");
    } else {
      assert.ok(state.copy.left >= 16 && state.copy.right <= viewport.width - 16, "mobile: copy escapes viewport");
      assert.ok(state.index.left >= 16 && state.index.right <= viewport.width - 16, "mobile: register escapes viewport");
      assert.ok(state.copy.bottom + 16 <= state.index.top, "mobile: copy and register overlap");
      assert.ok(Math.abs(state.portrait.bottom - viewport.height) <= 4, "mobile: portrait bottom alignment changed");
    }

    mkdirSync("artifacts", { recursive: true });
    await page.screenshot({
      path: `artifacts/origin-outro-layout-${viewport.name}.png`,
      fullPage: false,
    });
    await page.close();
  }
} finally {
  await browser.close();
}

console.log("Origin outro editorial layout is aligned, responsive, and preserves the portrait.");
