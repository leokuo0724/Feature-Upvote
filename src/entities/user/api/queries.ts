import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getUser,
  createUser,
  updateUser,
  checkIsAdmin,
  addAdminEmail,
  removeAdminEmail,
  getAdminEmails,
} from "./firebase";
import { User } from "@/shared/types";

// Query Keys
export const userKeys = {
  all: ["users"] as const,
  user: (uid: string) => [...userKeys.all, uid] as const,
  adminEmails: () => [...userKeys.all, "adminEmails"] as const,
  isAdmin: (email: string) => [...userKeys.all, "isAdmin", email] as const,
};

// Queries
export function useUser(uid: string | null) {
  return useQuery({
    queryKey: userKeys.user(uid || ""),
    queryFn: () => getUser(uid!),
    enabled: !!uid,
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

export function useAdminEmails() {
  return useQuery({
    queryKey: userKeys.adminEmails(),
    queryFn: getAdminEmails,
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

export function useAddAdminEmail() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ email, addedBy }: { email: string; addedBy: string }) =>
      addAdminEmail(email, addedBy),
    onSuccess: (_, { email }) => {
      // Invalidate admin emails list
      queryClient.invalidateQueries({ queryKey: userKeys.adminEmails() });
      // Invalidate admin status for this email
      queryClient.invalidateQueries({ queryKey: userKeys.isAdmin(email) });
    },
  });
}

export function useRemoveAdminEmail() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeAdminEmail,
    onSuccess: (_, email) => {
      // Invalidate admin emails list
      queryClient.invalidateQueries({ queryKey: userKeys.adminEmails() });
      // Invalidate admin status for this email
      queryClient.invalidateQueries({ queryKey: userKeys.isAdmin(email) });
    },
  });
}
