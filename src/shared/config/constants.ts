import { FeatureRequestStatus } from "@/shared/types";

export const FEATURE_REQUEST_STATUSES: FeatureRequestStatus[] = [
  "Open",
  "In Progress",
  "Completed",
];

export const ADMIN_STATUSES: FeatureRequestStatus[] = [
  "Won't Do",
  "Considering",
  "Will Do",
];

export const ARCHIVED_STATUS: FeatureRequestStatus = "Archived";

export const ALL_STATUSES: FeatureRequestStatus[] = [
  ...FEATURE_REQUEST_STATUSES,
  ...ADMIN_STATUSES,
  ARCHIVED_STATUS,
];

// All statuses except archived (for general users and "all" tab)
export const PUBLIC_STATUSES: FeatureRequestStatus[] = [
  ...FEATURE_REQUEST_STATUSES,
  ...ADMIN_STATUSES,
];

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 50,
} as const;

export const SORT_OPTIONS = [
  { value: "votes", label: "Most Upvoted" },
  { value: "createdAt", label: "Newest First" },
] as const;

// Firestore collection names
export const COLLECTIONS = {
  USERS: "users",
  FEATURE_REQUESTS: "featureRequests",
  COMMENTS: "comments",
  ADMIN_EMAILS: "adminEmails",
  LABELS: "labels",
  ANALYTICS: "analytics",
  SETTINGS: "settings",
} as const;
