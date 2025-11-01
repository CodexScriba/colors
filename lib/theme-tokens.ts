import { z } from "zod";

const gradientStopSchema = z.object({
  position: z.number().min(0).max(100),
  color: z.string().min(1),
  opacity: z.number().min(0).max(1).optional(),
});

const gradientSchema = z.object({
  cssVar: z.string().min(1),
  type: z.enum(["linear", "radial", "conic"]),
  angle: z.number().min(0).max(360).optional(),
  shape: z.enum(["circle", "ellipse"]).optional(),
  focalPoint: z
    .object({
      x: z.number().min(0).max(100),
      y: z.number().min(0).max(100),
    })
    .optional(),
  stops: z.array(gradientStopSchema).min(2),
});

const lightingPassSchema = z.object({
  colorVar: z.string().min(1),
  intensity: z.number().min(0).max(1),
  blur: z.number().min(0).max(400),
  spread: z.number().min(-100).max(100),
  offset: z
    .object({
      x: z.number().min(-100).max(100),
      y: z.number().min(-100).max(100),
    })
    .default({ x: 0, y: 0 }),
});

const shadowSchema = z.object({
  colorVar: z.string().min(1),
  x: z.number().min(-100).max(100),
  y: z.number().min(-100).max(100),
  blur: z.number().min(0).max(400),
  spread: z.number().min(-100).max(100),
  inset: z.boolean().optional(),
});

const layerTokenSchema = z.object({
  layer: z.enum(["background", "container", "card"]),
  baseColorVar: z.string().min(1),
  foregroundVar: z.string().min(1),
  fallbackColor: z.string().optional(),
  gradient: gradientSchema,
  lighting: z.object({
    ambient: lightingPassSchema,
    directional: lightingPassSchema,
  }),
  shadows: z.object({
    ambient: shadowSchema,
    lifted: shadowSchema,
    inset: shadowSchema,
  }),
});

const themeTokensSchema = z.object({
  background: layerTokenSchema,
  container: layerTokenSchema,
  card: layerTokenSchema,
});

export type GradientStop = z.infer<typeof gradientStopSchema>;
export type GradientToken = z.infer<typeof gradientSchema>;
export type LightingPass = z.infer<typeof lightingPassSchema>;
export type ShadowToken = z.infer<typeof shadowSchema>;
export type LayerToken = z.infer<typeof layerTokenSchema>;
export type ThemeTokens = z.infer<typeof themeTokensSchema>;

const themeTokensData: ThemeTokens = themeTokensSchema.parse({
  background: {
    layer: "background",
    baseColorVar: "--background",
    foregroundVar: "--foreground",
    fallbackColor: "hsl(var(--background-fallback))",
    gradient: {
      cssVar: "--background-gradient",
      type: "linear",
      angle: 135,
      stops: [
        { position: 0, color: "hsl(210 100% 99%)" },
        { position: 45, color: "hsl(216 92% 96%)" },
        { position: 100, color: "hsl(226 78% 92%)" },
      ],
    },
    lighting: {
      ambient: {
        colorVar: "--glow-ambient",
        intensity: 0.32,
        blur: 180,
        spread: 32,
      },
      directional: {
        colorVar: "--glow-directional",
        intensity: 0.48,
        blur: 240,
        spread: 52,
        offset: { x: -12, y: 18 },
      },
    },
    shadows: {
      ambient: {
        colorVar: "--glow-ambient",
        x: 0,
        y: 24,
        blur: 120,
        spread: -40,
      },
      lifted: {
        colorVar: "--glow-directional",
        x: 0,
        y: 40,
        blur: 160,
        spread: -28,
      },
      inset: {
        colorVar: "--glow-directional",
        x: 0,
        y: 0,
        blur: 120,
        spread: 32,
        inset: true,
      },
    },
  },
  container: {
    layer: "container",
    baseColorVar: "--container",
    foregroundVar: "--container-foreground",
    fallbackColor: "hsl(var(--container))",
    gradient: {
      cssVar: "--container-gradient",
      type: "linear",
      angle: 155,
      stops: [
        { position: 0, color: "hsl(0 0% 100%)" },
        { position: 100, color: "hsl(216 61% 98%)" },
      ],
    },
    lighting: {
      ambient: {
        colorVar: "--container-shadow-ambient",
        intensity: 0.18,
        blur: 120,
        spread: 18,
      },
      directional: {
        colorVar: "--container-shadow-lifted",
        intensity: 0.24,
        blur: 180,
        spread: 36,
        offset: { x: 6, y: 18 },
      },
    },
    shadows: {
      ambient: {
        colorVar: "--container-shadow-ambient",
        x: 0,
        y: 18,
        blur: 36,
        spread: -12,
      },
      lifted: {
        colorVar: "--container-shadow-lifted",
        x: 0,
        y: 28,
        blur: 56,
        spread: -18,
      },
      inset: {
        colorVar: "--container-shadow-inset",
        x: 0,
        y: 12,
        blur: 32,
        spread: -40,
        inset: true,
      },
    },
  },
  card: {
    layer: "card",
    baseColorVar: "--card",
    foregroundVar: "--card-foreground",
    fallbackColor: "hsl(var(--card))",
    gradient: {
      cssVar: "--card-gradient",
      type: "linear",
      angle: 145,
      stops: [
        { position: 0, color: "hsl(0 0% 100%)" },
        { position: 55, color: "hsl(220 45% 97%)" },
        { position: 100, color: "hsl(216 36% 94%)" },
      ],
    },
    lighting: {
      ambient: {
        colorVar: "--card-shadow-soft",
        intensity: 0.2,
        blur: 120,
        spread: 12,
      },
      directional: {
        colorVar: "--card-shadow-floating",
        intensity: 0.34,
        blur: 160,
        spread: 24,
        offset: { x: 2, y: 12 },
      },
    },
    shadows: {
      ambient: {
        colorVar: "--card-shadow-soft",
        x: 0,
        y: 10,
        blur: 24,
        spread: -12,
      },
      lifted: {
        colorVar: "--card-shadow-hard",
        x: 0,
        y: 24,
        blur: 40,
        spread: -20,
      },
      inset: {
        colorVar: "--card-shadow-floating",
        x: 0,
        y: 8,
        blur: 22,
        spread: -30,
        inset: true,
      },
    },
  },
});

export const themeTokens: ThemeTokens = themeTokensData;

export const themeTokenLayers = Object.values(themeTokensData);

export const getLayerToken = (layer: LayerToken["layer"]) =>
  themeTokensData[layer];

