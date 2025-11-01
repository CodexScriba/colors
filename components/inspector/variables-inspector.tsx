"use client";

import { useCallback, useMemo } from "react";
import {
  Camera,
  Copy,
  Layers,
  Palette,
  RefreshCw,
  Sparkles,
  SunMedium,
} from "lucide-react";
import { toast } from "sonner";

import {
  useCardSettings,
  useContainerSettings,
  useLighting,
  useThemeTokens,
} from "@/components/providers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { type ContainerSettings } from "@/lib/container-settings";
import {
  computeContainerSurfaceStyle,
  containerShadowOptions,
  formatContainerCss,
} from "@/lib/container-style";
import { type CardSettings, type CardVariant } from "@/lib/card-settings";
import {
  cardShadowOptions,
  cardVariantOptions,
  computeCardSurfaceStyle,
  describeVariant,
  formatCardCss,
} from "@/lib/card-style";

type InspectorSectionProps = {
  title: string;
  description?: string;
  children: React.ReactNode;
};

const InspectorSection = ({
  title,
  description,
  children,
}: InspectorSectionProps) => (
  <section
    aria-labelledby={title.toLowerCase().replace(/\s+/g, "-")}
    className="space-y-4"
  >
    <header className="space-y-1">
      <h3
        id={title.toLowerCase().replace(/\s+/g, "-")}
        className="text-sm font-semibold tracking-wide text-foreground"
      >
        {title}
      </h3>
      {description ? (
        <p className="text-xs text-muted-foreground">{description}</p>
      ) : null}
    </header>
    <div className="grid gap-4">{children}</div>
  </section>
);

const copyText = async (label: string, payload: string) => {
  try {
    await navigator.clipboard.writeText(payload);
    toast.success(`${label} copied to clipboard`);
  } catch (error) {
    console.error(`Failed to copy ${label}`, error);
    toast.error(`Unable to copy ${label}`);
  }
};

const getComputedCssVar = (variable: string) => {
  if (typeof window === "undefined") {
    return "";
  }

  const style = getComputedStyle(document.documentElement);
  return style.getPropertyValue(variable).trim();
};

const containerPaletteTokens = [
  "--container",
  "--container-gradient",
  "--container-border",
  "--container-border-strong",
  "--container-shadow-ambient",
  "--container-shadow-lifted",
  "--container-shadow-inset",
  "--muted",
  "--muted-foreground",
];

const containerPaletteLabelMap: Record<string, string> = {
  "--container": "Surface base",
  "--container-gradient": "Surface gradient",
  "--container-border": "Soft border",
  "--container-border-strong": "Strong border",
  "--container-shadow-ambient": "Ambient shadow",
  "--container-shadow-lifted": "Lifted shadow",
  "--container-shadow-inset": "Inset shadow",
  "--muted": "Muted surface",
  "--muted-foreground": "Muted foreground",
};

const cardPaletteTokens = [
  "--card",
  "--card-gradient",
  "--card-border",
  "--card-shadow-soft",
  "--card-shadow-hard",
  "--card-shadow-floating",
  "--card-foreground",
  "--accent",
  "--accent-foreground",
];

const cardPaletteLabelMap: Record<string, string> = {
  "--card": "Card base",
  "--card-gradient": "Card gradient",
  "--card-border": "Card border",
  "--card-shadow-soft": "Soft shadow",
  "--card-shadow-hard": "Hard shadow",
  "--card-shadow-floating": "Floating shadow",
  "--card-foreground": "Card foreground",
  "--accent": "Accent",
  "--accent-foreground": "Accent foreground",
};

const ToolbarButton = ({
  icon: Icon,
  label,
  onClick,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick: () => void;
}) => (
  <Button
    type="button"
    variant="outline"
    size="sm"
    className="gap-2"
    onClick={onClick}
  >
    <Icon className="h-4 w-4" aria-hidden />
    <span>{label}</span>
  </Button>
);

