export interface AnalyticsCache {
  id: string; // 例如 "active_users_daily"
  type: "active_users" | "total_requests" | "total_comments";
  period: "daily" | "weekly" | "monthly";
  value: number;
  lastUpdated: Date;
  expiresAt: Date;
}

export interface ActiveUsersAnalytics {
  daily: number;
  weekly: number;
  monthly: number;
  lastUpdated: Date;
}

export interface PlatformStats {
  activeUsers: ActiveUsersAnalytics;
  totalFeatureRequests: number;
  totalComments: number;
  totalLabels: number;
}
