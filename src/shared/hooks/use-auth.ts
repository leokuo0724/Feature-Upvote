"use client";

import { useEffect, useState } from "react";
import {
  onAuthStateChanged,
  User as FirebaseUser,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
} from "firebase/auth";
import { auth } from "@/shared/config/firebase";
import { User } from "@/shared/types";
import {
  useIsAdmin,
  useUpsertUserOnLogin,
  useUser,
} from "@/entities/user/api/queries";

export function useAuth() {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Get user data from Firestore
  const { data: firestoreUser, isLoading: firestoreLoading } = useUser(
    firebaseUser?.uid || null
  );

  // Check if user is admin (fallback if Firestore data not available)
  const { data: isAdminFallback = false } = useIsAdmin(
    firebaseUser?.email || null
  );

  // Mutation to upsert user in Firestore on login
  const upsertUserMutation = useUpsertUserOnLogin();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (user: FirebaseUser | null) => {
        setFirebaseUser(user);

        if (user) {
          // Upsert user in Firestore (create if new, update lastLoginAt if existing)
          try {
            await upsertUserMutation.mutateAsync({
              uid: user.uid,
              email: user.email,
              displayName: user.displayName,
              photoURL: user.photoURL,
            });
          } catch (error) {
            console.error("Error upserting user:", error);
          }
        }

        setLoading(false);
      }
    );

    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array - auth state change only happens on login/logout

  // Sign in with Google
  const signIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Error signing in:", error);
      throw error;
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    }
  };

  // Construct the user object using Firestore data when available
  const user: User | null = firebaseUser
    ? firestoreUser || {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL,
        isAdmin: isAdminFallback,
        createdAt: new Date(), // Fallback - will be replaced when Firestore data loads
        updatedAt: new Date(), // Fallback - will be replaced when Firestore data loads
        lastLoginAt: new Date(), // Fallback - will be replaced when Firestore data loads
      }
    : null;

  return {
    user,
    loading: loading || (firebaseUser && firestoreLoading),
    signIn,
    signOut,
  };
}
