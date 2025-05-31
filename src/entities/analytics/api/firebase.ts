import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/shared/config/firebase";
import { COLLECTIONS } from "@/shared/config/constants";
import { AnalyticsCache, ActiveUsersAnalytics } from "@/shared/types";

// Cache duration constants
const CACHE_DURATION = {
  DAILY: 60 * 60 * 1000, // 1 hour
  WEEKLY: 6 * 60 * 60 * 1000, // 6 hours
  MONTHLY: 24 * 60 * 60 * 1000, // 24 hours
};

// Helper function to check if cache is expired
function isCacheExpired(cache: AnalyticsCache): boolean {
  return new Date() > cache.expiresAt;
}

// Helper function to convert Firestore document to AnalyticsCache
function convertFirestoreAnalyticsDoc(data: any, id: string): AnalyticsCache {
  return {
    id,
    type: data.type,
    period: data.period,
    value: data.value || 0,
    lastUpdated:
      data.lastUpdated instanceof Timestamp
        ? data.lastUpdated.toDate()
        : new Date(data.lastUpdated || Date.now()),
    expiresAt:
      data.expiresAt instanceof Timestamp
        ? data.expiresAt.toDate()
        : new Date(data.expiresAt || Date.now()),
  };
}

// Get cached analytics data
async function getCachedAnalytics(
  type: string,
  period: string
): Promise<AnalyticsCache | null> {
  const cacheId = `${type}_${period}`;
  const cacheRef = doc(db, COLLECTIONS.ANALYTICS, cacheId);
  const cacheSnap = await getDoc(cacheRef);

  if (cacheSnap.exists()) {
    return convertFirestoreAnalyticsDoc(cacheSnap.data(), cacheId);
  }
  return null;
}

// Update analytics cache
async function updateAnalyticsCache(
  type: string,
  period: "daily" | "weekly" | "monthly",
  value: number
): Promise<void> {
  const cacheId = `${type}_${period}`;
  const cacheRef = doc(db, COLLECTIONS.ANALYTICS, cacheId);

  const expiresAt = new Date();
  expiresAt.setTime(
    expiresAt.getTime() +
      CACHE_DURATION[period.toUpperCase() as keyof typeof CACHE_DURATION]
  );

  await setDoc(cacheRef, {
    type,
    period,
    value,
    lastUpdated: serverTimestamp(),
    expiresAt,
  });
}

// Calculate active users for a given period
async function calculateActiveUsers(
  period: "daily" | "weekly" | "monthly"
): Promise<number> {
  const now = new Date();
  const startDate = new Date();

  // Calculate start date based on period
  switch (period) {
    case "daily":
      startDate.setDate(now.getDate() - 1);
      break;
    case "weekly":
      startDate.setDate(now.getDate() - 7);
      break;
    case "monthly":
      startDate.setDate(now.getDate() - 30);
      break;
  }

  // Query users who logged in within the period
  const usersRef = collection(db, COLLECTIONS.USERS);
  const q = query(
    usersRef,
    where("lastLoginAt", ">=", startDate),
    orderBy("lastLoginAt", "desc")
  );

  const querySnapshot = await getDocs(q);
  return querySnapshot.size;
}

// Main function to get active users with caching
export async function getActiveUsers(
  period: "daily" | "weekly" | "monthly"
): Promise<number> {
  let cached: AnalyticsCache | null = null;

  try {
    // 1. Check cache first
    cached = await getCachedAnalytics("active_users", period);
    if (cached && !isCacheExpired(cached)) {
      return cached.value;
    }

    // 2. Calculate fresh data
    const count = await calculateActiveUsers(period);

    // 3. Update cache
    await updateAnalyticsCache("active_users", period, count);

    return count;
  } catch (error) {
    console.error(`Error getting active users for ${period}:`, error);

    // Return cached value even if expired, or 0 if no cache
    if (cached) {
      return cached.value;
    }
    return 0;
  }
}

// Get all active users analytics
export async function getActiveUsersAnalytics(): Promise<ActiveUsersAnalytics> {
  const [daily, weekly, monthly] = await Promise.all([
    getActiveUsers("daily"),
    getActiveUsers("weekly"),
    getActiveUsers("monthly"),
  ]);

  return {
    daily,
    weekly,
    monthly,
    lastUpdated: new Date(),
  };
}

// Get total counts for other metrics
export async function getTotalFeatureRequests(): Promise<number> {
  try {
    const featureRequestsRef = collection(db, COLLECTIONS.FEATURE_REQUESTS);
    const querySnapshot = await getDocs(featureRequestsRef);
    return querySnapshot.size;
  } catch (error) {
    console.error("Error getting total feature requests:", error);
    return 0;
  }
}

export async function getTotalComments(): Promise<number> {
  try {
    const commentsRef = collection(db, COLLECTIONS.COMMENTS);
    const querySnapshot = await getDocs(commentsRef);
    return querySnapshot.size;
  } catch (error) {
    console.error("Error getting total comments:", error);
    return 0;
  }
}

export async function getTotalLabels(): Promise<number> {
  try {
    const labelsRef = collection(db, COLLECTIONS.LABELS);
    const querySnapshot = await getDocs(labelsRef);
    return querySnapshot.size;
  } catch (error) {
    console.error("Error getting total labels:", error);
    return 0;
  }
}
