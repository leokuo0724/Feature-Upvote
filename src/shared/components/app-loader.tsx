"use client";

import React from "react";
import { useSettings } from "@/shared/contexts/settings-context";

interface AppLoaderProps {
  children: React.ReactNode;
}

export function AppLoader({ children }: AppLoaderProps) {
  const { isLoading, error, settings } = useSettings();

  console.log("🔍 AppLoader state:", {
    isLoading,
    error: !!error,
    hasSettings: !!settings,
  });

  if (isLoading) {
    console.log("⏳ AppLoader: Showing loading screen");
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading application...</p>
        </div>
      </div>
    );
  }

  if (error) {
    console.log("❌ AppLoader: Showing error screen");
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-destructive text-lg font-semibold">
            Failed to load application settings
          </div>
          <p className="text-muted-foreground">
            Please refresh the page to try again.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  console.log("✅ AppLoader: Rendering app content");
  return <>{children}</>;
}
