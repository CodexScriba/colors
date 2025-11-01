"use client";

import type { PropsWithChildren } from "react";
import { useLighting, useThemeTokens } from "@/components/providers";

const toHslVar = (cssVar: string, alpha: number) =>
  `hsl(var(${cssVar}) / ${alpha})`;

export function BackgroundSurface({ children }: PropsWithChildren) {
  const tokens = useThemeTokens();
  const { ambient, directional } = useLighting();
  const background = tokens.background;

  const ambientPass = background.lighting.ambient;
  const directionalPass = background.lighting.directional;

  return (
    <div className="relative min-h-screen text-foreground">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-20"
        style={{
          backgroundColor: background.fallbackColor,
          backgroundImage: `var(${background.gradient.cssVar})`,
          backgroundAttachment: "fixed",
          backgroundSize: "cover",
        }}
      />

      {ambient && (
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 -z-10"
          style={{
            background: `radial-gradient(circle at 12% 18%, ${toHslVar(
              ambientPass.colorVar,
              ambientPass.intensity
            )} 0%, transparent 60%), radial-gradient(circle at 78% 26%, ${toHslVar(
              ambientPass.colorVar,
              Math.max(ambientPass.intensity - 0.14, 0.05)
            )} 0%, transparent 68%)`,
            filter: `blur(${ambientPass.blur}px)`,
            transform: `translate(0, ${ambientPass.spread}px)`,
            mixBlendMode: "screen",
          }}
        />
      )}

      {directional && (
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 -z-10"
          style={{
            background: `linear-gradient(135deg, transparent 0%, ${toHslVar(
              directionalPass.colorVar,
              directionalPass.intensity
            )} 55%, transparent 92%)`,
            filter: `blur(${directionalPass.blur}px)`,
            transform: `translate(${directionalPass.offset.x}px, ${directionalPass.offset.y}px)`,
            mixBlendMode: "screen",
          }}
        />
      )}

      <div className="relative z-0 flex min-h-screen flex-col">
        {children}
      </div>
    </div>
  );
}
