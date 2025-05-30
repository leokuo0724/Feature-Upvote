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
  QueryDocumentSnapshot,
  DocumentData,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/shared/config/firebase";
import { COLLECTIONS } from "@/shared/config/constants";
import {
  Comment,
  CreateCommentData,
  UpdateCommentData,
  CommentsQuery,
} from "@/shared/types";

// Helper function to convert Firestore document data to Comment
function convertFirestoreCommentDoc(
  doc: QueryDocumentSnapshot<DocumentData> | DocumentData,
  id?: string
): Comment {
  const data = "data" in doc ? doc.data() : doc;
  const docId = id || ("id" in doc ? doc.id : "");

  return {
    id: docId,
    content: data.content || "",
    featureRequestId: data.featureRequestId || "",
    authorId: data.authorId || "",
    authorName: data.authorName || "",
    authorEmail: data.authorEmail || "",
    authorPhotoURL: data.authorPhotoURL || "",
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

// Create a new comment
export async function createComment(
  data: CreateCommentData,
  authorId: string,
  authorName: string,
  authorEmail: string,
  authorPhotoURL?: string
): Promise<string> {
  const commentRef = collection(db, COLLECTIONS.COMMENTS);

  const docRef = await addDoc(commentRef, {
    ...data,
    authorId,
    authorName,
    authorEmail,
    authorPhotoURL,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return docRef.id;
}

// Get a single comment by ID
export async function getComment(id: string): Promise<Comment | null> {
  const commentRef = doc(db, COLLECTIONS.COMMENTS, id);
  const commentSnap = await getDoc(commentRef);

  if (commentSnap.exists()) {
    return convertFirestoreCommentDoc(commentSnap);
  }
  return null;
}

// Update a comment
export async function updateComment(
  id: string,
  updates: UpdateCommentData
): Promise<void> {
  const commentRef = doc(db, COLLECTIONS.COMMENTS, id);
  await updateDoc(commentRef, {
    ...updates,
    updatedAt: serverTimestamp(),
  });
}

// Delete a comment
export async function deleteComment(id: string): Promise<void> {
  const commentRef = doc(db, COLLECTIONS.COMMENTS, id);
  await deleteDoc(commentRef);
}

// Get comments for a feature request
export async function getComments(queryParams: CommentsQuery): Promise<{
  comments: Comment[];
  hasMore: boolean;
  lastDoc?: QueryDocumentSnapshot<DocumentData>;
}> {
  const { featureRequestId, limit: queryLimit = 20 } = queryParams;

  let q = query(
    collection(db, COLLECTIONS.COMMENTS),
    where("featureRequestId", "==", featureRequestId),
    orderBy("createdAt", "asc"), // Show oldest comments first
    limit(queryLimit)
  );

  const querySnapshot = await getDocs(q);

  const comments: Comment[] = [];
  querySnapshot.forEach((doc) => {
    comments.push(convertFirestoreCommentDoc(doc));
  });

  const hasMore = querySnapshot.docs.length === queryLimit;
  const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1];

  return {
    comments,
    hasMore,
    lastDoc,
  };
}

// Get comments with pagination cursor
export async function getCommentsWithCursor(
  queryParams: CommentsQuery,
  lastDoc?: QueryDocumentSnapshot<DocumentData>
): Promise<{
  comments: Comment[];
  hasMore: boolean;
  lastDoc?: QueryDocumentSnapshot<DocumentData>;
}> {
  const { featureRequestId, limit: queryLimit = 20 } = queryParams;

  let q = query(
    collection(db, COLLECTIONS.COMMENTS),
    where("featureRequestId", "==", featureRequestId),
    orderBy("createdAt", "asc"),
    limit(queryLimit)
  );

  // Add cursor for pagination
  if (lastDoc) {
    q = query(q, startAfter(lastDoc));
  }

  const querySnapshot = await getDocs(q);

  const comments: Comment[] = [];
  querySnapshot.forEach((doc) => {
    comments.push(convertFirestoreCommentDoc(doc));
  });

  const hasMore = querySnapshot.docs.length === queryLimit;
  const newLastDoc = querySnapshot.docs[querySnapshot.docs.length - 1];

  return {
    comments,
    hasMore,
    lastDoc: newLastDoc,
  };
}

// Get comment count for a feature request
export async function getCommentCount(
  featureRequestId: string
): Promise<number> {
  const q = query(
    collection(db, COLLECTIONS.COMMENTS),
    where("featureRequestId", "==", featureRequestId)
  );

  const querySnapshot = await getDocs(q);
  return querySnapshot.size;
}
