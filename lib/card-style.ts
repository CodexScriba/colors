import type { CardSettings, CardVariant } from "@/lib/card-settings";

const cardShadowMap: Record<CardSettings["shadowPreset"], string> = {
  soft: "0px 12px 24px -16px hsl(var(--card-shadow-soft) / 0.55)",
  hard: "0px 18px 36px -10px hsl(var(--card-shadow-hard) / 0.66)",
  floating: "0px 28px 56px -18px hsl(var(--card-shadow-floating) / 0.72)",
};

export type CardSurfaceStyle = {
  backgroundImage: string;
  borderRadius: string;
  borderWidth: string;
  borderColor: string;
  boxShadow: string;
  textColor: string;
  accentColor: string;
};

type VariantDescriptor = {
  label: string;
  gradientStops: (angle: number) => string;
  borderColor: string;
  accentColor: string;
  textColor: string;
};

const gradient = (angle: number, stops: string[]) =>
  `linear-gradient(${angle}deg, ${stops.join(", ")})`;

const variantDescriptors: Record<CardVariant, VariantDescriptor> = {
  primary: {
    label: "Primary",
    gradientStops: (angle) =>
      gradient(angle, [
        "hsl(var(--card) / 0.95) 0%",
        "hsl(var(--primary) / 0.28) 45%",
        "hsl(var(--primary) / 0.62) 100%",
      ]),
    borderColor: "hsl(var(--primary) / 0.45)",
    accentColor: "hsl(var(--primary))",
    textColor: "hsl(var(--card-foreground))",
  },
  subdued: {
    label: "Subdued",
    gradientStops: (angle) =>
      gradient(angle, [
        "hsl(var(--muted) / 0.9) 0%",
        "hsl(var(--muted) / 0.75) 60%",
        "hsl(var(--muted-foreground) / 0.18) 100%",
      ]),
    borderColor: "hsl(var(--muted-foreground) / 0.35)",
    accentColor: "hsl(var(--muted-foreground))",
    textColor: "hsl(var(--muted-foreground))",
  },
  dataviz: {
    label: "Data Viz",
    gradientStops: (angle) =>
      gradient(angle, [
        "hsl(var(--card) / 0.96) 0%",
        "hsl(var(--chart-3) / 0.28) 40%",
        "hsl(var(--chart-5) / 0.38) 100%",
      ]),
    borderColor: "hsl(var(--chart-5) / 0.55)",
    accentColor: "hsl(var(--chart-3))",
    textColor: "hsl(var(--card-foreground))",
  },
};

export const cardVariantOptions = (Object.entries(variantDescriptors) as Array<[
  CardVariant,
  VariantDescriptor,
]>).map(([value, descriptor]) => ({
  value,
  label: descriptor.label,
}));

export const computeCardSurfaceStyle = (
  settings: CardSettings,
): CardSurfaceStyle => {
  const descriptor = variantDescriptors[settings.activeVariant];

  return {
    backgroundImage: descriptor.gradientStops(settings.gradientAngle),
    borderRadius: `${settings.borderRadius}px`,
    borderWidth: `${settings.borderWidth}px`,
    borderColor: descriptor.borderColor,
    boxShadow: cardShadowMap[settings.shadowPreset],
    textColor: descriptor.textColor,
    accentColor: descriptor.accentColor,
  };
};

export const formatCardCss = (style: CardSurfaceStyle): string =>
  [
    `background-image: ${style.backgroundImage};`,
    `border-radius: ${style.borderRadius};`,
    `border-width: ${style.borderWidth};`,
    `border-style: solid;`,
    `border-color: ${style.borderColor};`,
    `box-shadow: ${style.boxShadow};`,
    `color: ${style.textColor};`,
  ].join("\n");

export const cardShadowOptions = Object.entries(cardShadowMap).map(
  ([value, shadow]) => ({
    value: value as CardSettings["shadowPreset"],
    shadow,
  }),
);

export const describeVariant = (variant: CardVariant) =>
  variantDescriptors[variant];
