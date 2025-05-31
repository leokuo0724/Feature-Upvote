import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  serverTimestamp,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/shared/config/firebase";
import { COLLECTIONS } from "@/shared/config/constants";
import { User, FeatureRequest } from "@/shared/types";

// Helper function to convert Firestore document data to User
function convertFirestoreUserDoc(doc: any): User {
  const data = doc.data();
  return {
    uid: doc.id,
    email: data.email || "",
    displayName: data.displayName || "",
    photoURL: data.photoURL || "",
    isAdmin: data.isAdmin || false,
    createdAt:
      data.createdAt instanceof Timestamp
        ? data.createdAt.toDate()
        : new Date(data.createdAt || Date.now()),
    updatedAt:
      data.updatedAt instanceof Timestamp
        ? data.updatedAt.toDate()
        : new Date(data.updatedAt || Date.now()),
    lastLoginAt:
      data.lastLoginAt instanceof Timestamp
        ? data.lastLoginAt.toDate()
        : new Date(data.lastLoginAt || Date.now()),
  };
}

// Helper function to convert Firestore document data to FeatureRequest
function convertFirestoreDoc(doc: any): FeatureRequest {
  const data = doc.data();
  return {
    id: doc.id,
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

export async function createUser(
  userData: Omit<User, "createdAt" | "updatedAt" | "lastLoginAt">
): Promise<void> {
  const userRef = doc(db, COLLECTIONS.USERS, userData.uid);
  await setDoc(userRef, {
    ...userData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    lastLoginAt: serverTimestamp(),
  });
}

export async function upsertUserOnLogin(
  userData: Omit<User, "createdAt" | "updatedAt" | "lastLoginAt" | "isAdmin">
): Promise<void> {
  const userRef = doc(db, COLLECTIONS.USERS, userData.uid);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    await updateDoc(userRef, {
      email: userData.email,
      displayName: userData.displayName,
      photoURL: userData.photoURL,
      lastLoginAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  } else {
    await setDoc(userRef, {
      ...userData,
      isAdmin: false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      lastLoginAt: serverTimestamp(),
    });
  }
}

export async function getUser(uid: string): Promise<User | null> {
  try {
    const userRef = doc(db, COLLECTIONS.USERS, uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      return convertFirestoreUserDoc(userSnap);
    }
    return null;
  } catch (error) {
    console.error("Error getting user:", error);
    return null;
  }
}

export async function updateUser(
  uid: string,
  updates: Partial<User>
): Promise<void> {
  const userRef = doc(db, COLLECTIONS.USERS, uid);
  await updateDoc(userRef, {
    ...updates,
    updatedAt: serverTimestamp(),
  });
}

export async function checkIsAdmin(email: string): Promise<boolean> {
  if (!email) return false;

  const adminEmailRef = doc(db, COLLECTIONS.ADMIN_EMAILS, email);
  const adminEmailSnap = await getDoc(adminEmailRef);

  return adminEmailSnap.exists();
}

export async function addAdminEmail(
  email: string,
  addedBy: string
): Promise<void> {
  const adminEmailRef = doc(db, COLLECTIONS.ADMIN_EMAILS, email);
  await setDoc(adminEmailRef, {
    email,
    addedBy,
    addedAt: serverTimestamp(),
  });
}

export async function removeAdminEmail(email: string): Promise<void> {
  const adminEmailRef = doc(db, COLLECTIONS.ADMIN_EMAILS, email);
  await updateDoc(adminEmailRef, {
    deletedAt: serverTimestamp(),
  });
}

export async function getAdminEmails(): Promise<string[]> {
  const q = query(collection(db, COLLECTIONS.ADMIN_EMAILS));
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs
    .filter((doc) => !doc.data().deletedAt)
    .map((doc) => doc.data().email);
}

// Get user's feature requests
export async function getUserFeatureRequests(
  userId: string
): Promise<FeatureRequest[]> {
  try {
    const featureRequestsRef = collection(db, COLLECTIONS.FEATURE_REQUESTS);
    const q = query(
      featureRequestsRef,
      where("authorId", "==", userId),
      orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(q);
    const featureRequests: FeatureRequest[] = [];

    querySnapshot.forEach((doc) => {
      featureRequests.push(convertFirestoreDoc(doc));
    });

    return featureRequests;
  } catch (error) {
    console.error("Error getting user feature requests:", error);
    return [];
  }
}

// Get feature requests user has voted on
export async function getUserVotedFeatureRequests(
  userId: string
): Promise<FeatureRequest[]> {
  try {
    const featureRequestsRef = collection(db, COLLECTIONS.FEATURE_REQUESTS);
    const q = query(
      featureRequestsRef,
      where("upvotedBy", "array-contains", userId),
      orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(q);
    const featureRequests: FeatureRequest[] = [];

    querySnapshot.forEach((doc) => {
      featureRequests.push(convertFirestoreDoc(doc));
    });

    return featureRequests;
  } catch (error) {
    console.error("Error getting user voted feature requests:", error);
    return [];
  }
}

// Get user statistics
export async function getUserStats(userId: string): Promise<{
  featureRequestsCount: number;
  commentsCount: number;
}> {
  try {
    // Get user's feature requests count
    const featureRequestsRef = collection(db, COLLECTIONS.FEATURE_REQUESTS);
    const featureRequestsQuery = query(
      featureRequestsRef,
      where("authorId", "==", userId)
    );
    const featureRequestsSnapshot = await getDocs(featureRequestsQuery);

    // Get comments count
    const commentsRef = collection(db, COLLECTIONS.COMMENTS);
    const commentsQuery = query(commentsRef, where("authorId", "==", userId));
    const commentsSnapshot = await getDocs(commentsQuery);

    return {
      featureRequestsCount: featureRequestsSnapshot.size,
      commentsCount: commentsSnapshot.size,
    };
  } catch (error) {
    console.error("Error getting user stats:", error);
    return {
      featureRequestsCount: 0,
      commentsCount: 0,
    };
  }
}
