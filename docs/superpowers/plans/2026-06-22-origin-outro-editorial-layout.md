# Origin Outro Editorial Layout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Elevate the text surrounding the centered ripple portrait into a professional chapter-end editorial layout.

**Architecture:** Keep the portrait stage, shader, background wash, and timeline untouched. Replace the loose absolute text blocks with a full-frame three-column editorial grid: left closing statement, protected center portrait corridor, and right completion register; use shared top/bottom alignment rails and responsive stacking below desktop.

**Tech Stack:** Next.js 15, React 19, semantic HTML, CSS Grid, Playwright Core verification.

## Global Constraints

- Change only `OriginLightOutro.tsx`, its related CSS, and focused verification.
- Preserve the existing portrait stage dimensions, center alignment, ripple behavior, background, and animation timing.
- Keep the primary wording “Systems documented. Returning to the field.”
- Keep chapter number `04 / 04` and the scroll continuation instruction.
- Avoid overlap with the portrait at desktop, tablet, and mobile widths.

---

### Task 1: Define the editorial frame contract

**Files:**
- Create: `scripts/verify-outro-layout.mjs`
- Modify: `package.json`

**Interfaces:**
- Consumes: `.origin-light-outro-marker`, `.origin-light-outro-copy`, `.origin-light-outro-index`, `.origin-outro-portrait-stage`
- Produces: desktop and mobile assertions for hierarchy, alignment, non-overlap, and unchanged portrait geometry.

- [ ] **Step 1: Write failing layout assertions**

At `1440x960`, require the marker to use CSS Grid, left copy width of at least `280px`, right register width of at least `200px`, and both blocks to remain outside the portrait bounds. At `390x920`, require the copy and register to remain inside the viewport and not overlap one another.

- [ ] **Step 2: Run the verifier**

Run: `npm run verify:outro-layout`
Expected: FAIL because the current marker is an absolute inset with independently centered text blocks.

### Task 2: Build the professional chapter-end layout

**Files:**
- Modify: `components/portfolio/origin/OriginLightOutro.tsx`
- Modify: `app/globals.css`

**Interfaces:**
- Consumes: existing static chapter content
- Produces: `.origin-light-outro-kicker`, `.origin-light-outro-title`, `.origin-light-outro-summary`, `.origin-light-outro-status`, `.origin-light-outro-register`

- [ ] **Step 1: Improve semantic hierarchy**

Use an eyebrow, a display heading retaining the approved wording, one concise supporting sentence, a status row, and a right-side completion register with chapter number, section label, and interaction cue.

- [ ] **Step 2: Implement the desktop editorial grid**

Use `grid-template-columns: minmax(280px, 1fr) minmax(460px, 620px) minmax(210px, 0.72fr)` with the center column matching the portrait corridor. Align the left and right blocks to a common vertical rail and give the title more controlled line breaks and whitespace.

- [ ] **Step 3: Implement responsive behavior**

At tablet sizes, reduce the side columns and font scale without moving the portrait. At mobile sizes, place the closing copy at the top and the compact register at the bottom, leaving the center portrait readable.

- [ ] **Step 4: Verify**

Run: `npm run verify:outro-layout`
Expected: PASS at desktop and mobile.

Run: `npm run verify:outro-ripple`
Expected: PASS; portrait ripple remains unchanged.

Run: `npx tsc --noEmit`
Expected: exit 0.