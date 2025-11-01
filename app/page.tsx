import { PreviewCanvas } from "@/components/preview/preview-canvas";
import { VariablesInspector } from "@/components/inspector/variables-inspector";

export default function Home() {
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-16 px-4 pb-16 pt-12 md:px-6 lg:px-8">
      <section className="mx-auto grid max-w-3xl gap-5 text-center">
        <p className="text-sm font-medium uppercase tracking-[0.35em] text-accent">
          Layered color systems
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl md:text-6xl">
          Build luminous surfaces with confidence
        </h1>
        <p className="text-balance text-base text-muted-foreground sm:text-lg">
          Colors stitches gradients, borders, shadows, and lighting together so
          you can orchestrate background, container, and card layers without
          losing accessibility or harmony.
        </p>
      </section>

      <section className="grid gap-8 lg:grid-cols-[clamp(320px,28vw,380px)_1fr] lg:items-start">
        <VariablesInspector />
        <PreviewCanvas />
      </section>

      <section className="mx-auto grid max-w-4xl gap-6 text-center text-sm text-muted-foreground">
        <p>
          Container settings persist in your browser so you can iterate across
          sessions. Upcoming layers will wire Buttons, Backgrounds, Cards, and
          Effects into the same tooling for end-to-end palette control.
        </p>
        <p>
          Need to start over? Use the toolbar reset actions or toggle ambient and
          directional lighting independently to study how each pass influences the
          hierarchy.
        </p>
      </section>
    </div>
  );
}
