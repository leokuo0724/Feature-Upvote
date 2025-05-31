// This file is kept for potential future use of React Query for other settings operations
// Currently, settings are managed through the SettingsContext for better caching

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAppSettings,
  updateAppSettings,
  resetAppSettings,
} from "./firebase";
import { AppSettings } from "@/shared/types/settings";
import { toast } from "@/shared/ui";

// Query Keys
export const settingsKeys = {
  all: ["settings"] as const,
  settings: () => [...settingsKeys.all, "app"] as const,
};

// Queries
export function useAppSettings() {
  return useQuery({
    queryKey: settingsKeys.settings(),
    queryFn: getAppSettings,
    staleTime: 10 * 60 * 1000, // 10 minutes - settings don't change often
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
}

// Mutations
export function useUpdateAppSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      updates,
      updatedBy,
    }: {
      updates: Partial<AppSettings>;
      updatedBy: string;
    }) => updateAppSettings(updates, updatedBy),
    onSuccess: () => {
      // Invalidate settings cache
      queryClient.invalidateQueries({ queryKey: settingsKeys.settings() });
      toast({
        title: "Success",
        description: "Settings updated successfully!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update settings. Please try again.",
        variant: "destructive",
      });
      console.error("Error updating settings:", error);
    },
  });
}

export function useResetAppSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (updatedBy: string) => resetAppSettings(updatedBy),
    onSuccess: () => {
      // Invalidate settings cache
      queryClient.invalidateQueries({ queryKey: settingsKeys.settings() });
      toast({
        title: "Success",
        description: "Settings reset to default successfully!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to reset settings. Please try again.",
        variant: "destructive",
      });
      console.error("Error resetting settings:", error);
    },
  });
}
