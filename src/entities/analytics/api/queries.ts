import { useQuery } from "@tanstack/react-query";
import {
  getActiveUsers,
  getActiveUsersAnalytics,
  getTotalFeatureRequests,
  getTotalComments,
  getTotalLabels,
} from "./firebase";

// Query Keys
export const analyticsKeys = {
  all: ["analytics"] as const,
  activeUsers: (period: string) =>
    [...analyticsKeys.all, "activeUsers", period] as const,
  activeUsersAll: () => [...analyticsKeys.all, "activeUsers"] as const,
  totalFeatureRequests: () =>
    [...analyticsKeys.all, "totalFeatureRequests"] as const,
  totalComments: () => [...analyticsKeys.all, "totalComments"] as const,
  totalLabels: () => [...analyticsKeys.all, "totalLabels"] as const,
};

// Hooks
export function useActiveUsers(period: "daily" | "weekly" | "monthly") {
  return useQuery({
    queryKey: analyticsKeys.activeUsers(period),
    queryFn: () => getActiveUsers(period),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
}

export function useActiveUsersAnalytics() {
  return useQuery({
    queryKey: analyticsKeys.activeUsersAll(),
    queryFn: getActiveUsersAnalytics,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
}

export function useTotalFeatureRequests() {
  return useQuery({
    queryKey: analyticsKeys.totalFeatureRequests(),
    queryFn: getTotalFeatureRequests,
    staleTime: 10 * 60 * 1000, // 10 minutes - changes less frequently
    retry: 2,
  });
}

export function useTotalComments() {
  return useQuery({
    queryKey: analyticsKeys.totalComments(),
    queryFn: getTotalComments,
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
  });
}

export function useTotalLabels() {
  return useQuery({
    queryKey: analyticsKeys.totalLabels(),
    queryFn: getTotalLabels,
    staleTime: 30 * 60 * 1000, // 30 minutes - labels change rarely
    retry: 2,
  });
}
