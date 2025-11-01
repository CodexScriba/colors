export type ContainerSettings = {
  borderRadius: number;
  borderWidth: number;
  gradientAngle: number;
  overlayOpacity: number;
  shadowPreset: "ambient" | "lifted" | "inset";
  showGuides: boolean;
};

export const containerShadowPresets = [
  "ambient",
  "lifted",
  "inset",
] as const satisfies ReadonlyArray<ContainerSettings["shadowPreset"]>;

export const CONTAINER_SETTINGS_STORAGE_KEY =
  "colors.container-settings.v1";

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

export const createDefaultContainerSettings = (): ContainerSettings => ({
  borderRadius: 28,
  borderWidth: 1,
  gradientAngle: 155,
  overlayOpacity: 0.32,
  shadowPreset: "lifted",
  showGuides: true,
});

const shadowSet = new Set(containerShadowPresets);

export const sanitizeContainerSettings = (
  candidate: Partial<ContainerSettings>,
): ContainerSettings => {
  const base = createDefaultContainerSettings();
  const rawAngle =
    typeof candidate.gradientAngle === "number"
      ? candidate.gradientAngle
      : base.gradientAngle;
  const normalizedAngle = ((rawAngle % 360) + 360) % 360;

  return {
    borderRadius: clamp(
      typeof candidate.borderRadius === "number"
        ? candidate.borderRadius
        : base.borderRadius,
      4,
      84,
    ),
    borderWidth: clamp(
      typeof candidate.borderWidth === "number"
        ? candidate.borderWidth
        : base.borderWidth,
      0,
      8,
    ),
    gradientAngle: normalizedAngle,
    overlayOpacity: clamp(
      typeof candidate.overlayOpacity === "number"
        ? candidate.overlayOpacity
        : base.overlayOpacity,
      0,
      0.72,
    ),
    shadowPreset: shadowSet.has(
      candidate.shadowPreset as ContainerSettings["shadowPreset"],
    )
      ? (candidate.shadowPreset as ContainerSettings["shadowPreset"])
      : base.shadowPreset,
    showGuides:
      typeof candidate.showGuides === "boolean"
        ? candidate.showGuides
        : base.showGuides,
  };
};