const copyPaletteTokens = (
  tokens: string[],
  labelMap: Record<string, string>,
  label: string,
) => {
    const lines = tokens.map((token) => {
      const value = getComputedCssVar(token);
      if (!value) {
        return null;
      }
      const friendly = labelMap[token] ?? token;
      return `/* ${friendly} */\n${token}: ${value};`;
    });

    const payload = lines.filter(Boolean).join("\n\n");
    void copyText(label, payload);
  };

const ContainerPanel = () => {
  const { settings, updateSetting, reset } = useContainerSettings();
  const {
    ambient,
    directional,
    toggleAmbient,
    toggleDirectional,
    setAmbient,
    setDirectional,
  } = useLighting();
  const tokens = useThemeTokens();

  const surfaceStyle = useMemo(
    () => computeContainerSurfaceStyle(settings, tokens.container),
    [settings, tokens.container],
  );

  const handleCopyPalette = useCallback(() => {
    copyPaletteTokens(
      containerPaletteTokens,
      containerPaletteLabelMap,
      "container palette",
    );
  }, []);

  const handleCopyContainerStyle = useCallback(() => {
    const payload = formatContainerCss(surfaceStyle);
    void copyText("container style", payload);
  }, [surfaceStyle]);

  const handleCopySnapshot = useCallback(() => {
    const inlineStyle = formatContainerCss(surfaceStyle)
      .split("\n")
      .map((line) => line.trim())
      .join(" ");

    const snippet = `<div class="container-surface" style="${inlineStyle}">\n  <!-- preview content -->\n</div>`;
    void copyText("preview snapshot", snippet);
  }, [surfaceStyle]);

  const handleResetAll = useCallback(() => {
    reset();
    setAmbient(true);
    setDirectional(true);
    toast.success("Container settings reset");
  }, [reset, setAmbient, setDirectional]);

  const handleResetContainer = useCallback(() => {
    reset();
    toast.success("Container variables restored");
  }, [reset]);

  const handleOverlayChange = useCallback(
    (value: number[]) => {
      updateSetting("overlayOpacity", value[0] / 100);
    },
    [updateSetting],
  );

  const handleBorderRadius = useCallback(
    (value: number[]) => {
      updateSetting("borderRadius", value[0]);
    },
    [updateSetting],
  );

  const handleBorderWidth = useCallback(
    (value: number[]) => {
      updateSetting("borderWidth", value[0]);
    },
    [updateSetting],
  );

  const handleGradientAngle = useCallback(
    (value: number[]) => {
      updateSetting("gradientAngle", value[0]);
    },
    [updateSetting],
  );

  const overlayValue = Math.round(settings.overlayOpacity * 100);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-2" aria-label="Container toolbar">
        <ToolbarButton
          icon={Palette}
          label="Copy Palette"
          onClick={handleCopyPalette}
        />
        <ToolbarButton
          icon={Copy}
          label="Copy Container Style"
          onClick={handleCopyContainerStyle}
        />
        <ToolbarButton
          icon={Camera}
          label="Copy Preview Snapshot"
          onClick={handleCopySnapshot}
        />
        <ToolbarButton
          icon={RefreshCw}
          label="Reset Container"
          onClick={handleResetContainer}
        />
        <ToolbarButton icon={SunMedium} label="Reset All" onClick={handleResetAll} />
      </div>

      <Separator />

      <div className="space-y-8" role="group" aria-label="Container controls">
        <InspectorSection
          title="Base"
          description="Set the structural envelope for containers."
        >
          <div className="grid gap-3">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
              <div>
                <Label htmlFor="container-radius">Corner radius</Label>
                <Slider
                  id="container-radius"
                  min={4}
                  max={84}
                  step={2}
                  value={[settings.borderRadius]}
                  onValueChange={handleBorderRadius}
                  aria-label="Container corner radius"
                />
              </div>
              <Input
                readOnly
                value={`${settings.borderRadius}px`}
                className="h-9 w-20 text-right text-sm"
              />
            </div>

            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
              <div>
                <Label htmlFor="container-border-width">Border width</Label>
                <Slider
                  id="container-border-width"
                  min={0}
                  max={8}
                  step={1}
                  value={[settings.borderWidth]}
                  onValueChange={handleBorderWidth}
                  aria-label="Container border width"
                />
              </div>
              <Input
                readOnly
                value={`${settings.borderWidth}px`}
                className="h-9 w-20 text-right text-sm"
              />
            </div>
          </div>
        </InspectorSection>

        <InspectorSection
          title="Surfaces"
          description="Control gradient direction and overlays."
        >
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
            <div>
              <Label htmlFor="container-gradient-angle">Gradient angle</Label>
              <Slider
                id="container-gradient-angle"
                min={0}
                max={360}
                step={5}
                value={[Math.round(settings.gradientAngle)]}
                onValueChange={handleGradientAngle}
                aria-label="Container gradient angle"
              />
            </div>
            <Input
              readOnly
              value={`${Math.round(settings.gradientAngle)}°`}
              className="h-9 w-20 text-right text-sm"
            />
          </div>

          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
            <div>
              <Label htmlFor="container-overlay">Lighting overlay</Label>
              <Slider
                id="container-overlay"
                min={0}
                max={72}
                step={4}
                value={[overlayValue]}
                onValueChange={handleOverlayChange}
                aria-label="Lighting overlay opacity"
              />
            </div>
            <Input
              readOnly
              value={`${overlayValue}%`}
              className="h-9 w-20 text-right text-sm"
            />
          </div>
        </InspectorSection>

        <InspectorSection
          title="Actions"
          description="Pick shadow behavior and lighting toggles."
        >
          <div className="grid gap-3">
            <div className="grid gap-1.5">
              <Label htmlFor="container-shadow">Shadow preset</Label>
              <Select
                value={settings.shadowPreset}
                onValueChange={(value) =>
                  updateSetting(
                    "shadowPreset",
                    value as ContainerSettings["shadowPreset"],
                  )
                }
              >
                <SelectTrigger id="container-shadow" className="h-9">
                  <SelectValue placeholder="Select preset" />
                </SelectTrigger>
                <SelectContent>
                  {containerShadowOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex flex-col">
                        <span className="font-medium capitalize">{option.value}</span>
                        <span className="text-xs text-muted-foreground">
                          {option.shadow}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <div className="flex items-center justify-between gap-3 rounded-2xl border border-border/60 px-3 py-2">
                <div>
                  <p className="text-sm font-medium">Ambient pass</p>
                  <p className="text-xs text-muted-foreground">
                    Soft glow for inactive surfaces
                  </p>
                </div>
                <Switch
                  checked={ambient}
                  onCheckedChange={toggleAmbient}
                  aria-label="Toggle ambient lighting"
                />
              </div>
              <div className="flex items-center justify-between gap-3 rounded-2xl border border-border/60 px-3 py-2">
                <div>
                  <p className="text-sm font-medium">Directional pass</p>
                  <p className="text-xs text-muted-foreground">
                    Focused highlight for emphasis
                  </p>
                </div>
                <Switch
                  checked={directional}
                  onCheckedChange={toggleDirectional}
                  aria-label="Toggle directional lighting"
                />
              </div>
            </div>
          </div>
        </InspectorSection>

        <InspectorSection
          title="Feedback"
          description="Visual guides to assist with alignment."
        >
          <div className="flex items-center justify-between gap-3 rounded-2xl border border-border/60 px-3 py-2">
            <div>
              <p className="text-sm font-medium">Show grid guides</p>
              <p className="text-xs text-muted-foreground">
                Displays subtle grid overlay on the preview surface.
              </p>
            </div>
            <Switch
              checked={settings.showGuides}
              onCheckedChange={(value) => updateSetting("showGuides", value)}
              aria-label="Toggle grid guides"
            />
          </div>
        </InspectorSection>
      </div>
    </div>
  );
};

