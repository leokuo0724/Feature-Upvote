// This file is kept for potential future use of React Query for other settings operations
// Currently, settings are managed through the SettingsContext for better caching

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateAppSettings, resetAppSettings } from "./firebase";
import { AppSettings } from "@/shared/types/settings";

// Query Keys (kept for consistency)
export const settingsKeys = {
  all: ["settings"] as const,
  app: () => [...settingsKeys.all, "app"] as const,
};

// Mutations for admin operations (optional - can use direct Firebase calls)
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
      // Invalidate any cached queries if needed
      queryClient.invalidateQueries({ queryKey: settingsKeys.app() });
    },
  });
}

export function useResetAppSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (updatedBy: string) => resetAppSettings(updatedBy),
    onSuccess: () => {
      // Invalidate any cached queries if needed
      queryClient.invalidateQueries({ queryKey: settingsKeys.app() });
    },
  });
}
