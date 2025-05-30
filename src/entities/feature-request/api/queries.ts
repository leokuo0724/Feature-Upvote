import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";
import {
  getFeatureRequest,
  getFeatureRequests,
  getFeatureRequestsWithCursor,
  createFeatureRequest,
  updateFeatureRequest,
  deleteFeatureRequest,
  toggleUpvote,
  searchFeatureRequests,
  incrementCommentCount,
  decrementCommentCount,
} from "./firebase";
import {
  FeatureRequest,
  CreateFeatureRequestData,
  UpdateFeatureRequestData,
  FeatureRequestsQuery,
} from "@/shared/types";
import { toast } from "@/shared/ui";
import { QueryDocumentSnapshot, DocumentData } from "firebase/firestore";

// Query Keys
export const featureRequestKeys = {
  all: ["featureRequests"] as const,
  lists: () => [...featureRequestKeys.all, "list"] as const,
  list: (params: FeatureRequestsQuery) =>
    [...featureRequestKeys.lists(), params] as const,
  details: () => [...featureRequestKeys.all, "detail"] as const,
  detail: (id: string) => [...featureRequestKeys.details(), id] as const,
  search: (term: string) =>
    [...featureRequestKeys.all, "search", term] as const,
};

// Queries
export function useFeatureRequest(id: string | null) {
  return useQuery({
    queryKey: featureRequestKeys.detail(id || ""),
    queryFn: () => getFeatureRequest(id!),
    enabled: !!id,
  });
}

export function useFeatureRequests(queryParams: FeatureRequestsQuery = {}) {
  return useQuery({
    queryKey: featureRequestKeys.list(queryParams),
    queryFn: () => getFeatureRequests(queryParams),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

export function useInfiniteFeatureRequests(
  queryParams: FeatureRequestsQuery = {}
) {
  return useInfiniteQuery({
    queryKey: featureRequestKeys.list(queryParams),
    queryFn: ({
      pageParam,
    }: {
      pageParam: QueryDocumentSnapshot<DocumentData> | undefined;
    }) => getFeatureRequestsWithCursor(queryParams, pageParam),
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.lastDoc : undefined,
    initialPageParam: undefined as
      | QueryDocumentSnapshot<DocumentData>
      | undefined,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

export function useSearchFeatureRequests(
  searchTerm: string,
  queryParams: Omit<FeatureRequestsQuery, "filters"> = {}
) {
  return useQuery({
    queryKey: featureRequestKeys.search(searchTerm),
    queryFn: () => searchFeatureRequests(searchTerm, queryParams),
    enabled: searchTerm.length > 0,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}

// Mutations
export function useCreateFeatureRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      data,
      authorId,
      authorName,
      authorEmail,
    }: {
      data: CreateFeatureRequestData;
      authorId: string;
      authorName: string;
      authorEmail: string;
    }) => createFeatureRequest(data, authorId, authorName, authorEmail),
    onSuccess: () => {
      // Invalidate all feature request lists
      queryClient.invalidateQueries({ queryKey: featureRequestKeys.lists() });
      toast({
        title: "Success",
        description: "Feature request created successfully!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create feature request. Please try again.",
        variant: "destructive",
      });
      console.error("Error creating feature request:", error);
    },
  });
}

export function useUpdateFeatureRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      updates,
    }: {
      id: string;
      updates: UpdateFeatureRequestData;
    }) => updateFeatureRequest(id, updates),
    onSuccess: (_, { id }) => {
      // Invalidate the specific feature request and all lists
      queryClient.invalidateQueries({
        queryKey: featureRequestKeys.detail(id),
      });
      queryClient.invalidateQueries({ queryKey: featureRequestKeys.lists() });
      toast({
        title: "Success",
        description: "Feature request updated successfully!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update feature request. Please try again.",
        variant: "destructive",
      });
      console.error("Error updating feature request:", error);
    },
  });
}

export function useDeleteFeatureRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteFeatureRequest,
    onSuccess: (_, id) => {
      // Remove from cache and invalidate lists
      queryClient.removeQueries({ queryKey: featureRequestKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: featureRequestKeys.lists() });
      toast({
        title: "Success",
        description: "Feature request deleted successfully!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete feature request. Please try again.",
        variant: "destructive",
      });
      console.error("Error deleting feature request:", error);
    },
  });
}

