import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";
import {
  getUser,
  createUser,
  updateUser,
  upsertUserOnLogin,
  checkIsAdmin,
  updateUserAdminStatus,
  getAdminUsers,
  getUserFeatureRequests,
  getUserVotedFeatureRequests,
  getUserStats,
} from "./firebase";
import { User } from "@/shared/types";

// Query Keys
export const userKeys = {
  all: ["users"] as const,
  user: (uid: string) => [...userKeys.all, uid] as const,
  adminUsers: () => [...userKeys.all, "adminUsers"] as const,
  isAdmin: (email: string) => [...userKeys.all, "isAdmin", email] as const,
  details: () => [...userKeys.all, "detail"] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
  featureRequests: (id: string) =>
    [...userKeys.all, "featureRequests", id] as const,
  votedFeatureRequests: (id: string) =>
    [...userKeys.all, "votedFeatureRequests", id] as const,
  stats: (id: string) => [...userKeys.all, "stats", id] as const,
};

// Queries
export function useUser(uid: string | null) {
  return useQuery({
    queryKey: userKeys.user(uid || ""),
    queryFn: () => getUser(uid!),
    enabled: !!uid,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useIsAdmin(email: string | null) {
  return useQuery({
    queryKey: userKeys.isAdmin(email || ""),
    queryFn: () => checkIsAdmin(email!),
    enabled: !!email,
    staleTime: 10 * 60 * 1000, // 10 minutes - admin status doesn't change often
  });
}

// Get user details
export function useUserDetails(uid: string) {
  return useQuery({
    queryKey: userKeys.detail(uid),
    queryFn: () => getUser(uid),
    enabled: !!uid,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Get user's feature requests with infinite pagination
export function useUserFeatureRequests(userId: string) {
  return useInfiniteQuery({
    queryKey: userKeys.featureRequests(userId),
    queryFn: ({ pageParam }: { pageParam: any }) =>
      getUserFeatureRequests(userId, 12, pageParam),
    enabled: !!userId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    initialPageParam: undefined as any,
    getNextPageParam: (lastPage) => {
      return lastPage.hasMore ? lastPage.lastDoc : undefined;
    },
  });
}

// Get feature requests user has voted on
export function useUserVotedFeatureRequests(userId: string) {
  return useQuery({
    queryKey: userKeys.votedFeatureRequests(userId),
    queryFn: () => getUserVotedFeatureRequests(userId),
    enabled: !!userId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

// Get user statistics
export function useUserStats(userId: string) {
  return useQuery({
    queryKey: userKeys.stats(userId),
    queryFn: () => getUserStats(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useAdminUsers() {
  return useQuery({
    queryKey: userKeys.adminUsers(),
    queryFn: getAdminUsers,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Mutations
export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createUser,
    onSuccess: (_, userData) => {
      // Update the user cache
      queryClient.setQueryData(userKeys.user(userData.uid), userData);
      // Invalidate admin status if email is provided
      if (userData.email) {
        queryClient.invalidateQueries({
          queryKey: userKeys.isAdmin(userData.email),
        });
      }
    },
  });
}

// Upsert mutation for logging in
export function useUpsertUserOnLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["upsertUserOnLogin"],
    mutationFn: upsertUserOnLogin,
    onSuccess: (_, userData) => {
      // Invalidate user cache to refetch updated data
      queryClient.invalidateQueries({
        queryKey: userKeys.user(userData.uid),
      });
      // Invalidate admin status if email is provided
      if (userData.email) {
        queryClient.invalidateQueries({
          queryKey: userKeys.isAdmin(userData.email),
        });
      }
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ uid, updates }: { uid: string; updates: Partial<User> }) =>
      updateUser(uid, updates),
    onSuccess: (_, { uid, updates }) => {
      // Update the user cache
      queryClient.setQueryData(userKeys.user(uid), (old: User | undefined) =>
        old ? { ...old, ...updates } : undefined
      );
    },
  });
}

export function useUpdateUserAdminStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      uid,
      isAdmin,
      updatedBy,
    }: {
      uid: string;
      isAdmin: boolean;
      updatedBy: string;
    }) => updateUserAdminStatus(uid, isAdmin, updatedBy),
    onSuccess: (_, { uid }) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: userKeys.user(uid) });
      queryClient.invalidateQueries({ queryKey: userKeys.adminUsers() });
      // Invalidate all isAdmin queries since we don't know which email this user has
      queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
  });
}
