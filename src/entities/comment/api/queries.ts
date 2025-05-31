import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";
import {
  getComment,
  getComments,
  getCommentsWithCursor,
  createComment,
  updateComment,
  deleteComment,
  getCommentCount,
} from "./firebase";
import {
  Comment,
  CreateCommentData,
  UpdateCommentData,
  CommentsQuery,
} from "@/shared/types";
import { toast } from "@/shared/ui";
import { QueryDocumentSnapshot, DocumentData } from "firebase/firestore";
import {
  useIncrementCommentCount,
  useDecrementCommentCount,
} from "@/entities/feature-request";

// Query Keys
export const commentKeys = {
  all: ["comments"] as const,
  lists: () => [...commentKeys.all, "list"] as const,
  list: (params: CommentsQuery) => [...commentKeys.lists(), params] as const,
  details: () => [...commentKeys.all, "detail"] as const,
  detail: (id: string) => [...commentKeys.details(), id] as const,
  count: (featureRequestId: string) =>
    [...commentKeys.all, "count", featureRequestId] as const,
};

// Queries
export function useComment(id: string | null) {
  return useQuery({
    queryKey: commentKeys.detail(id || ""),
    queryFn: () => getComment(id!),
    enabled: !!id,
  });
}

export function useComments(queryParams: CommentsQuery) {
  return useQuery({
    queryKey: commentKeys.list(queryParams),
    queryFn: () => getComments(queryParams),
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}

export function useInfiniteComments(queryParams: CommentsQuery) {
  return useInfiniteQuery({
    queryKey: commentKeys.list(queryParams),
    queryFn: ({
      pageParam,
    }: {
      pageParam: QueryDocumentSnapshot<DocumentData> | undefined;
    }) => getCommentsWithCursor(queryParams, pageParam),
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.lastDoc : undefined,
    initialPageParam: undefined as
      | QueryDocumentSnapshot<DocumentData>
      | undefined,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}

export function useCommentCount(featureRequestId: string) {
  return useQuery({
    queryKey: commentKeys.count(featureRequestId),
    queryFn: () => getCommentCount(featureRequestId),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

// Mutations
export function useCreateComment() {
  const queryClient = useQueryClient();
  const incrementCommentCount = useIncrementCommentCount();

  return useMutation({
    mutationFn: ({
      data,
      authorId,
      authorName,
      authorEmail,
      authorPhotoURL,
    }: {
      data: CreateCommentData;
      authorId: string;
      authorName: string;
      authorEmail: string;
      authorPhotoURL?: string;
    }) =>
      createComment(data, authorId, authorName, authorEmail, authorPhotoURL),
    onSuccess: async (_, { data }) => {
      // Increment comment count in feature request
      await incrementCommentCount.mutateAsync(data.featureRequestId);

      // Invalidate comments for this feature request
      queryClient.invalidateQueries({
        queryKey: commentKeys.list({ featureRequestId: data.featureRequestId }),
      });

      toast({
        title: "Success",
        description: "Comment added successfully!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to add comment. Please try again.",
        variant: "destructive",
      });
      console.error("Error creating comment:", error);
    },
  });
}

export function useUpdateComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: UpdateCommentData }) =>
      updateComment(id, updates),
    onSuccess: (_, { id }) => {
      // Invalidate the specific comment and all comment lists
      queryClient.invalidateQueries({ queryKey: commentKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: commentKeys.lists() });
      toast({
        title: "Success",
        description: "Comment updated successfully!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update comment. Please try again.",
        variant: "destructive",
      });
      console.error("Error updating comment:", error);
    },
  });
}

export function useDeleteComment() {
  const queryClient = useQueryClient();
  const decrementCommentCount = useDecrementCommentCount();

  return useMutation({
    mutationFn: ({
      id,
      featureRequestId,
    }: {
      id: string;
      featureRequestId: string;
    }) => deleteComment(id),
    onSuccess: async (_, { id, featureRequestId }) => {
      // Decrement comment count in feature request
      await decrementCommentCount.mutateAsync(featureRequestId);

      // Remove from cache and invalidate lists
      queryClient.removeQueries({ queryKey: commentKeys.detail(id) });
      queryClient.invalidateQueries({
        queryKey: commentKeys.list({ featureRequestId }),
      });

      toast({
        title: "Success",
        description: "Comment deleted successfully!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete comment. Please try again.",
        variant: "destructive",
      });
      console.error("Error deleting comment:", error);
    },
  });
}