export function useToggleUpvote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      featureRequestId,
      userId,
    }: {
      featureRequestId: string;
      userId: string;
    }) => toggleUpvote(featureRequestId, userId),
    onMutate: async ({ featureRequestId, userId }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({
        queryKey: featureRequestKeys.detail(featureRequestId),
      });

      // Snapshot the previous value
      const previousFeatureRequest = queryClient.getQueryData<FeatureRequest>(
        featureRequestKeys.detail(featureRequestId)
      );

      // Optimistically update the cache
      if (previousFeatureRequest) {
        const hasUpvoted = previousFeatureRequest.upvotedBy.includes(userId);
        const newUpvotes = hasUpvoted
          ? previousFeatureRequest.upvotes - 1
          : previousFeatureRequest.upvotes + 1;
        const newUpvotedBy = hasUpvoted
          ? previousFeatureRequest.upvotedBy.filter((id) => id !== userId)
          : [...previousFeatureRequest.upvotedBy, userId];

        queryClient.setQueryData<FeatureRequest>(
          featureRequestKeys.detail(featureRequestId),
          {
            ...previousFeatureRequest,
            upvotes: newUpvotes,
            upvotedBy: newUpvotedBy,
          }
        );
      }

      return { previousFeatureRequest };
    },
    onError: (error, { featureRequestId }, context) => {
      // Rollback on error
      if (context?.previousFeatureRequest) {
        queryClient.setQueryData(
          featureRequestKeys.detail(featureRequestId),
          context.previousFeatureRequest
        );
      }
      toast({
        title: "Error",
        description: "Failed to update vote. Please try again.",
        variant: "destructive",
      });
      console.error("Error toggling upvote:", error);
    },
    onSettled: (_, __, { featureRequestId }) => {
      // Always refetch after error or success
      queryClient.invalidateQueries({
        queryKey: featureRequestKeys.detail(featureRequestId),
      });
      queryClient.invalidateQueries({ queryKey: featureRequestKeys.lists() });
    },
  });
}

// Comment count management hooks
export function useIncrementCommentCount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: incrementCommentCount,
    onMutate: async (featureRequestId) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({
        queryKey: featureRequestKeys.detail(featureRequestId),
      });

      // Snapshot the previous value
      const previousFeatureRequest = queryClient.getQueryData<FeatureRequest>(
        featureRequestKeys.detail(featureRequestId)
      );

      // Optimistically update the cache
      if (previousFeatureRequest) {
        queryClient.setQueryData<FeatureRequest>(
          featureRequestKeys.detail(featureRequestId),
          {
            ...previousFeatureRequest,
            commentsCount: previousFeatureRequest.commentsCount + 1,
          }
        );
      }

      return { previousFeatureRequest };
    },
    onError: (error, featureRequestId, context) => {
      // Rollback on error
      if (context?.previousFeatureRequest) {
        queryClient.setQueryData(
          featureRequestKeys.detail(featureRequestId),
          context.previousFeatureRequest
        );
      }
    },
    onSettled: (_, __, featureRequestId) => {
      // Always refetch after error or success
      queryClient.invalidateQueries({
        queryKey: featureRequestKeys.detail(featureRequestId),
      });
      queryClient.invalidateQueries({ queryKey: featureRequestKeys.lists() });
    },
  });
}

export function useDecrementCommentCount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: decrementCommentCount,
    onMutate: async (featureRequestId) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({
        queryKey: featureRequestKeys.detail(featureRequestId),
      });

      // Snapshot the previous value
      const previousFeatureRequest = queryClient.getQueryData<FeatureRequest>(
        featureRequestKeys.detail(featureRequestId)
      );

      // Optimistically update the cache
      if (previousFeatureRequest) {
        queryClient.setQueryData<FeatureRequest>(
          featureRequestKeys.detail(featureRequestId),
          {
            ...previousFeatureRequest,
            commentsCount: Math.max(
              0,
              previousFeatureRequest.commentsCount - 1
            ),
          }
        );
      }

      return { previousFeatureRequest };
    },
    onError: (error, featureRequestId, context) => {
      // Rollback on error
      if (context?.previousFeatureRequest) {
        queryClient.setQueryData(
          featureRequestKeys.detail(featureRequestId),
          context.previousFeatureRequest
        );
      }
    },
    onSettled: (_, __, featureRequestId) => {
      // Always refetch after error or success
      queryClient.invalidateQueries({
        queryKey: featureRequestKeys.detail(featureRequestId),
      });
      queryClient.invalidateQueries({ queryKey: featureRequestKeys.lists() });
    },
  });
}
