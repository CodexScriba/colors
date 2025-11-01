# Colors – Layered Delivery Plan

> **Scope of this document**
>
> The delivery plan tracks future or in-progress work. Anything already implemented is documented in `docs/architecture.md`.

## Background Context
- Built on Next.js App Router with React 19 and TypeScript 5 for strongly typed UI flows.
- Tailwind CSS and shadcn/ui supply the composable surface primitives; ThemeProvider in `components/providers.tsx` orchestrates light/dark switching.
- Bun scripts (`bun run dev|build|start`) drive local workflows across environments.
- Global tokens in `app/globals.css` now cover gradients, borders, shadows, and lighting accents; `lib/theme-tokens.ts` exposes a typed registry for all visual layers.

## Hierarchy Blueprint
- **Background Layer** – Page-level paint, typography, noise/texture, global gradients, and lighting washes derived from `--background`, `--background-gradient`, and glow tokens.
- **Container Layer** – Structural shells such as the Variables Inspector and Preview Canvas, controlled by `--container`, `--container-gradient`, border weights, and container shadow tokens.
- **Card Layer** – Reusable blocks (forms, action cards, data previews) with per-card gradients, borders, shadows, and lighting cues built from `components/ui/card.tsx`, chart primitives, and effect tokens.

## Interaction Controls & Navigation Overview
- Global toolbar (within Variables Inspector) hosts `Copy Palette`, `Copy Preview Snapshot`, `Copy Card Style`, `Reset All`, and layer-scoped `Reset Background/Containers/Cards` buttons.
- Buttons emit toast feedback via Sonner and land inside the Variables Inspector header for muscle-memory access; keyboard shortcuts (`⌘/Ctrl+C` for palette, `⇧⌘/Ctrl+R` for reset) dispatched through the same action layer.
- Copy Palette assembles HEX, HSL, CSS variable, and gradient snippets; Copy Card Style exports borders, shadows, and lighting metadata for the targeted card.
- Application shell provides a navigation bar with quick links: `Home`, `Buttons`, `Backgrounds`, `Cards`, `Effects`, and `Tokens`. Each link routes to a dedicated editing view while sharing the same ThemeProvider and persistence layer.
- Home view summarizes token status, recent presets, and highlights recently modified sections; deep pages expose granular controls (e.g., Buttons page for state-by-state styling, Backgrounds page for gradient and lighting editors).

## Layered Roadmap

### Layer 0 – Strategy & Alignment
- Confirm scope, success metrics, and stakeholder priorities using architecture guidance.
- Align on naming conventions for gradients (`bg`, `container`, `card`) and lighting tokens (`ambient`, `directional`, `highlight`).
- Decide how light/dark editing toggles behave within ThemeProvider and layout, including gradient dual values.
- Finalize accessibility and performance targets (WCAG AA/AAA, repaint budgets) and documentation plan.

Deliverables:
- Signed-off scope doc, token taxonomy (colors + effects), timeline, and risk register.

Acceptance:
- Stakeholders agree on hierarchy goals, effect tokens to expose, and success metrics for copy/reset tooling.

### Layer 2 – Container System
- Build Variables Inspector frame with grouped sections (Base, Surfaces, Actions, Feedback, Chrome, Data Viz) and an action toolbar for Copy/Reset buttons.
- Compose Preview Canvas shell: page background → container surface → card grid scaffolding, supporting gradient overlays, adjustable border radii/widths, and container shadow presets (ambient, lifted, inset).
- Implement lighting toggles per container (spotlight highlight for focused panels, soft glow for inactive states).
- Ensure responsive split layout, keyboard navigation between panes, and persisted container effect settings.

Deliverables:
- `VariablesInspector` container and `PreviewCanvas` shell with gradient/border/shadow configuration panels, toolbar buttons wired, and lighting controls.

Acceptance:
- Containers resize gracefully, respond to gradient/border/shadow edits in real time, lighting transitions remain smooth, and toolbar buttons update state without layout shifts.

