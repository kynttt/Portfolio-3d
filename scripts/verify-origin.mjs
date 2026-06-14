import { mkdirSync } from "node:fs";
import { chromium } from "playwright-core";

const outDir = "artifacts";
mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch({
  executablePath: "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
});

const viewports = [
  ["desktop", 1440, 960],
  ["mobile", 390, 920],
];

try {
  for (const [name, width, height] of viewports) {
    const page = await browser.newPage({ viewport: { width, height } });
    await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
    await page.waitForTimeout(1200);

    const initial = await page.evaluate(() => {
      return {
        hasTransition: Boolean(document.querySelector(".mechanical-loop-transition")),
        hasOrigin: Boolean(document.querySelector(".origin-section")),
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    };
    });

    if (initial.hasTransition || !initial.hasOrigin) {
      throw new Error(`${name}: unexpected loop transition state or missing Origin section`);
    }

    if (initial.scrollWidth > initial.clientWidth + 1) {
      throw new Error(
        `${name}: horizontal overflow ${initial.scrollWidth}px > ${initial.clientWidth}px`,
      );
    }

    await page.evaluate(() => window.scrollTo(0, window.innerHeight * 0.55));
    await page.waitForTimeout(800);

    const sequenceFrame = await page.locator(".hero-backdrop-object").evaluate((element) => {
      return Number(element.dataset.frame ?? "0");
    });

    if (name === "desktop" && sequenceFrame <= 0) {
      throw new Error(`${name}: hero image sequence did not advance on scroll`);
    }

    const coverState = await page.evaluate(() => {
      const hero = document.querySelector(".hero-frame")?.getBoundingClientRect();
      const origin = document
        .querySelector(".origin-section")
        ?.getBoundingClientRect();

      return {
        heroTop: hero?.top,
        originTop: origin?.top,
        viewportHeight: window.innerHeight,
      };
    });

    if (
      name === "desktop" &&
      (coverState.heroTop === undefined ||
        coverState.originTop === undefined ||
        Math.abs(coverState.heroTop) > 48 ||
        coverState.originTop >= coverState.viewportHeight ||
        coverState.originTop <= coverState.viewportHeight * 0.42)
    ) {
      throw new Error(
        `${name}: Origin handoff is not entering with the expected cover/parallax range: ${JSON.stringify(coverState)}`,
      );
    }

    if (name === "desktop") {
      const rollingTextState = await page.locator(".systems-roll-char").first().evaluate((element) => {
        const style = window.getComputedStyle(element);
        return {
          transform: style.transform,
          inlineStyle: element.getAttribute("style") ?? "",
        };
      });

      if (
        rollingTextState.transform === "none" ||
        !rollingTextState.inlineStyle.includes("rotateX")
      ) {
        throw new Error(
          `${name}: SYSTEMS rolling text did not activate: ${JSON.stringify(
            rollingTextState,
          )}`,
        );
      }
    }

    if (name === "desktop") {
      await page.screenshot({
        path: `${outDir}/hero-covered-by-origin-transition.png`,
        fullPage: false,
      });
    }

    await page.evaluate(() => {
      const origin = document.querySelector(".origin-section");
      if (origin) {
        window.scrollTo(0, origin.getBoundingClientRect().top + window.scrollY + window.innerHeight);
      }
    });
    await page.waitForTimeout(1200);

    const originVisibleText = await page.locator(".origin-section").innerText();
    const originAllText = await page.locator(".origin-section").evaluate((element) => {
      return element.textContent ?? "";
    });

    if (!originVisibleText.includes("BEFORE I BUILT") || !originVisibleText.includes("MECHANICAL ONES")) {
      throw new Error(`${name}: Origin copy is not readable`);
    }

    if (!originAllText.includes("THE TOOLS CHANGED")) {
      throw new Error(`${name}: closing statement is missing`);
    }

    const hasEndScene = await page.evaluate(() => {
      return Boolean(
        document.querySelector(".origin-exit-stage") &&
          document.querySelector(".origin-topo-field") &&
          !document.querySelector(".origin-exit-slab"),
      );
    });

    if (!hasEndScene) {
      throw new Error(`${name}: Origin zoom-out end scene is missing or still uses a custom slab`);
    }

    const progressed = await page.locator(".assembly-progress-value").first().innerText();
    if (name === "desktop" && progressed === "00%") {
      throw new Error(`${name}: Origin assembly progress did not advance`);
    }

    const originClockFrame = await page.locator(".origin-clock-sequence").evaluate((element) => {
      return Number(element.dataset.frame ?? "0");
    });

    if (name === "desktop" && originClockFrame <= 0) {
      throw new Error(`${name}: Origin clock sequence did not advance on scroll`);
    }

    if (name === "desktop") {
      const midSceneState = await page.evaluate(() => {
        const plane = document.querySelector(".origin-shared-plane");
        const hoverPlane = document.querySelector(".origin-hover-plane");
        const topo = document.querySelector(".origin-topo-field");
        return {
          planeTransform: plane ? window.getComputedStyle(plane).transform : "none",
          hoverPlaneTransform: hoverPlane ? window.getComputedStyle(hoverPlane).transform : "none",
          topoOpacity: topo ? Number(window.getComputedStyle(topo).opacity) : 0,
          progressText: document.querySelector(".assembly-progress-value")?.textContent ?? "",
        };
      });

      if (
        midSceneState.planeTransform !== "none" ||
        midSceneState.hoverPlaneTransform !== "none" ||
        midSceneState.topoOpacity > 0.05 ||
        midSceneState.progressText === "100%"
      ) {
        throw new Error(
          `${name}: Origin normal scene is polluted by end-scene transforms: ${JSON.stringify(midSceneState)}`,
        );
      }
    }

    if (name === "desktop") {
      await page.evaluate(() => {
        const origin = document.querySelector(".origin-section");
        if (origin) {
          window.scrollTo(
            0,
            origin.getBoundingClientRect().top + window.scrollY + window.innerHeight * 4.9,
          );
        }
      });
      await page.waitForTimeout(1000);

      const endSceneState = await page.evaluate(() => {
        const stage = document.querySelector(".origin-exit-stage");
        const plane = document.querySelector(".origin-shared-plane");
        const hoverPlane = document.querySelector(".origin-hover-plane");
        const topo = document.querySelector(".origin-topo-field");
        const planeRect = plane?.getBoundingClientRect();
        const stageStyle = stage ? window.getComputedStyle(stage) : null;
        const planeStyle = plane ? window.getComputedStyle(plane) : null;
        const hoverPlaneStyle = hoverPlane ? window.getComputedStyle(hoverPlane) : null;
        const topoStyle = topo ? window.getComputedStyle(topo) : null;
        const progressText = document.querySelector(".assembly-progress-value")?.textContent ?? "";
        const stageBackground = stageStyle?.backgroundColor ?? "";

        return {
          stageOpacity: stageStyle ? Number(stageStyle.opacity) : 0,
          stageBackground,
          planeOpacity: planeStyle ? Number(planeStyle.opacity) : 0,
          planeTransform: planeStyle?.transform ?? "none",
          hoverPlaneTransform: hoverPlaneStyle?.transform ?? "none",
          topoTransform: topoStyle?.transform ?? "none",
          planeWidth: planeRect?.width ?? 0,
          planeHeight: planeRect?.height ?? 0,
          centerDelta: planeRect
            ? Math.abs(planeRect.left + planeRect.width / 2 - window.innerWidth / 2)
            : 9999,
          progressText,
        };
      });

      if (
        endSceneState.stageOpacity < 0.55 ||
        !endSceneState.stageBackground.includes("14, 14, 14") ||
        endSceneState.planeOpacity < 0.75 ||
        !endSceneState.planeTransform.startsWith("matrix3d") ||
        endSceneState.hoverPlaneTransform !== "none" ||
        endSceneState.topoTransform !== "none" ||
        endSceneState.planeWidth >= 1260 ||
        endSceneState.planeWidth < 620 ||
        endSceneState.planeHeight < 320 ||
        endSceneState.centerDelta > 80 ||
        endSceneState.progressText !== "100%"
      ) {
        throw new Error(`${name}: Origin end scene is not centered/readable: ${JSON.stringify(endSceneState)}`);
      }

      await page.mouse.move(width / 2, height / 2);
      await page.waitForTimeout(150);
      const settledTransform = await page.evaluate(() => {
        const plane = document.querySelector(".origin-shared-plane");
        const hoverPlane = document.querySelector(".origin-hover-plane");
        const topo = document.querySelector(".origin-topo-field");
        return {
          plane: plane ? window.getComputedStyle(plane).transform : "none",
          hoverPlane: hoverPlane ? window.getComputedStyle(hoverPlane).transform : "none",
          topo: topo ? window.getComputedStyle(topo).transform : "none",
        };
      });

      await page.mouse.move(width * 0.78, height * 0.26);
      await page.waitForTimeout(220);
      const hoverTransform = await page.evaluate(() => {
        const plane = document.querySelector(".origin-shared-plane");
        const hoverPlane = document.querySelector(".origin-hover-plane");
        const topo = document.querySelector(".origin-topo-field");
        return {
          plane: plane ? window.getComputedStyle(plane).transform : "none",
          hoverPlane: hoverPlane ? window.getComputedStyle(hoverPlane).transform : "none",
          topo: topo ? window.getComputedStyle(topo).transform : "none",
        };
      });

      if (
        settledTransform.plane !== hoverTransform.plane ||
        settledTransform.hoverPlane === hoverTransform.hoverPlane ||
        settledTransform.topo !== "none" ||
        hoverTransform.topo !== "none"
      ) {
        throw new Error(
          `${name}: Origin shared plane did not respond to pointer movement: ${JSON.stringify({
            settledTransform,
            hoverTransform,
          })}`,
        );
      }
    }

    await page.screenshot({
      path: `${outDir}/origin-${name}.png`,
      fullPage: false,
    });

    await page.close();
  }

  console.log("Origin verification passed. Screenshots written to artifacts/.");
} finally {
  await browser.close();
}
