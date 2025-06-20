"use client";

import React, { useLayoutEffect, useRef } from "react";
import { useSettings } from "@/shared/contexts/settings-context";

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const { settings, isLoading } = useSettings();
  const appliedSettingsRef = useRef<string>("");

  useLayoutEffect(() => {
    // Only run on client side to avoid hydration issues
    if (typeof window === "undefined") return;

    if (!isLoading && settings) {
      // Create a hash of current settings to avoid unnecessary updates
      const settingsHash = JSON.stringify({
        primaryColor: settings.primaryColor,
        projectName: settings.projectName,
      });

      // Only apply changes if settings have actually changed
      if (appliedSettingsRef.current === settingsHash) {
        return;
      }

      appliedSettingsRef.current = settingsHash;

      // Apply custom CSS variables for colors
      const root = document.documentElement;

      // Convert hex to HSL for CSS variables
      const hexToHsl = (hex: string) => {
        const r = parseInt(hex.slice(1, 3), 16) / 255;
        const g = parseInt(hex.slice(3, 5), 16) / 255;
        const b = parseInt(hex.slice(5, 7), 16) / 255;

        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h = 0;
        let s = 0;
        const l = (max + min) / 2;

        if (max !== min) {
          const d = max - min;
          s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
          switch (max) {
            case r:
              h = (g - b) / d + (g < b ? 6 : 0);
              break;
            case g:
              h = (b - r) / d + 2;
              break;
            case b:
              h = (r - g) / d + 4;
              break;
          }
          h /= 6;
        }

        return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(
          l * 100
        )}%`;
      };

      // Apply primary color
      if (settings.primaryColor) {
        const primaryHsl = hexToHsl(settings.primaryColor);
        root.style.setProperty("--primary", primaryHsl);
      }

      // Update document title
      if (settings.projectName) {
        document.title = settings.projectName;
      }
    }
  }, [settings, isLoading]);

  return <>{children}</>;
}
