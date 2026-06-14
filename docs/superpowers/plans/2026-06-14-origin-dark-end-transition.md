# Origin Dark End Transition Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a cinematic blackout with subtle bloom at the very end of the Origin scroll sequence without changing hero behavior or earlier Origin choreography.

**Architecture:** Extend the existing Origin end-scene stack with dedicated blackout layers and a lightweight bloom canvas, then append a final ScrollTrigger-driven blackout segment after the current zoom-out. Validate it by extending the Origin visual verification to assert that the end state becomes dark while the Origin section still pins correctly.

**Tech Stack:** Next.js, React, GSAP ScrollTrigger, CSS gradients, HTML canvas, Playwright verification scripts

---

### Task 1: Add a failing verification for the blackout end state

**Files:**
- Modify: `scripts/verify-origin.mjs`

- [ ] **Step 1: Write the failing test**

Add a final verification block after the current end-scene assertions that scrolls slightly deeper into the pinned Origin sequence and checks that a blackout layer is present and visually dark.

```js
      await page.evaluate(() => {
        const origin = document.querySelector(".origin-section");
        if (origin) {
          window.scrollTo(
            0,
            origin.getBoundingClientRect().top + window.scrollY + window.innerHeight * 5.35,
          );
        }
      });
      await page.waitForTimeout(900);

      const blackoutState = await page.evaluate(() => {
        const veil = document.querySelector(".origin-blackout-veil");
        const bloom = document.querySelector(".origin-bloom-canvas");
        const stage = document.querySelector(".origin-exit-stage");
        const caption = document.querySelector(".origin-exit-caption");
        const style = veil ? window.getComputedStyle(veil) : null;
        const stageStyle = stage ? window.getComputedStyle(stage) : null;
        const captionStyle = caption ? window.getComputedStyle(caption) : null;

        return {
          hasVeil: Boolean(veil),
          hasBloom: Boolean(bloom),
          veilOpacity: style ? Number(style.opacity) : 0,
          stageBackground: stageStyle?.backgroundColor ?? "",
          captionOpacity: captionStyle ? Number(captionStyle.opacity) : 0,
        };
      });

      if (
        !blackoutState.hasVeil ||
        !blackoutState.hasBloom ||
        blackoutState.veilOpacity < 0.82 ||
        blackoutState.captionOpacity > 0.25
      ) {
        throw new Error(`${name}: blackout end state did not take over cleanly: ${JSON.stringify(blackoutState)}`);
      }
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run verify:origin`

Expected: FAIL because `.origin-blackout-veil` and `.origin-bloom-canvas` do not exist yet.

- [ ] **Step 3: Commit**

```bash
git add scripts/verify-origin.mjs
git commit -m "test: add origin blackout end-state verification"
```

### Task 2: Add blackout presentation layers to the Origin end scene

**Files:**
- Modify: `components/portfolio/origin/OriginEndScene.tsx`
- Modify: `app/globals.css`

- [ ] **Step 1: Write minimal implementation markup**

Extend the Origin end-scene component with a bloom canvas and blackout overlays that sit above the current topo field and below the final absolute dark plate.

```tsx
      <canvas className="origin-bloom-canvas" aria-hidden="true" />
      <div className="origin-blackout-atmosphere" />
      <div className="origin-blackout-veil" />
      <div className="origin-blackout-plate" />
```

- [ ] **Step 2: Add base styles**

Define the new layers as full-screen, non-interactive elements inside `.origin-exit-stage`, with starting opacity of `0`, additive blend for bloom, and a smooth dark gradient stack for the veil/plate.

```css
.origin-bloom-canvas,
.origin-blackout-atmosphere,
.origin-blackout-veil,
.origin-blackout-plate {
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0;
}
```

- [ ] **Step 3: Run verification to confirm the DOM exists**

Run: `npm run verify:origin`

Expected: still FAIL, but now because the blackout timing/opacity conditions are not satisfied yet.

### Task 3: Extend the Origin timeline with the final cinematic blackout

**Files:**
- Modify: `hooks/useOriginAssemblyTimeline.ts`

- [ ] **Step 1: Initialize the new blackout elements**

Query the new blackout nodes and set their initial state before the timeline starts.

```ts
      const bloomCanvas = root.querySelector<HTMLCanvasElement>(".origin-bloom-canvas");
      const blackoutAtmosphere = root.querySelector<HTMLElement>(".origin-blackout-atmosphere");
      const blackoutVeil = root.querySelector<HTMLElement>(".origin-blackout-veil");
      const blackoutPlate = root.querySelector<HTMLElement>(".origin-blackout-plate");
```

- [ ] **Step 2: Add the lightweight bloom renderer**

Draw a restrained animated bloom field onto the canvas using the 2D context so the brightest end-scene region glows briefly before disappearing.

```ts
      const renderBloomFrame = (intensity: number) => {
        if (!bloomCanvas) return;
        // size canvas to viewport and draw a few blurred radial gradients
      };
```

- [ ] **Step 3: Append the blackout segment**

After the current `origin-end-scene` phase, add a final scrubbed segment that:

- increases bloom intensity
- darkens the atmosphere/veil/plate
- fades out the caption and topo field
- further dims the shared plane

```ts
        .addLabel("origin-blackout", 7.05)
        .to(root.querySelectorAll(".origin-exit-caption"), { autoAlpha: 0, y: 10, duration: 0.35 }, "origin-blackout")
        .to(root.querySelectorAll(".origin-blackout-atmosphere"), { autoAlpha: 0.72, duration: 0.45 }, "origin-blackout+=0.04")
        .to(root.querySelectorAll(".origin-blackout-veil"), { autoAlpha: 0.9, duration: 0.6 }, "origin-blackout+=0.08")
        .to(root.querySelectorAll(".origin-blackout-plate"), { autoAlpha: 1, duration: 0.72 }, "origin-blackout+=0.18")
```

- [ ] **Step 4: Hook bloom rendering to scroll progress**

During timeline updates, map the final blackout segment progress into `renderBloomFrame()` so the glow only exists during the very last stretch.

- [ ] **Step 5: Run verification to confirm the new behavior**

Run: `npm run verify:origin`

Expected: PASS

### Task 4: Verify no regressions to the earlier sections

**Files:**
- Modify: `scripts/verify-visual.mjs` (only if needed for stricter end-state checks)

- [ ] **Step 1: Run visual regression checks**

Run: `npm run verify:visual`

Expected: PASS

- [ ] **Step 2: Run hero verification**

Run: `npm run verify:hero`

Expected: PASS

- [ ] **Step 3: Run production build**

Run: `npm run build`

Expected: PASS
