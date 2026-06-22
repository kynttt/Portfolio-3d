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
    await page.waitForTimeout(1400);

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

    const hasTopoPatternArtifacts = await page.evaluate(() => {
      return Boolean(
        document.querySelector(".origin-topo-rings") ||
          document.querySelector(".origin-topo-scan"),
      );
    });

    if (hasTopoPatternArtifacts) {
      throw new Error(`${name}: Origin zoom-out still renders circular or X scan artifacts`);
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
        !endSceneState.stageBackground.includes("rgba(0, 0, 0, 0)") ||
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

      await page.evaluate(() => {
        const origin = document.querySelector(".origin-section");
        if (origin) {
          window.scrollTo(
            0,
            origin.getBoundingClientRect().top + window.scrollY + window.innerHeight * 7.7,
          );
        }
      });
      await page.waitForTimeout(900);

      const blackoutState = await page.evaluate(() => {
        const veil = document.querySelector(".origin-blackout-veil");
        const plate = document.querySelector(".origin-blackout-plate");
        const bloom = document.querySelector(".origin-bloom-canvas");
        const hillsStage = document.querySelector(".origin-glsl-hills-stage");
        const hillsCanvas = document.querySelector(".origin-glsl-hills-stage canvas");
        const gallery = document.querySelector(".origin-gallery");
        const galleryTrack = document.querySelector(".origin-gallery-track");
        const galleryCards = document.querySelectorAll(".origin-gallery-card");
        const galleryCount = document.querySelector(".origin-gallery-count");
        const galleryDescription = document.querySelector(
          ".origin-gallery-description",
        );
        const galleryFocusMeta = document.querySelector(
          ".origin-gallery-focus-meta",
        );
        const galleryTitles = Array.from(
          document.querySelectorAll(".origin-gallery-card-title"),
          (element) => element.textContent?.trim() ?? "",
        );
        const placeholderVisuals = document.querySelectorAll(
          ".selected-system-placeholder",
        );
        const galleryImages = document.querySelectorAll(
          ".selected-system-image",
        );
        const blackoutStage = document.querySelector(".origin-blackout-stage");
        const stage = document.querySelector(".origin-exit-stage");
        const grid = document.querySelector(".origin-grid");
        const caption = document.querySelector(".origin-exit-caption");
        const style = veil ? window.getComputedStyle(veil) : null;
        const plateStyle = plate ? window.getComputedStyle(plate) : null;
        const hillsStyle = hillsStage ? window.getComputedStyle(hillsStage) : null;
        const galleryStyle = gallery ? window.getComputedStyle(gallery) : null;
        const galleryTrackStyle = galleryTrack ? window.getComputedStyle(galleryTrack) : null;
        const blackoutStageStyle = blackoutStage ? window.getComputedStyle(blackoutStage) : null;
        const stageStyle = stage ? window.getComputedStyle(stage) : null;
        const gridStyle = grid ? window.getComputedStyle(grid) : null;
        const captionStyle = caption ? window.getComputedStyle(caption) : null;
        const hillsRect = hillsCanvas?.getBoundingClientRect();
        const galleryViewportRect = document
          .querySelector(".origin-gallery-viewport")
          ?.getBoundingClientRect();
        const galleryCardRects = Array.from(galleryCards, (card) =>
          card.getBoundingClientRect(),
        );
        const galleryCardTops = galleryCardRects.map((rect) => rect.top);
        const lastGalleryCardRect = galleryCardRects.at(-1);
        const galleryTrackWidth = galleryTrack?.scrollWidth ?? 0;
        const galleryCardWidth = galleryCardRects[0]?.width ?? 0;

        return {
          hasVeil: Boolean(veil),
          hasPlate: Boolean(plate),
          hasBloom: Boolean(bloom),
          hasHillsStage: Boolean(hillsStage),
          hasHillsCanvas: Boolean(hillsCanvas),
          hasGallery: Boolean(gallery),
          hasGalleryTrack: Boolean(galleryTrack),
          galleryHiddenByAncestor: Boolean(
            gallery?.closest('[aria-hidden="true"]'),
          ),
          galleryCardCount: galleryCards.length,
          galleryCountText: galleryCount?.textContent?.trim() ?? "",
          galleryDescriptionText:
            galleryDescription?.textContent?.trim() ?? "",
          galleryFocusMetaText: galleryFocusMeta?.textContent?.trim() ?? "",
          galleryTitles,
          placeholderVisualCount: placeholderVisuals.length,
          galleryImageCount: galleryImages.length,
          veilOpacity: style ? Number(style.opacity) : 0,
          plateOpacity: plateStyle ? Number(plateStyle.opacity) : 0,
          hillsOpacity: hillsStyle ? Number(hillsStyle.opacity) : 0,
          galleryOpacity: galleryStyle ? Number(galleryStyle.opacity) : 0,
          galleryTransform: galleryTrackStyle?.transform ?? "none",
          galleryViewportLeft: galleryViewportRect?.left ?? -1,
          galleryViewportRight: galleryViewportRect?.right ?? -1,
          galleryCardTopSpread:
            galleryCardTops.length > 0
              ? Math.max(...galleryCardTops) - Math.min(...galleryCardTops)
              : 9999,
          galleryTrackWidth,
          galleryCardWidth,
          lastGalleryCardCenter: lastGalleryCardRect
            ? lastGalleryCardRect.left + lastGalleryCardRect.width / 2
            : -1,
          hillsWidth: hillsRect?.width ?? 0,
          hillsHeight: hillsRect?.height ?? 0,
          stageBackground: stageStyle?.backgroundColor ?? "",
          blackoutStageZIndex: blackoutStageStyle ? Number(blackoutStageStyle.zIndex) : 0,
          gridZIndex: gridStyle ? Number(gridStyle.zIndex) : 0,
          captionOpacity: captionStyle ? Number(captionStyle.opacity) : 0,
        };
      });

      if (
        !blackoutState.hasVeil ||
        !blackoutState.hasPlate ||
        !blackoutState.hasBloom ||
        !blackoutState.hasHillsStage ||
        !blackoutState.hasHillsCanvas ||
        !blackoutState.hasGallery ||
        !blackoutState.hasGalleryTrack ||
        blackoutState.galleryHiddenByAncestor ||
        blackoutState.galleryCardCount !== 4 ||
        blackoutState.galleryCountText !== "04 / 04" ||
        blackoutState.galleryDescriptionText !==
          "Applied AI experiments exploring document workflows, resume screening, legal research assistance, retrieval systems, and local-model integrations." ||
        blackoutState.galleryFocusMetaText !== "AI / PRODUCT EXPERIMENTS" ||
        JSON.stringify(blackoutState.galleryTitles) !==
          JSON.stringify(["GENIUS", "FIELD SYSTEMS", "POSEIDON", "AI PRODUCT LAB"]) ||
        blackoutState.placeholderVisualCount !== 4 ||
        blackoutState.galleryImageCount !== 0 ||
        blackoutState.veilOpacity < 0.82 ||
        blackoutState.plateOpacity < 0.9 ||
        blackoutState.hillsOpacity < 0.55 ||
        blackoutState.galleryOpacity < 0.45 ||
        blackoutState.galleryTransform === "none" ||
        Math.abs(blackoutState.galleryViewportLeft) > 1 ||
        Math.abs(blackoutState.galleryViewportRight - width) > 1 ||
        blackoutState.galleryCardTopSpread > 2 ||
        blackoutState.galleryTrackWidth < width * 2.4 ||
        blackoutState.galleryCardWidth < width * 0.4 ||
        Math.abs(blackoutState.lastGalleryCardCenter - width / 2) > 8 ||
        blackoutState.hillsWidth < width * 0.95 ||
        blackoutState.hillsHeight < height * 0.95 ||
        blackoutState.blackoutStageZIndex <= blackoutState.gridZIndex ||
        blackoutState.captionOpacity > 0.25
      ) {
        throw new Error(
          `${name}: blackout end state did not take over cleanly: ${JSON.stringify(blackoutState)}`,
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

      const lightOutroState = await page.evaluate(() => {
        const outro = document.querySelector(".origin-light-outro");
        const wash = document.querySelector(".origin-light-outro-wash");
        const marker = document.querySelector(".origin-light-outro-marker");
        const shaderCanvas = document.querySelector(".origin-outro-shader");
        const portraitStage = document.querySelector(
          ".origin-outro-portrait-stage",
        );
        const copy = document.querySelector(".origin-light-outro-copy");
        const gallery = document.querySelector(".origin-gallery");
        const hills = document.querySelector(".origin-glsl-hills");
        const outroStyle = outro ? window.getComputedStyle(outro) : null;
        const washStyle = wash ? window.getComputedStyle(wash) : null;
        const markerStyle = marker ? window.getComputedStyle(marker) : null;
        const copyStyle = copy ? window.getComputedStyle(copy) : null;
        const galleryStyle = gallery ? window.getComputedStyle(gallery) : null;
        const hillsStyle = hills ? window.getComputedStyle(hills) : null;
        const portraitRect = portraitStage?.getBoundingClientRect();
        const shaderRect = shaderCanvas?.getBoundingClientRect();

        return {
          hasOutro: Boolean(outro),
          hasWash: Boolean(wash),
          hasMarker: Boolean(marker),
          hasShaderCanvas: Boolean(shaderCanvas),
          outroOpacity: outroStyle ? Number(outroStyle.opacity) : 0,
          washTransform: washStyle?.transform ?? "none",
          markerOpacity: markerStyle ? Number(markerStyle.opacity) : 0,
          shaderMixFactor: Number(
            shaderCanvas?.getAttribute("data-mix-factor") ?? "-1",
          ),
          shaderMouseX: Number(
            shaderCanvas?.getAttribute("data-mouse-x") ?? "-1",
          ),
          shaderMouseY: Number(
            shaderCanvas?.getAttribute("data-mouse-y") ?? "-1",
          ),
          copyPosition: copyStyle?.position ?? "",
          portraitWidth: portraitRect?.width ?? 0,
          portraitHeight: portraitRect?.height ?? 0,
          shaderWidth: shaderRect?.width ?? 0,
          shaderHeight: shaderRect?.height ?? 0,
          portraitCenterDelta: portraitRect
            ? Math.abs(
                portraitRect.left +
                  portraitRect.width / 2 -
                  window.innerWidth / 2,
              )
            : 9999,
          portraitBottom: portraitRect?.bottom ?? -1,
          galleryOpacity: galleryStyle ? Number(galleryStyle.opacity) : 1,
          hillsOpacity: hillsStyle ? Number(hillsStyle.opacity) : 1,
          backgroundColor: washStyle?.backgroundColor ?? "",
        };
      });

      if (
        !lightOutroState.hasOutro ||
        !lightOutroState.hasWash ||
        !lightOutroState.hasMarker ||
        !lightOutroState.hasShaderCanvas ||
        lightOutroState.outroOpacity < 0.95 ||
        lightOutroState.washTransform === "none" ||
        lightOutroState.markerOpacity < 0.9 ||
        lightOutroState.shaderMixFactor > 0.02 ||
        lightOutroState.shaderMouseX < 0 ||
        lightOutroState.shaderMouseY < 0 ||
        lightOutroState.copyPosition !== "absolute" ||
        lightOutroState.portraitWidth < width * 0.24 ||
        Math.abs(lightOutroState.portraitWidth - lightOutroState.shaderWidth) >
          1 ||
        Math.abs(
          lightOutroState.portraitHeight - lightOutroState.shaderHeight,
        ) > 1 ||
        lightOutroState.portraitCenterDelta > 4 ||
        Math.abs(lightOutroState.portraitBottom - height) > 4 ||
        lightOutroState.galleryOpacity > 0.08 ||
        lightOutroState.hillsOpacity > 0.12 ||
        !lightOutroState.backgroundColor.includes("244, 242, 236")
      ) {
        throw new Error(
          `${name}: light-mode outro did not resolve cleanly: ${JSON.stringify(lightOutroState)}`,
        );
      }

      const portraitStage = page.locator(".origin-outro-portrait-stage");
      const portraitStageBox = await portraitStage.boundingBox();
      if (!portraitStageBox) {
        throw new Error(`${name}: portrait reveal stage has no measurable bounds`);
      }

      await page.mouse.move(
        portraitStageBox.x + portraitStageBox.width * 0.32,
        portraitStageBox.y + portraitStageBox.height * 0.3,
      );
      await page.waitForTimeout(650);

      const hoveredRevealState = await page.evaluate(() => {
        const canvas = document.querySelector(".origin-outro-shader");

        return {
          mixFactor: Number(
            canvas?.getAttribute("data-mix-factor") ?? "-1",
          ),
          mouseX: Number(canvas?.getAttribute("data-mouse-x") ?? "-1"),
          mouseY: Number(canvas?.getAttribute("data-mouse-y") ?? "-1"),
          rippleCount: Number(canvas?.getAttribute("data-ripple-count") ?? "-1"),
        };
      });

      if (
        hoveredRevealState.mixFactor < 0.25 ||
        Math.abs(hoveredRevealState.mouseX - 0.32) > 0.08 ||
        Math.abs(hoveredRevealState.mouseY - 0.7) > 0.08 ||
        hoveredRevealState.rippleCount < 1
      ) {
        throw new Error(
          `${name}: pointer-driven skeleton reveal did not respond: ${JSON.stringify(hoveredRevealState)}`,
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



