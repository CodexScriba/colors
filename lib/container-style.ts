import type { ContainerSettings } from "@/lib/container-settings";
import type { LayerToken } from "@/lib/theme-tokens";

const containerShadowMap: Record<
  ContainerSettings["shadowPreset"],
  string
> = {
  ambient: "0px 18px 42px -18px hsl(var(--container-shadow-ambient) / 0.45)",
  lifted: "0px 32px 64px -24px hsl(var(--container-shadow-lifted) / 0.55)",
  inset:
    "inset 0px 12px 28px -18px hsl(var(--container-shadow-inset) / 0.65)",
};

export type ContainerSurfaceStyle = {
  backgroundImage: string;
  gradient: string;
  overlayLayers: string[];
  borderRadius: string;
  borderWidth: string;
  boxShadow: string;
};

const buildGradient = (
  settings: ContainerSettings,
  token: LayerToken,
): string => {
  const stops = token.gradient.stops
    .map((stop) => `${stop.color} ${stop.position}%`)
    .join(", ");

  switch (token.gradient.type) {
    case "radial": {
      const shape = token.gradient.shape ?? "circle";
      const focalPoint = token.gradient.focalPoint
        ? `${token.gradient.focalPoint.x}% ${token.gradient.focalPoint.y}%`
        : "center";
      return `radial-gradient(${shape} at ${focalPoint}, ${stops})`;
    }
    case "conic": {
      const focalPoint = token.gradient.focalPoint
        ? `${token.gradient.focalPoint.x}% ${token.gradient.focalPoint.y}%`
        : "50% 50%";
      return `conic-gradient(from ${settings.gradientAngle}deg at ${focalPoint}, ${stops})`;
    }
    default:
      return `linear-gradient(${settings.gradientAngle}deg, ${stops})`;
  }
};

const buildOverlayLayers = (settings: ContainerSettings): string[] => {
  if (settings.overlayOpacity <= 0) {
    return [];
  }

  const primary = settings.overlayOpacity;
  const secondary = Math.max(primary - 0.12, 0);

  return [
    `radial-gradient(circle at 16% 18%, hsl(var(--container-shadow-ambient) / ${primary}) 0%, transparent 65%)`,
    `radial-gradient(circle at 82% 28%, hsl(var(--container-shadow-lifted) / ${secondary}) 0%, transparent 70%)`,
  ];
};

export const computeContainerSurfaceStyle = (
  settings: ContainerSettings,
  token: LayerToken,
): ContainerSurfaceStyle => {
  const gradient = buildGradient(settings, token);
  const overlayLayers = buildOverlayLayers(settings);
  const backgroundImage = [gradient, ...overlayLayers].join(", ");

  return {
    backgroundImage,
    gradient,
    overlayLayers,
    borderRadius: `${settings.borderRadius}px`,
    borderWidth: `${settings.borderWidth}px`,
    boxShadow: containerShadowMap[settings.shadowPreset],
  };
};

export const formatContainerCss = (
  style: ContainerSurfaceStyle,
): string => {
  const lines = [
    `background-image: ${style.backgroundImage};`,
    `border-radius: ${style.borderRadius};`,
    `border-width: ${style.borderWidth};`,
    `border-style: solid;`,
    `border-color: hsl(var(--container-border));`,
    `box-shadow: ${style.boxShadow};`,
  ];

  return lines.join("\n");
};

export const containerShadowOptions = Object.entries(containerShadowMap).map(
  ([value, shadow]) => ({
    value: value as ContainerSettings["shadowPreset"],
    shadow,
  }),
);
