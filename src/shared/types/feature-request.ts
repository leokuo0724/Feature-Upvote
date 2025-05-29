export type FeatureRequestStatus =
  | "Open"
  | "In Progress"
  | "Completed"
  | "Won't Do"
  | "Pending"
  | "Under Discussion"
  | "Will Do";

export interface FeatureRequest {
  id: string;
  title: string;
  description: string;
  creatorId: string;
  creatorName: string;
  creatorPhotoURL?: string;
  status: FeatureRequestStatus;
  labels: string[];
  upvotes: string[]; // Array of user IDs who upvoted
  commentCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateFeatureRequestData {
  title: string;
  description: string;
}

export interface UpdateFeatureRequestData {
  status?: FeatureRequestStatus;
  labels?: string[];
}

export type SortOption = "votes" | "createdAt";

export interface FeatureRequestFilters {
  status?: FeatureRequestStatus;
  sortBy: SortOption;
  page: number;
  limit: number;
}
