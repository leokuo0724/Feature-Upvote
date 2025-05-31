import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  serverTimestamp,
  increment,
  arrayUnion,
  arrayRemove,
  QueryDocumentSnapshot,
  DocumentData,
  Query,
  CollectionReference,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/shared/config/firebase";
import { COLLECTIONS } from "@/shared/config/constants";
import {
  FeatureRequest,
  CreateFeatureRequestData,
  UpdateFeatureRequestData,
  FeatureRequestsQuery,
  FeatureRequestFilters,
  FeatureRequestSort,
} from "@/shared/types";

// Helper function to convert Firestore document data to FeatureRequest
function convertFirestoreDoc(
  doc: QueryDocumentSnapshot<DocumentData> | DocumentData,
  id?: string
): FeatureRequest {
  const data = "data" in doc ? doc.data() : doc;
  const docId = id || ("id" in doc ? doc.id : "");

  return {
    id: docId,
    title: data.title || "",
    description: data.description || "",
    status: data.status || "Open",
    upvotes: data.upvotes || 0,
    upvotedBy: data.upvotedBy || [],
    labels: data.labels || [],
    authorId: data.authorId || "",
    authorName: data.authorName || "",
    authorEmail: data.authorEmail || "",
    commentsCount: data.commentsCount || 0,
    // Convert Firestore Timestamps to Date objects
    createdAt:
      data.createdAt instanceof Timestamp
        ? data.createdAt.toDate()
        : new Date(data.createdAt || Date.now()),
    updatedAt:
      data.updatedAt instanceof Timestamp
        ? data.updatedAt.toDate()
        : new Date(data.updatedAt || Date.now()),
  };
}

