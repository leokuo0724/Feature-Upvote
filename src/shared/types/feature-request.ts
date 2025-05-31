export type FeatureRequestStatus =
  | "Open"
  | "In Progress"
  | "Completed"
  | "Won't Do"
  | "Considering"
  | "Will Do"
  | "Archived";

export interface FeatureRequest {
  id: string;
  title: string;
  description: string;
  status: FeatureRequestStatus;
  upvotes: number;
  upvotedBy: string[]; // Array of user UIDs who upvoted
  labels: string[];
  authorId: string;
  authorName: string;
  authorEmail: string;
  createdAt: Date;
  updatedAt: Date;
  commentsCount: number;
}

export interface CreateFeatureRequestData {
  title: string;
  description: string;
  labels?: string[];
}

export interface UpdateFeatureRequestData {
  title?: string;
  description?: string;
  status?: FeatureRequestStatus;
  labels?: string[];
}

export interface FeatureRequestFilters {
  status?: FeatureRequestStatus;
  statuses?: FeatureRequestStatus[]; // For tab group filtering
  labels?: string[];
  search?: string;
}

export interface FeatureRequestSort {
  field: "votes" | "createdAt";
  direction: "asc" | "desc";
}

export interface FeatureRequestsQuery {
  filters?: FeatureRequestFilters;
  sort?: FeatureRequestSort;
  page?: number;
  limit?: number;
}