const CardPanel = () => {
  const { settings, updateSetting, reset } = useCardSettings();
  const surfaceStyle = useMemo(
    () => computeCardSurfaceStyle(settings),
    [settings],
  );
  const descriptor = useMemo(
    () => describeVariant(settings.activeVariant),
    [settings.activeVariant],
  );

  const handleCopyPalette = useCallback(() => {
    copyPaletteTokens(cardPaletteTokens, cardPaletteLabelMap, "card palette");
  }, []);

  const handleCopyCardStyle = useCallback(() => {
    const payload = formatCardCss(surfaceStyle);
    void copyText("card style", payload);
  }, [surfaceStyle]);

  const handleCopySnapshot = useCallback(() => {
    const inlineStyle = formatCardCss(surfaceStyle)
      .split("\n")
      .map((line) => line.trim())
      .join(" ");

    const snippet = `<article class="card-surface" style="${inlineStyle}">\n  <!-- card content -->\n</article>`;
    void copyText("card snapshot", snippet);
  }, [surfaceStyle]);

  const handleReset = useCallback(() => {
    reset();
    toast.success("Card settings reset");
  }, [reset]);

  const handleVariantChange = useCallback(
    (value: CardVariant) => {
      updateSetting("activeVariant", value);
    },
    [updateSetting],
  );

  const handleBorderRadius = useCallback(
    (value: number[]) => {
      updateSetting("borderRadius", value[0]);
    },
    [updateSetting],
  );

  const handleBorderWidth = useCallback(
    (value: number[]) => {
      updateSetting("borderWidth", value[0]);
    },
    [updateSetting],
  );

  const handleGradientAngle = useCallback(
    (value: number[]) => {
      updateSetting("gradientAngle", value[0]);
    },
    [updateSetting],
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-2" aria-label="Card toolbar">
        <ToolbarButton
          icon={Palette}
          label="Copy Palette"
          onClick={handleCopyPalette}
        />
        <ToolbarButton
          icon={Copy}
          label="Copy Card Style"
          onClick={handleCopyCardStyle}
        />
        <ToolbarButton
          icon={Sparkles}
          label="Copy Snapshot"
          onClick={handleCopySnapshot}
        />
        <ToolbarButton
          icon={RefreshCw}
          label="Reset Card"
          onClick={handleReset}
        />
      </div>

      <Separator />

      <div className="space-y-8" role="group" aria-label="Card controls">
        <InspectorSection
          title="Variants"
          description="Select card archetypes and layout scaffolding."
        >
          <div className="grid gap-3">
            <div className="grid gap-1.5">
              <Label htmlFor="card-variant">Card variant</Label>
              <Select
                value={settings.activeVariant}
                onValueChange={(value) =>
                  handleVariantChange(value as CardVariant)
                }
              >
                <SelectTrigger id="card-variant" className="h-9">
                  <SelectValue placeholder="Select variant" />
                </SelectTrigger>
                <SelectContent>
                  {cardVariantOptions.map((option) => {
                    const variantDescriptor = describeVariant(option.value);
                    return (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex flex-col text-left">
                          <span className="font-medium capitalize">{option.label}</span>
                          <span className="text-xs text-muted-foreground">
                            Accent: {variantDescriptor.accentColor}
                          </span>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
          </div>
        </InspectorSection>

        <InspectorSection
          title="Structure"
          description="Tweak radius, borders, and gradient direction."
        >
          <div className="grid gap-3">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
              <div>
                <Label htmlFor="card-radius">Corner radius</Label>
                <Slider
                  id="card-radius"
                  min={4}
                  max={64}
                  step={2}
                  value={[settings.borderRadius]}
                  onValueChange={handleBorderRadius}
                  aria-label="Card corner radius"
                />
              </div>
              <Input
                readOnly
                value={`${settings.borderRadius}px`}
                className="h-9 w-20 text-right text-sm"
              />
            </div>

            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
              <div>
                <Label htmlFor="card-border-width">Border width</Label>
                <Slider
                  id="card-border-width"
                  min={0}
                  max={6}
                  step={1}
                  value={[settings.borderWidth]}
                  onValueChange={handleBorderWidth}
                  aria-label="Card border width"
                />
              </div>
              <Input
                readOnly
                value={`${settings.borderWidth}px`}
                className="h-9 w-20 text-right text-sm"
              />
            </div>

            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
              <div>
                <Label htmlFor="card-gradient-angle">Gradient angle</Label>
                <Slider
                  id="card-gradient-angle"
                  min={0}
                  max={360}
                  step={5}
                  value={[Math.round(settings.gradientAngle)]}
                  onValueChange={handleGradientAngle}
                  aria-label="Card gradient angle"
                />
              </div>
              <Input
                readOnly
                value={`${Math.round(settings.gradientAngle)}°`}
                className="h-9 w-20 text-right text-sm"
              />
            </div>
          </div>
        </InspectorSection>

        <InspectorSection
          title="Effects"
          description="Choose depth and alignment aids."
        >
          <div className="grid gap-3">
            <div className="grid gap-1.5">
              <Label htmlFor="card-shadow">Shadow preset</Label>
              <Select
                value={settings.shadowPreset}
                onValueChange={(value) =>
                  updateSetting(
                    "shadowPreset",
                    value as CardSettings["shadowPreset"],
                  )
                }
              >
                <SelectTrigger id="card-shadow" className="h-9">
                  <SelectValue placeholder="Select shadow" />
                </SelectTrigger>
                <SelectContent>
                  {cardShadowOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex flex-col">
                        <span className="font-medium capitalize">{option.value}</span>
                        <span className="text-xs text-muted-foreground">
                          {option.shadow}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between gap-3 rounded-2xl border border-border/60 px-3 py-2">
              <div>
                <p className="text-sm font-medium">Show layout guides</p>
                <p className="text-xs text-muted-foreground">
                  Reveals a fine grid overlay on card previews.
                </p>
              </div>
              <Switch
                checked={settings.showGuides}
                onCheckedChange={(value) => updateSetting("showGuides", value)}
                aria-label="Toggle card guides"
              />
            </div>
          </div>
        </InspectorSection>
      </div>
    </div>
  );
};

export function VariablesInspector() {
  return (
    <aside
      className="order-2 flex h-full flex-col gap-6 rounded-3xl border border-border/50 bg-[hsl(var(--background)/0.45)] p-6 backdrop-blur-xl lg:order-1 lg:max-h-[calc(100vh-10rem)] lg:overflow-y-auto"
      tabIndex={0}
      aria-label="Variables Inspector"
    >
      <header className="space-y-2">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold tracking-tight">Variables Inspector</h2>
          <span className="inline-flex items-center gap-1 rounded-full border border-border/60 px-3 py-1 text-xs text-muted-foreground">
            <Layers className="h-3.5 w-3.5" aria-hidden />
            Layers
          </span>
        </div>
        <p className="text-sm text-muted-foreground">
          Tune surface tokens, gradients, and lighting. Copy snippets or reset
          states as you iterate across container and card layers.
        </p>
      </header>

      <Tabs defaultValue="container" className="space-y-6">
        <TabsList className="grid grid-cols-2 gap-2 rounded-full bg-muted/60 p-1 text-xs">
          <TabsTrigger value="container" className="rounded-full px-3 py-2">
            Container
          </TabsTrigger>
          <TabsTrigger value="card" className="rounded-full px-3 py-2">
            Cards
          </TabsTrigger>
        </TabsList>

        <TabsContent value="container" className="outline-none">
          <ContainerPanel />
        </TabsContent>
        <TabsContent value="card" className="outline-none">
          <CardPanel />
        </TabsContent>
      </Tabs>
    </aside>
  );
}
