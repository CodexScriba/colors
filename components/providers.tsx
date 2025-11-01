"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";
import { themeTokens, type ThemeTokens } from "@/lib/theme-tokens";

type LightingContextValue = {
  ambient: boolean;
  directional: boolean;
  toggleAmbient: () => void;
  toggleDirectional: () => void;
  setAmbient: (value: boolean) => void;
  setDirectional: (value: boolean) => void;
};

const ThemeTokensContext = createContext<ThemeTokens>(themeTokens);
const LightingContext = createContext<LightingContextValue | undefined>(
  undefined,
);

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [ambient, setAmbient] = useState(true);
  const [directional, setDirectional] = useState(true);

  const toggleAmbient = useCallback(() => {
    setAmbient((value) => !value);
  }, []);

  const toggleDirectional = useCallback(() => {
    setDirectional((value) => !value);
  }, []);

  const lightingValue = useMemo<LightingContextValue>(
    () => ({
      ambient,
      directional,
      toggleAmbient,
      toggleDirectional,
      setAmbient,
      setDirectional,
    }),
    [ambient, directional, toggleAmbient, toggleDirectional],
  );

  return (
    <NextThemesProvider {...props}>
      <ThemeTokensContext.Provider value={themeTokens}>
        <LightingContext.Provider value={lightingValue}>
          {children}
        </LightingContext.Provider>
      </ThemeTokensContext.Provider>
    </NextThemesProvider>
  );
}

export const useThemeTokens = () => useContext(ThemeTokensContext);

export const useLighting = () => {
  const context = useContext(LightingContext);

  if (!context) {
    throw new Error("useLighting must be used within ThemeProvider");
  }

  return context;
};
