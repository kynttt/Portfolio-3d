# Origin Outro Single-Image Ripple Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the layered skeleton reveal with a single `hero.png` image that ripples under pointer movement and settles when movement stops.

**Architecture:** Render one `ImageTexture` inside the existing `CursorRipples` shader. Remove all custom mask generation, skeleton and cutout layers, pointer trail state, and reveal-specific CSS; the shader owns the entire interaction and naturally damps after movement.

**Tech Stack:** Next.js 15, React 19, TypeScript, shaders/react CursorRipples, Playwright Core, Sharp.

## Global Constraints

- Change only the Origin light-outro portrait interaction and its focused verification.
- Use `/assets/hero.png` as the only image asset in the interaction.
- Remove all skeleton references and reveal masks.
- Ripple responds to pointer movement and settles after the cursor stops.
- Preserve the existing portrait stage layout and bottom alignment.

---

### Task 1: Define the single-image interaction contract

**Files:**
- Modify: `scripts/verify-outro-ripple-mask.mjs`

**Interfaces:**
- Consumes: `.origin-outro-shader`, `.origin-outro-ripple-canvas`
- Produces: assertions that only `hero.png` is configured, no skeleton or mask layers exist, movement changes rendered pixels, and the image converges toward rest after pointer motion stops.

- [ ] **Step 1: Write failing source assertions**

Require `OriginOutroShaderReveal.tsx` to contain `/assets/hero.png` and reject `hero-skeleton`, `hero-cutout`, trail code, and mask code.

- [ ] **Step 2: Run the focused verifier**

Run: `npm run verify:outro-ripple`
Expected: FAIL because the current component still uses skeleton and cutout layers.

### Task 2: Replace the layered reveal

**Files:**
- Modify: `components/portfolio/origin/OriginOutroShaderReveal.tsx`
- Modify: `app/globals.css`

**Interfaces:**
- Consumes: `className?: string`
- Produces: one full-size `CursorRipples` shader rendering `/assets/hero.png`

- [ ] **Step 1: Simplify the component**

Return one root container with a single `Shader`, `CursorRipples`, and `ImageTexture`. Configure `intensity={9}`, `decay={20}`, `radius={0.45}`, `chromaticSplit={0.7}`, and `edges="stretch"`.

- [ ] **Step 2: Remove obsolete CSS**

Delete skeleton, cover, wave, alignment, and mask declarations. Keep only the stage, shader container, ripple canvas, and canvas sizing. Replace the crosshair cursor with the normal cursor.

- [ ] **Step 3: Run runtime and static verification**

Run: `npm run verify:outro-ripple`
Expected: PASS with visible movement response and settling.

Run: `npx tsc --noEmit`
Expected: exit 0.

Run: `git diff --check -- app/globals.css components/portfolio/origin/OriginOutroShaderReveal.tsx scripts/verify-outro-ripple-mask.mjs`
Expected: no whitespace errors.