### Layer 3 – Card System
- Implement card variants (primary, subdued, data viz) using `components/ui/card.tsx` with per-card gradient presets (linear, radial, conic) and blend modes.
- Expose border controls (width, style, color accent) and shadow depth tiers (`--shadow-card-soft`, `--shadow-card-hard`, `--shadow-card-floating`) with lighting highlights for hover/active states.
- Populate cards with representative UI (buttons, inputs, badges, tables, charts, media swatches) demonstrating gradient overlays, shadows, and lighting interplay.
- Assemble a content strip inside the Preview Canvas featuring: hero header, KPI cards, form block, data table, and media gallery so users observe real-time token propagation across varied content densities.
- Instrument the content strip with inspector bindings and hovering aids (token tags, contrast callouts) to clarify which background/container/card tokens drive each region.
- Add card-level Copy Style button for quickly exporting gradient stops, border configs, shadow matrix, and lighting metadata.
- Create dedicated Button Workshop view (accessible via navbar) with folders for global button variables (radii, padding), state tokens (default, hover, focus, disabled), and icon/button hybrids. Mirror this folder structure in the inspector to keep controls organized by use-case.
- Create Background Studio view with folders for gradients, lighting scripts, and texture overlays, offering presets, custom stop editors, and per-page overrides.
- Create Card Lab view with folders for layout templates, border/shadow presets, and content modules, enabling quick experimentation and saving of card archetypes.

Deliverables:
- A curated set of preview cards wired to live theme tokens, effect editors, and copy controls.

Acceptance:
- Editing tokens for gradients, borders, shadows, and lighting reflects instantly in preview cards; Copy Card Style outputs accurate CSS and token references.

### Layer 4 – Feedback & Accessibility
- Compute WCAG contrast for text-on-surface pairs, border-on-background visibility, and gradient-on-text legibility; account for lighting overlays that may affect perceived contrast.
- Display inline indicators adjacent to tokens and preview cards (pass/fail, ratio) with callouts when gradients or lighting diminish readability.
- Respect `prefers-reduced-motion` and provide reduced lighting mode (disabling pulsing/glow animations while retaining static highlights).
- Add quick-fix suggestions (e.g., nudge gradient midpoint, increase shadow alpha, adjust border contrast) when standards are not met.

Deliverables:
- `useContrast` utility expanded for gradients, inline indicators, lighting safety checks, and suggestion engine.

Acceptance:
- Accurate AA/AAA reporting with actionable guidance, no layout shifts, and warnings triggered for gradient or lighting conflicts.

### Layer 5 – State & Copy Workflows
- Model theme state with undo/redo stack covering color, gradient, border, shadow, lighting tokens, and toolbar button interactions.
- Implement preset save/load (localStorage first) plus import/export (JSON + CSS snippet) capturing gradient definitions, shadow matrices, and lighting modes.
- Add reset-to-default pathways: global Reset All, layer-specific resets (Background/Container/Card), and contextual Reset on each token group.
- Build Copy Palette workflows: aggregate HEX, HSL, CSS variables, gradient declarations, box-shadow values, and lighting metadata; provide Copy Preview Snapshot (HTML + inline styles) for demo handoff.
- Persist per-view settings so Button Workshop, Background Studio, and Card Lab remember last opened folders, selected presets, and preview states.

Deliverables:
- `ThemeState` store, persistence adapters, export helpers, copy/reset button wiring, and shortcut handlers.

Acceptance:
- Users can reliably save, switch, revert, copy, and export configurations; reset operations leave history intact, and clipboard payloads match visible state.

### Layer 6 – Integrations & Plumbing (Optional)
- Prepare interfaces for future cloud storage, leaving implementation hooks for palette/effects sync.
- Document expectations for auth/persistence once a backend is selected, including gradient/border/shadow schema requirements.
- Integrate toast notifications (Sonner) to confirm Copy/Reset/Save actions, highlight validation errors (e.g., malformed gradient), and surface shadow/lighting tips.

Deliverables:
- Feature flag scaffolding, UX copy, and messaging for deferred integrations plus feedback hooks for action buttons.

Acceptance:
- Cloud pathways are documented without blocking local workflows; UX messaging clearly communicates copy/reset outcomes and effect validation.

### Layer 7 – QA & Testing
- Unit: token parsing, gradient stop serialization, contrast math, undo/redo logic.
- Component: inspector inputs, toolbar buttons, container responsiveness, card effect rendering.
- E2E: edit gradients/borders/shadows → copy palette → reset layers → reload → export → re-import → navigate to Buttons/Backgrounds/Cards pages and validate per-view folder persistence.
- Accessibility review: keyboard traversal (including toolbar buttons and navbar links), ARIA labels for effect editors, focus rings visible under lighting overlays, and descriptive labels for folder switches.

Deliverables:
- Automated test suite, manual QA checklist, accessibility notes with emphasis on gradients/shadows/lighting scenarios.

Acceptance:
- Tests pass; critical accessibility and hierarchy flows validated; toolbar buttons operable via keyboard and screen readers.