// Create a new feature request
export async function createFeatureRequest(
  data: CreateFeatureRequestData,
  authorId: string,
  authorName: string,
  authorEmail: string
): Promise<string> {
  const featureRequestRef = collection(db, COLLECTIONS.FEATURE_REQUESTS);

  const docRef = await addDoc(featureRequestRef, {
    ...data,
    status: "Open",
    upvotes: 0,
    upvotedBy: [],
    labels: data.labels || [],
    authorId,
    authorName,
    authorEmail,
    commentsCount: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return docRef.id;
}

// Get a single feature request by ID
export async function getFeatureRequest(
  id: string
): Promise<FeatureRequest | null> {
  try {
    const featureRequestRef = doc(db, COLLECTIONS.FEATURE_REQUESTS, id);
    const featureRequestSnap = await getDoc(featureRequestRef);

    if (featureRequestSnap.exists()) {
      return convertFirestoreDoc(featureRequestSnap);
    }
    return null;
  } catch (error) {
    console.error("Error getting feature request:", error);
    return null;
  }
}

// Update a feature request
export async function updateFeatureRequest(
  id: string,
  updates: UpdateFeatureRequestData
): Promise<void> {
  const featureRequestRef = doc(db, COLLECTIONS.FEATURE_REQUESTS, id);
  await updateDoc(featureRequestRef, {
    ...updates,
    updatedAt: serverTimestamp(),
  });
}

// Delete a feature request
export async function deleteFeatureRequest(id: string): Promise<void> {
  const featureRequestRef = doc(db, COLLECTIONS.FEATURE_REQUESTS, id);
  await deleteDoc(featureRequestRef);
}

// Toggle upvote for a feature request
export async function toggleUpvote(
  featureRequestId: string,
  userId: string
): Promise<void> {
  const featureRequestRef = doc(
    db,
    COLLECTIONS.FEATURE_REQUESTS,
    featureRequestId
  );
  const featureRequestSnap = await getDoc(featureRequestRef);

  if (!featureRequestSnap.exists()) {
    throw new Error("Feature request not found");
  }

  const data = featureRequestSnap.data();
  const upvotedBy = data.upvotedBy || [];
  const hasUpvoted = upvotedBy.includes(userId);

  if (hasUpvoted) {
    // Remove upvote
    await updateDoc(featureRequestRef, {
      upvotes: increment(-1),
      upvotedBy: arrayRemove(userId),
      updatedAt: serverTimestamp(),
    });
  } else {
    // Add upvote
    await updateDoc(featureRequestRef, {
      upvotes: increment(1),
      upvotedBy: arrayUnion(userId),
      updatedAt: serverTimestamp(),
    });
  }
}

// Build Firestore query based on filters and sorting
function buildQuery(queryParams: FeatureRequestsQuery): Query<DocumentData> {
  const { filters, sort, limit: queryLimit } = queryParams;

  const collectionRef = collection(db, COLLECTIONS.FEATURE_REQUESTS);
  let q: Query<DocumentData> = collectionRef;

  // Apply filters
  if (filters?.status) {
    q = query(q, where("status", "==", filters.status));
  }

  // Apply multiple status filter (for tab groups)
  if (filters?.statuses && filters.statuses.length > 0) {
    if (filters.statuses.length === 1) {
      q = query(q, where("status", "==", filters.statuses[0]));
    } else {
      // Use "in" operator for multiple statuses (max 10 values)
      q = query(q, where("status", "in", filters.statuses));
    }
  }

  if (filters?.labels && filters.labels.length > 0) {
    q = query(q, where("labels", "array-contains-any", filters.labels));
  }

  // Apply sorting
  if (sort?.field === "votes") {
    q = query(q, orderBy("upvotes", sort.direction));
  } else {
    // Default sort by creation date
    q = query(q, orderBy("createdAt", sort?.direction || "desc"));
  }

  // Apply limit
  if (queryLimit) {
    q = query(q, limit(queryLimit));
  }

  return q;
}

// Get feature requests with pagination and filtering
export async function getFeatureRequests(
  queryParams: FeatureRequestsQuery = {}
): Promise<{
  featureRequests: FeatureRequest[];
  hasMore: boolean;
  lastDoc?: QueryDocumentSnapshot<DocumentData>;
}> {
  const requestedLimit = queryParams.limit || 10;

  // Request one extra document to check if there are more pages
  const q = buildQuery({
    ...queryParams,
    limit: requestedLimit + 1,
  });

  const querySnapshot = await getDocs(q);

  const allDocs: FeatureRequest[] = [];
  querySnapshot.forEach((doc) => {
    allDocs.push(convertFirestoreDoc(doc));
  });

  // Check if we have more than the requested limit
  const hasMore = allDocs.length > requestedLimit;

  // Return only the requested number of documents
  const featureRequests = hasMore ? allDocs.slice(0, requestedLimit) : allDocs;

  // Get the last document for the next page cursor
  const lastDoc =
    featureRequests.length > 0
      ? querySnapshot.docs[featureRequests.length - 1]
      : undefined;

  return {
    featureRequests,
    hasMore,
    lastDoc,
  };
}

// Get feature requests for pagination (with cursor)
export async function getFeatureRequestsWithCursor(
  queryParams: FeatureRequestsQuery,
  lastDoc?: QueryDocumentSnapshot<DocumentData>
): Promise<{
  featureRequests: FeatureRequest[];
  hasMore: boolean;
  lastDoc?: QueryDocumentSnapshot<DocumentData>;
}> {
  try {
    const requestedLimit = queryParams.limit || 10;

    // Request one extra document to check if there are more pages
    let q = buildQuery({
      ...queryParams,
      limit: requestedLimit + 1,
    });

    // Add cursor for pagination
    if (lastDoc) {
      q = query(q, startAfter(lastDoc));
    }

    const querySnapshot = await getDocs(q);

    const allDocs: FeatureRequest[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      allDocs.push(convertFirestoreDoc(data, doc.id));
    });

    // Check if we have more than the requested limit
    const hasMore = allDocs.length > requestedLimit;

    // Return only the requested number of documents
    const featureRequests = hasMore
      ? allDocs.slice(0, requestedLimit)
      : allDocs;

    // Get the last document for the next page cursor
    const newLastDoc =
      featureRequests.length > 0
        ? querySnapshot.docs[featureRequests.length - 1]
        : undefined;

    return {
      featureRequests,
      hasMore,
      lastDoc: newLastDoc,
    };
  } catch (error) {
    console.error("Error in getFeatureRequestsWithCursor:", error);
    throw error;
  }
}

// Search feature requests by title and description
export async function searchFeatureRequests(
  searchTerm: string,
  queryParams: Omit<FeatureRequestsQuery, "filters"> = {}
): Promise<FeatureRequest[]> {
  // Note: Firestore doesn't support full-text search natively
  // This is a simple implementation that gets all documents and filters client-side
  // For production, consider using Algolia or similar service for better search

  const q = buildQuery({
    ...queryParams,
    limit: 100, // Get more documents for client-side filtering
  });

  const querySnapshot = await getDocs(q);
  const featureRequests: FeatureRequest[] = [];

  querySnapshot.forEach((docSnapshot) => {
    const data = docSnapshot.data() as Omit<FeatureRequest, "id">;
    const searchLower = searchTerm.toLowerCase();

    if (
      data.title.toLowerCase().includes(searchLower) ||
      data.description.toLowerCase().includes(searchLower)
    ) {
      featureRequests.push(convertFirestoreDoc(docSnapshot));
    }
  });

  return featureRequests;
}

// Increment comment count
export async function incrementCommentCount(
  featureRequestId: string
): Promise<void> {
  const featureRequestRef = doc(
    db,
    COLLECTIONS.FEATURE_REQUESTS,
    featureRequestId
  );
  await updateDoc(featureRequestRef, {
    commentsCount: increment(1),
    updatedAt: serverTimestamp(),
  });
}

// Decrement comment count
export async function decrementCommentCount(
  featureRequestId: string
): Promise<void> {
  const featureRequestRef = doc(
    db,
    COLLECTIONS.FEATURE_REQUESTS,
    featureRequestId
  );
  await updateDoc(featureRequestRef, {
    commentsCount: increment(-1),
    updatedAt: serverTimestamp(),
  });
}

// Get status counts efficiently
export async function getStatusCounts(): Promise<{
  all: number;
  open: number;
  "in-progress": number;
  done: number;
  archived: number;
}> {
  try {
    // Get counts for each status group using separate queries
    const collectionRef = collection(db, COLLECTIONS.FEATURE_REQUESTS);

    // Query for each status to get counts
    const [
      openQuery,
      consideringQuery,
      willDoQuery,
      inProgressQuery,
      completedQuery,
      wontDoQuery,
      archivedQuery,
    ] = await Promise.all([
      getDocs(query(collectionRef, where("status", "==", "Open"))),
      getDocs(query(collectionRef, where("status", "==", "Considering"))),
      getDocs(query(collectionRef, where("status", "==", "Will Do"))),
      getDocs(query(collectionRef, where("status", "==", "In Progress"))),
      getDocs(query(collectionRef, where("status", "==", "Completed"))),
      getDocs(query(collectionRef, where("status", "==", "Won't Do"))),
      getDocs(query(collectionRef, where("status", "==", "Archived"))),
    ]);

    const openCount = openQuery.size;
    const consideringCount = consideringQuery.size;
    const willDoCount = willDoQuery.size;
    const inProgressCount = inProgressQuery.size;
    const completedCount = completedQuery.size;
    const wontDoCount = wontDoQuery.size;
    const archivedCount = archivedQuery.size;

    return {
      // "all" excludes archived
      all:
        openCount +
        consideringCount +
        willDoCount +
        inProgressCount +
        completedCount +
        wontDoCount,
      open: openCount + consideringCount + willDoCount,
      "in-progress": inProgressCount,
      done: completedCount + wontDoCount,
      archived: archivedCount,
    };
  } catch (error) {
    console.error("Error getting status counts:", error);
    return {
      all: 0,
      open: 0,
      "in-progress": 0,
      done: 0,
      archived: 0,
    };
  }
}
