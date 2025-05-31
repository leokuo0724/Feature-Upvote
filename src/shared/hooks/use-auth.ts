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
import { useIsAdmin, useUpsertUserOnLogin } from "@/entities/user/api/queries";

export function useAuth() {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Check if user is admin
  const { data: isAdmin = false } = useIsAdmin(firebaseUser?.email || null);

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

  // Construct the user object
  const user: User | null = firebaseUser
    ? {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL,
        isAdmin,
        createdAt: new Date(), // This will be overridden by Firestore data
        updatedAt: new Date(), // This will be overridden by Firestore data
        lastLoginAt: new Date(), // This will be overridden by Firestore data
      }
    : null;

  return { user, loading, signIn, signOut };
}