### Layer 8 – Performance & Polish
- Measure editing latency (token change → repaint) for gradients, shadow recomputations, and lighting transitions; optimize hot paths.
- Debounce expensive operations, memoize derived gradient maps, and batch shadow matrix updates.
- Review bundle size; code-split inspector effect editors and preview states as needed.
- Add micro-interactions (button feedback, lighting pulses) that respect reduced-motion preferences and provide tactile response for copy/reset buttons.

Deliverables:
- Performance audit notes, targeted optimizations, and polished interactions.

Acceptance:
- Interactions feel instant; lighting and gradient transitions remain smooth on typical hardware; copy/reset buttons respond within 100ms.

### Layer 9 – Release Enablement
- Update `docs/architecture.md` with layered hierarchy decisions, effect token taxonomy, toolbar behaviors, and navigation structure (Home, Buttons, Backgrounds, Cards, Effects, Tokens).
- Produce usage guide covering background/container/card setup, gradient/shadow recipes, copy/reset workflows, folder organization, and navigation tips.
- Record decisions in `docs/decisions.md` as needed; prep changelog, demo assets (GIFs showing gradients, lighting, and per-view edits), and release checklist.

Deliverables:
- Documentation refresh, release notes, visual walkthrough including effect examples.

Acceptance:
- New contributors understand the hierarchy, effect system, and action controls; release assets published with clear copy instructions.

---

## Token Groups (Current Focus)
- Background: `--background`, `--background-fallback`, `--background-gradient`, `--foreground`, `--glow-ambient`, `--glow-directional`
- Containers: `--container`, `--container-foreground`, `--container-gradient`, `--container-border`, `--container-border-strong`, `--container-shadow-ambient`, `--container-shadow-lifted`, `--container-shadow-inset`
- Cards & Content: `--card`, `--card-foreground`, `--card-gradient`, `--card-border`, `--card-shadow-soft`, `--card-shadow-hard`, `--card-shadow-floating`, `--primary`, `--primary-foreground`, `--secondary`, `--secondary-foreground`, `--accent`, `--accent-foreground`
- Feedback: `--destructive`, `--destructive-foreground`, `--border`, `--border-strong`, `--input`, `--ring`
- Data Viz: `--chart-1` … `--chart-5`

## Gradient, Border, and Shadow Presets
- Background presets: Dawn Fade (linear), Midnight Radial, Nebula Noise overlay.
- Container presets: Neutral Lift (soft shadow + subtle gradient), Frosted Glass (blur + inset border), Spotlight (directional glow).
- Card presets: Action Pop (accent gradient, crisp border), Data Depth (layered shadows), Quiet Surface (muted gradient, low-contrast border).

## Milestones
- M1: Strategy & Background system ready (Layers 0–1) with initial gradients and lighting tokens.
- M2: Containers and initial cards live (Layers 2–3) including effect editors and toolbar wiring.
- M3: Accessibility and state management (Layers 4–5) validating gradients/borders/shadows and copy/reset flows.
- M4: Optional integrations plus QA/performance (Layers 6–8) polishing interactions and preparing future sync.
- M5: Documentation & release enablement (Layer 9) with effect recipes and action button guidance.

## Risks & Mitigations
- Layer drift between background/container/card effects: add snapshot tests per layer and cross-layer visual checks.
- Invalid gradient or shadow inputs causing rendering glitches: enforce schema validation with inline fallbacks and linting hints.
- Performance degradation during rapid edits: profile, memoize derived tokens, batch gradient/shadow computations, and limit lighting redraw frequency.
- Accessibility regressions from lighting overlays: use high-contrast focus rings, provide reduced-lighting mode, and run keyboard audits each milestone.

## Timeline (Indicative)
- Week 1: Layers 0–2 (planning, background system, container shells with effect editors)
- Week 2: Layer 3 (cards) and Layer 4 (contrast + lighting safety)
- Week 3: Layer 5 (persistence + copy/reset tooling) plus targeted QA
- Week 4: Layer 6 (deferred integrations), Layers 7–9 (tests, performance polish, docs, release)

## Acceptance Summary
- Background, container, and card layers present clear visual hierarchy with gradients, borders, shadows, and lighting tuned per layer.
- Toolbar buttons enable copy palette/style, preview capture, and reset operations with immediate feedback and shortcut support.
- Users receive actionable accessibility guidance accounting for gradients and lighting.
- Presets, history, exports, and copy flows operate reliably; documentation captures the full effect system for future iterations.
