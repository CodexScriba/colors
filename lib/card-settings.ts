export type CardVariant = "primary" | "subdued" | "dataviz";

export type CardSettings = {
  activeVariant: CardVariant;
  borderRadius: number;
  borderWidth: number;
  gradientAngle: number;
  shadowPreset: "soft" | "hard" | "floating";
  showGuides: boolean;
};

export const CARD_SETTINGS_STORAGE_KEY = "colors.card-settings.v1";

export const cardShadowPresets = [
  "soft",
  "hard",
  "floating",
] as const satisfies ReadonlyArray<CardSettings["shadowPreset"]>;

const variantSet = new Set<CardVariant>(["primary", "subdued", "dataviz"]);
const shadowSet = new Set(cardShadowPresets);

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

export const createDefaultCardSettings = (): CardSettings => ({
  activeVariant: "primary",
  borderRadius: 20,
  borderWidth: 1,
  gradientAngle: 135,
  shadowPreset: "floating",
  showGuides: false,
});

export const sanitizeCardSettings = (
  candidate: Partial<CardSettings>,
): CardSettings => {
  const base = createDefaultCardSettings();

  const rawAngle =
    typeof candidate.gradientAngle === "number"
      ? candidate.gradientAngle
      : base.gradientAngle;
  const normalizedAngle = ((rawAngle % 360) + 360) % 360;

  return {
    activeVariant: variantSet.has(candidate.activeVariant as CardVariant)
      ? (candidate.activeVariant as CardVariant)
      : base.activeVariant,
    borderRadius: clamp(
      typeof candidate.borderRadius === "number"
        ? candidate.borderRadius
        : base.borderRadius,
      4,
      64,
    ),
    borderWidth: clamp(
      typeof candidate.borderWidth === "number"
        ? candidate.borderWidth
        : base.borderWidth,
      0,
      6,
    ),
    gradientAngle: normalizedAngle,
    shadowPreset: shadowSet.has(
      candidate.shadowPreset as CardSettings["shadowPreset"],
    )
      ? (candidate.shadowPreset as CardSettings["shadowPreset"])
      : base.shadowPreset,
    showGuides:
      typeof candidate.showGuides === "boolean"
        ? candidate.showGuides
        : base.showGuides,
  };
};
