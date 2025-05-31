import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
  QueryDocumentSnapshot,
  DocumentData,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/shared/config/firebase";
import { COLLECTIONS } from "@/shared/config/constants";
import { Label, CreateLabelData, UpdateLabelData } from "@/shared/types";

// Helper function to convert Firestore document data to Label
function convertFirestoreLabelDoc(
  doc: QueryDocumentSnapshot<DocumentData> | DocumentData,
  id?: string
): Label {
  const data = "data" in doc ? doc.data() : doc;
  const docId = id || ("id" in doc ? doc.id : "");

  return {
    id: docId,
    name: data.name || "",
    backgroundColor: data.backgroundColor || "#f3f4f6",
    textColor: data.textColor || "#374151",
    createdBy: data.createdBy || "",
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

// Create a new label
export async function createLabel(
  data: CreateLabelData,
  createdBy: string
): Promise<string> {
  const labelRef = collection(db, COLLECTIONS.LABELS);

  const docRef = await addDoc(labelRef, {
    ...data,
    createdBy,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return docRef.id;
}

// Get a single label by ID
export async function getLabel(id: string): Promise<Label | null> {
  const labelRef = doc(db, COLLECTIONS.LABELS, id);
  const labelSnap = await getDoc(labelRef);

  if (labelSnap.exists()) {
    return convertFirestoreLabelDoc(labelSnap);
  }
  return null;
}

// Get all labels
export async function getLabels(): Promise<Label[]> {
  const q = query(collection(db, COLLECTIONS.LABELS), orderBy("name", "asc"));

  const querySnapshot = await getDocs(q);
  const labels: Label[] = [];

  querySnapshot.forEach((doc) => {
    labels.push(convertFirestoreLabelDoc(doc));
  });

  return labels;
}

// Update a label
export async function updateLabel(
  id: string,
  updates: UpdateLabelData
): Promise<void> {
  const labelRef = doc(db, COLLECTIONS.LABELS, id);
  await updateDoc(labelRef, {
    ...updates,
    updatedAt: serverTimestamp(),
  });
}

// Delete a label
export async function deleteLabel(id: string): Promise<void> {
  const labelRef = doc(db, COLLECTIONS.LABELS, id);
  await deleteDoc(labelRef);
}
