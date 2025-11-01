"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { ThemeProvider as NextThemesProvider, type ThemeProviderProps } from "next-themes";
import { themeTokens, type ThemeTokens } from "@/lib/theme-tokens";
import {
  CONTAINER_SETTINGS_STORAGE_KEY,
  createDefaultContainerSettings,
  sanitizeContainerSettings,
  type ContainerSettings,
} from "@/lib/container-settings";
import {
  CARD_SETTINGS_STORAGE_KEY,
  createDefaultCardSettings,
  sanitizeCardSettings,
  type CardSettings,
} from "@/lib/card-settings";

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
type ContainerSettingsContextValue = {
  settings: ContainerSettings;
  updateSetting: <K extends keyof ContainerSettings>(
    key: K,
    value: ContainerSettings[K],
  ) => void;
  applyPatch: (patch: Partial<ContainerSettings>) => void;
  reset: () => void;
};

const ContainerSettingsContext =
  createContext<ContainerSettingsContextValue | undefined>(undefined);

type CardSettingsContextValue = {
  settings: CardSettings;
  updateSetting: <K extends keyof CardSettings>(
    key: K,
    value: CardSettings[K],
  ) => void;
  applyPatch: (patch: Partial<CardSettings>) => void;
  reset: () => void;
};

const CardSettingsContext =
  createContext<CardSettingsContextValue | undefined>(undefined);

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [ambient, setAmbient] = useState(true);
  const [directional, setDirectional] = useState(true);
  const [containerSettings, setContainerSettings] = useState<ContainerSettings>(
    () => createDefaultContainerSettings(),
  );
  const [cardSettings, setCardSettings] = useState<CardSettings>(() =>
    createDefaultCardSettings(),
  );

  const toggleAmbient = useCallback(() => {
    setAmbient((value) => !value);
  }, []);

  const toggleDirectional = useCallback(() => {
    setDirectional((value) => !value);
  }, []);

  const applyPatch = useCallback((patch: Partial<ContainerSettings>) => {
    setContainerSettings((prev) =>
      sanitizeContainerSettings({
        ...prev,
        ...patch,
      }),
    );
  }, []);

  const updateSetting = useCallback(
    <K extends keyof ContainerSettings>(
      key: K,
      value: ContainerSettings[K],
    ) => {
      applyPatch({ [key]: value } as Partial<ContainerSettings>);
    },
    [applyPatch],
  );

  const resetContainerSettings = useCallback(() => {
    setContainerSettings(createDefaultContainerSettings());
  }, []);

  const applyCardPatch = useCallback((patch: Partial<CardSettings>) => {
    setCardSettings((prev) =>
      sanitizeCardSettings({
        ...prev,
        ...patch,
      }),
    );
  }, []);

  const updateCardSetting = useCallback(
    <K extends keyof CardSettings>(key: K, value: CardSettings[K]) => {
      applyCardPatch({ [key]: value } as Partial<CardSettings>);
    },
    [applyCardPatch],
  );

  const resetCardSettings = useCallback(() => {
    setCardSettings(createDefaultCardSettings());
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    try {
      const stored = window.localStorage.getItem(
        CONTAINER_SETTINGS_STORAGE_KEY,
      );
      if (!stored) {
        return;
      }

      const parsed = JSON.parse(stored) as Partial<ContainerSettings>;
      setContainerSettings(sanitizeContainerSettings(parsed));
    } catch (error) {
      console.warn("Failed to read container settings from storage", error);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    try {
      const stored = window.localStorage.getItem(CARD_SETTINGS_STORAGE_KEY);
      if (!stored) {
        return;
      }

      const parsed = JSON.parse(stored) as Partial<CardSettings>;
      setCardSettings(sanitizeCardSettings(parsed));
    } catch (error) {
      console.warn("Failed to read card settings from storage", error);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    try {
      window.localStorage.setItem(
        CONTAINER_SETTINGS_STORAGE_KEY,
        JSON.stringify(containerSettings),
      );
    } catch (error) {
      console.warn("Failed to persist container settings", error);
    }
  }, [containerSettings]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    try {
      window.localStorage.setItem(
        CARD_SETTINGS_STORAGE_KEY,
        JSON.stringify(cardSettings),
      );
    } catch (error) {
      console.warn("Failed to persist card settings", error);
    }
  }, [cardSettings]);

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

  const containerSettingsValue = useMemo<ContainerSettingsContextValue>(
    () => ({
      settings: containerSettings,
      updateSetting,
      applyPatch,
      reset: resetContainerSettings,
    }),
    [containerSettings, updateSetting, applyPatch, resetContainerSettings],
  );

  const cardSettingsValue = useMemo<CardSettingsContextValue>(
    () => ({
      settings: cardSettings,
      updateSetting: updateCardSetting,
      applyPatch: applyCardPatch,
      reset: resetCardSettings,
    }),
    [cardSettings, updateCardSetting, applyCardPatch, resetCardSettings],
  );

  return (
    <NextThemesProvider {...props}>
      <ThemeTokensContext.Provider value={themeTokens}>
        <ContainerSettingsContext.Provider value={containerSettingsValue}>
          <CardSettingsContext.Provider value={cardSettingsValue}>
            <LightingContext.Provider value={lightingValue}>
              {children}
            </LightingContext.Provider>
          </CardSettingsContext.Provider>
        </ContainerSettingsContext.Provider>
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

export const useContainerSettings = () => {
  const context = useContext(ContainerSettingsContext);

  if (!context) {
    throw new Error("useContainerSettings must be used within ThemeProvider");
  }

  return context;
};

export const useCardSettings = () => {
  const context = useContext(CardSettingsContext);

  if (!context) {
    throw new Error("useCardSettings must be used within ThemeProvider");
  }

  return context;
};
