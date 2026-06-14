# Origin Dark End Transition Design

## Goal

Add a premium cinematic blackout at the very end of the Origin section, after the current zoom-out beat, without changing any existing hero or earlier Origin effects.

## Approved Direction

The final state should feel like a cinematic blackout with subtle volumetric/WebGL bloom:

- the existing Origin end scene completes first
- the brightest parts of the scene briefly glow
- the whole screen transitions smoothly into a deep dark page
- the result feels filmic, immersive, and minimal rather than glitchy or technical

## Scope

In scope:

- the last scroll phase of the Origin section only
- smooth transition from current Origin zoom-out into a dark full-screen state
- subtle bloom / atmospheric darkening effect
- reduced-motion fallback using non-WebGL opacity/gradient transitions

Out of scope:

- hero section changes
- changes to any effect above the final Origin phase
- changes to existing earlier Origin choreography
- glitch, particle burst, or HUD-style sci-fi effects

## Experience Sequence

1. The user scrolls through the existing Origin section as it works today.
2. The current zoom-out end scene appears and settles.
3. A restrained bloom pass lifts the brightest highlights in the scene.
4. A dark volumetric veil fades in over the full viewport.
5. The entire page resolves into a smooth black end state.

## Interaction and Motion Rules

- The blackout starts only after the current Origin zoom-out is established.
- The transition must be scrubbed to scroll, not time-only playback.
- The final darkening should feel continuous, with no hard cut.
- The effect should stay visually centered and full-bleed across desktop and mobile.
- The existing pointer response for the Origin end scene should not be altered before the blackout phase begins.

## Technical Design

### 1. Keep existing end scene timeline

The current Origin end-scene timeline remains the base.

- no changes to hero scroll sequence
- no changes to earlier Origin assembly markers
- no changes to existing end-scene entrance except where needed to hand off into blackout

### 2. Add blackout overlay layer

Introduce a full-screen overlay inside the Origin end-scene stack:

- covers the viewport
- starts transparent
- darkens progressively during the final scroll stretch
- uses layered gradients and soft radial falloff to create atmospheric depth

This layer provides the reliable non-WebGL visual base of the blackout.

### 3. Add bloom / glow layer

Introduce a lightweight glow layer that activates only in the final blackout segment:

- highlights bright scene areas briefly before they disappear
- remains restrained and low-noise
- can be implemented through either:
  - a small WebGL/canvas pass, or
  - a visually equivalent composited glow layer if WebGL would add too much risk

Preference:

- use the lightest implementation that achieves a premium result
- do not introduce heavy scene reconstruction or broad framework changes

### 4. ScrollTrigger handoff

Extend the existing final Origin timeline so the blackout is a dedicated last segment:

- segment A: current zoom-out
- segment B: bloom rise
- segment C: full-screen dark takeover

The Origin page should remain visually steady during this phase so the blackout reads as a controlled full-screen takeover.

## Reduced Motion

If reduced motion is enabled:

- skip bloom animation and depth-rich transitions
- keep a clean gradient fade into black
- preserve readability and continuity of the end state

## Validation

We should verify:

- no regressions to hero behavior
- Origin still pins correctly during its image sequence
- end scene still appears correctly before blackout starts
- blackout reaches a near-full black state at the end of scroll
- no visible white seam/gap appears during the final handoff
- build and current visual verification scripts continue to pass, with new checks added for the blackout state if needed

## Risks

- adding a transformed ancestor or overlay in the wrong place could break Origin pinning again
- over-aggressive bloom could feel cheap or game-like
- large WebGL work for a very short end beat could be unnecessary complexity

## Implementation Preference

Start with the safest premium architecture:

- preserve current layout and ScrollTrigger structure
- add blackout as a final overlay-driven phase
- add a restrained glow layer only for the last segment
- escalate to heavier WebGL only if the visual result is not premium enough with a lighter approach
