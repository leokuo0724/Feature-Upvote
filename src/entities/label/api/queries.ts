import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getLabel,
  getLabels,
  createLabel,
  updateLabel,
  deleteLabel,
} from "./firebase";
import { Label, CreateLabelData, UpdateLabelData } from "@/shared/types";
import { toast } from "@/shared/ui";

// Query Keys
export const labelKeys = {
  all: ["labels"] as const,
  lists: () => [...labelKeys.all, "list"] as const,
  details: () => [...labelKeys.all, "detail"] as const,
  detail: (id: string) => [...labelKeys.details(), id] as const,
};

// Queries
export function useLabel(id: string | null) {
  return useQuery({
    queryKey: labelKeys.detail(id || ""),
    queryFn: () => getLabel(id!),
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes - labels don't change often
  });
}

export function useLabels() {
  return useQuery({
    queryKey: labelKeys.lists(),
    queryFn: getLabels,
    staleTime: 10 * 60 * 1000, // 10 minutes - labels don't change often
  });
}

// Mutations
export function useCreateLabel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      data,
      createdBy,
    }: {
      data: CreateLabelData;
      createdBy: string;
    }) => createLabel(data, createdBy),
    onSuccess: () => {
      // Invalidate all label lists
      queryClient.invalidateQueries({ queryKey: labelKeys.lists() });
      toast({
        title: "Success",
        description: "Label created successfully!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create label. Please try again.",
        variant: "destructive",
      });
      console.error("Error creating label:", error);
    },
  });
}

export function useUpdateLabel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: UpdateLabelData }) =>
      updateLabel(id, updates),
    onSuccess: (_, { id }) => {
      // Invalidate the specific label and all label lists
      queryClient.invalidateQueries({ queryKey: labelKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: labelKeys.lists() });
      toast({
        title: "Success",
        description: "Label updated successfully!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update label. Please try again.",
        variant: "destructive",
      });
      console.error("Error updating label:", error);
    },
  });
}

export function useDeleteLabel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteLabel,
    onSuccess: (_, id) => {
      // Remove from cache and invalidate lists
      queryClient.removeQueries({ queryKey: labelKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: labelKeys.lists() });
      toast({
        title: "Success",
        description: "Label deleted successfully!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete label. Please try again.",
        variant: "destructive",
      });
      console.error("Error deleting label:", error);
    },
  });
}
