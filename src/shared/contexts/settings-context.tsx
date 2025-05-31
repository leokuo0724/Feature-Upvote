"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { useAppSettings } from "@/entities/settings/api/queries";
import { AppSettings, DEFAULT_SETTINGS } from "@/shared/types/settings";

interface SettingsContextType {
  settings: AppSettings;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined
);

interface SettingsProviderProps {
  children: ReactNode;
}

export function SettingsProvider({ children }: SettingsProviderProps) {
  const { data: settings, isLoading, error, refetch } = useAppSettings();

  const defaultSettings: AppSettings = {
    ...DEFAULT_SETTINGS,
    createdAt: new Date(),
    updatedAt: new Date(),
    updatedBy: "",
  } as AppSettings;

  const contextValue: SettingsContextType = {
    settings: settings || defaultSettings,
    isLoading,
    error: error as Error | null,
    refetch,
  };

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
