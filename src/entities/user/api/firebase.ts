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
} from "firebase/firestore";
import { db } from "@/shared/config/firebase";
import { COLLECTIONS } from "@/shared/config/constants";
import { User } from "@/shared/types";

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
  const userRef = doc(db, COLLECTIONS.USERS, uid);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    return { ...userSnap.data() } as User;
  }
  return null;
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
