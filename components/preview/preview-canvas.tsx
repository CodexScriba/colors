"use client";

import { useMemo } from "react";
import { Sparkles } from "lucide-react";

import {
  useCardSettings,
  useContainerSettings,
  useLighting,
  useThemeTokens,
} from "@/components/providers";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { computeContainerSurfaceStyle } from "@/lib/container-style";
import {
  cardVariantOptions,
  computeCardSurfaceStyle,
  describeVariant,
} from "@/lib/card-style";
import { cn } from "@/lib/utils";

const statTiles = [
  { label: "Contrast checks", value: "12", delta: "+3" },
  { label: "Presets saved", value: "28", delta: "+5" },
  { label: "Active layers", value: "3", delta: "Stable" },
];

export function PreviewCanvas() {
  const { settings } = useContainerSettings();
  const { settings: cardSettings, updateSetting: updateCardSetting } =
    useCardSettings();
  const themeTokens = useThemeTokens();
  const lighting = useLighting();

  const surfaceStyle = useMemo(
    () => computeContainerSurfaceStyle(settings, themeTokens.container),
    [settings, themeTokens.container],
  );

  const cardPreviews = useMemo(() => {
    return cardVariantOptions.map(({ value, label }) => {
      const variantSettings =
        value === cardSettings.activeVariant
          ? cardSettings
          : { ...cardSettings, activeVariant: value };
      const style = computeCardSurfaceStyle(variantSettings);
      const descriptor = describeVariant(value);
      return {
        value,
        label,
        style,
        descriptor,
        isActive: value === cardSettings.activeVariant,
      };
    });
  }, [cardSettings]);

  const activeCard = cardPreviews.find((card) => card.isActive) ?? cardPreviews[0];

  return (
    <section className="order-1 flex min-h-[28rem] flex-col gap-6 rounded-3xl border border-border/40 bg-[hsl(var(--background)/0.35)] p-6 shadow-sm backdrop-blur-xl lg:order-2">
      <header className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Sparkles className="h-4 w-4 text-accent" aria-hidden />
            Preview Canvas
          </div>
          <div className="flex flex-wrap gap-2">
            {([
              { label: "Ambient", active: lighting.ambient },
              { label: "Directional", active: lighting.directional },
            ] as const).map((chip) => (
              <span
                key={chip.label}
                className={cn(
                  "inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs",
                  chip.active
                    ? "border-primary/40 bg-primary/10 text-primary"
                    : "border-border/60 text-muted-foreground",
                )}
              >
                <span className="h-2 w-2 rounded-full bg-current" aria-hidden />
                {chip.label}
              </span>
            ))}
          </div>
        </div>
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
            Container playground
          </h2>
          <p className="max-w-xl text-sm text-muted-foreground">
            Adjust gradient direction, lighting overlays, and structural tokens.
            Changes persist locally so you can pick up exactly where you left off.
          </p>
        </div>
      </header>

      <div className="relative flex flex-1 flex-col rounded-3xl border border-border/40 bg-[hsl(var(--container)/0.25)] p-1">
        <div
          className="relative flex h-full flex-col overflow-hidden border bg-[hsl(var(--container)/0.92)]"
          style={{
            backgroundImage: surfaceStyle.backgroundImage,
            borderRadius: surfaceStyle.borderRadius,
            borderWidth: surfaceStyle.borderWidth,
            boxShadow: surfaceStyle.boxShadow,
            borderColor: "hsl(var(--container-border))",
            color: "hsl(var(--container-foreground))",
          }}
        >
          {settings.showGuides ? (
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 mix-blend-overlay opacity-50"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
                backgroundSize: "24px 24px",
              }}
            />
          ) : null}

          <div className="relative grid flex-1 gap-8 p-8 lg:grid-cols-[1.3fr_1fr]">
            <div className="space-y-6">
              <div className="space-y-3">
                <Badge variant="secondary" className="rounded-full border border-border/60">
                  Container layer
                </Badge>
                <h3 className="text-3xl font-semibold tracking-tight">
                  Elevated surfaces without sacrificing calm
                </h3>
                <p className="max-w-xl text-sm text-muted-foreground">
                  Explore how gradients, borders, and soft lighting intersect to
                  create a resilient container system. Every adjustment is reflected
                  here immediately.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button size="sm">Primary action</Button>
                <Button size="sm" variant="outline">
                  Secondary
                </Button>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                {statTiles.map((tile) => (
                  <div
                    key={tile.label}
                    className="rounded-2xl border border-border/60 bg-[hsl(var(--card)/0.85)] px-4 py-5 backdrop-blur"
                  >
                    <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                      {tile.label}
                    </p>
                    <p className="mt-2 text-2xl font-semibold">{tile.value}</p>
                    <p className="text-xs text-accent">{tile.delta}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div
                className="relative overflow-hidden rounded-2xl border p-6 shadow-lg transition-shadow"
                style={{
                  backgroundImage: activeCard?.style.backgroundImage,
                  borderRadius: activeCard?.style.borderRadius,
                  borderWidth: activeCard?.style.borderWidth,
                  borderColor: activeCard?.style.borderColor,
                  borderStyle: "solid",
                  boxShadow: activeCard?.style.boxShadow,
                  color: activeCard?.style.textColor,
                }}
              >
                {cardSettings.showGuides ? (
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 mix-blend-overlay opacity-50"
                    style={{
                      backgroundImage:
                        "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
                      backgroundSize: "18px 18px",
                    }}
                  />
                ) : null}

                <div className="relative space-y-4">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-[0.28em]">
                    <span
                      className="inline-flex h-2 w-2 rounded-full"
                      style={{ backgroundColor: activeCard?.style.accentColor }}
                    />
                    {activeCard?.label}
                  </div>
                  <h4 className="text-xl font-semibold tracking-tight">
                    {activeCard?.descriptor.label} showcase
                  </h4>
                  <p className="text-sm text-white/70">
                    Crafted with {activeCard?.descriptor.accentColor} accents and
                    responsive shadows. Adjust angle, radius, and depth from the
                    inspector to watch this card reshape.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Button
                      size="sm"
                      style={{
                        backgroundColor: "transparent",
                        borderColor: activeCard?.style.accentColor,
                        color: activeCard?.style.accentColor,
                      }}
                      variant="outline"
                    >
                      Try preset
                    </Button>
                    <Button size="sm" variant="secondary">
                      Duplicate
                    </Button>
                  </div>
                  <Separator className="border-white/10" />
                  <dl className="grid gap-2 text-xs text-white/70">
                    <div className="flex justify-between">
                      <dt>Border radius</dt>
                      <dd>{Math.round(cardSettings.borderRadius)}px</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt>Shadow preset</dt>
                      <dd className="capitalize">{cardSettings.shadowPreset}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt>Gradient angle</dt>
                      <dd>{Math.round(cardSettings.gradientAngle)}°</dd>
                    </div>
                  </dl>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {cardPreviews.map((preview) => (
                  <div
                    key={preview.value}
                    className={cn(
                      "relative overflow-hidden rounded-2xl border p-4 text-sm transition-all",
                      preview.isActive
                        ? "ring-2 ring-primary/60"
                        : "border-border/60 opacity-85",
                    )}
                    style={{
                      backgroundImage: preview.style.backgroundImage,
                      borderRadius: preview.style.borderRadius,
                      borderWidth: preview.style.borderWidth,
                      borderColor: preview.style.borderColor,
                      borderStyle: "solid",
                      boxShadow: preview.style.boxShadow,
                      color: preview.style.textColor,
                    }}
                  >
                    {cardSettings.showGuides ? (
                      <span
                        aria-hidden
                        className="pointer-events-none absolute inset-0 mix-blend-overlay opacity-40"
                        style={{
                          backgroundImage:
                            "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)",
                          backgroundSize: "16px 16px",
                        }}
                      />
                    ) : null}
                    <div className="relative space-y-3">
                      <p className="text-xs uppercase tracking-[0.28em]">
                        {preview.label}
                      </p>
                      <p className="text-xs text-white/75">
                        Accent {preview.descriptor.accentColor}
                      </p>
                      <Button
                        size="sm"
                        variant="secondary"
                        className="h-7 text-xs"
                        onClick={() =>
                          updateCardSetting("activeVariant", preview.value)
                        }
                      >
                        Activate
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <Card className="rounded-2xl border border-border/50 bg-[hsl(var(--card)/0.92)] p-6 shadow-none backdrop-blur">
                <h4 className="text-base font-semibold">Surface notes</h4>
                <p className="mt-2 text-sm text-muted-foreground">
                  Pair container gradients with card accents to keep hierarchy
                  clear. Use floating shadows sparingly and dial border width down
                  when stacking multiple cards inside the same container.
                </p>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
