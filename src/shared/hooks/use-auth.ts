"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { auth } from "@/shared/config/firebase";
import { User } from "@/shared/types";
import { isAdmin } from "@/shared/lib";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (firebaseUser: FirebaseUser | null) => {
        if (firebaseUser) {
          const userData: User = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
            isAdmin: isAdmin(firebaseUser.email),
          };
          setUser(userData);
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return { user, loading };
}
