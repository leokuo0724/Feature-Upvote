"use client";

import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import { getAppSettings } from "@/entities/settings/api/firebase";
import { AppSettings, DEFAULT_SETTINGS } from "@/shared/types/settings";

interface SettingsContextType {
  settings: AppSettings;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined
);

interface SettingsProviderProps {
  children: ReactNode;
}

export function SettingsProvider({ children }: SettingsProviderProps) {
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const defaultSettings: AppSettings = {
    ...DEFAULT_SETTINGS,
    createdAt: new Date(),
    updatedAt: new Date(),
    updatedBy: "",
  } as AppSettings;

  const fetchSettings = async (): Promise<void> => {
    try {
      console.log("🔄 Fetching app settings...");
      setIsLoading(true);
      setError(null);

      const fetchedSettings = await getAppSettings();

      console.log("✅ App settings loaded:", fetchedSettings);
      setSettings(fetchedSettings);
    } catch (err) {
      console.error("❌ Error fetching settings:", err);
      const errorObj =
        err instanceof Error ? err : new Error("Failed to fetch settings");
      setError(errorObj);

      // Use default settings on error
      console.log("🔧 Using default settings due to error");
      setSettings(defaultSettings);
    } finally {
      console.log("🏁 Setting isLoading to false");
      setIsLoading(false);
    }
  };

  // Fetch settings on mount
  useEffect(() => {
    console.log("🚀 SettingsProvider mounted, fetching settings...");
    fetchSettings();
  }, []);

  const contextValue: SettingsContextType = {
    settings: settings || defaultSettings,
    isLoading,
    error,
    refetch: fetchSettings,
  };

  console.log("🔍 SettingsProvider render:", {
    hasSettings: !!settings,
    isLoading,
    hasError: !!error,
  });

  return (
    <SettingsContext.Provider value={contextValue}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
