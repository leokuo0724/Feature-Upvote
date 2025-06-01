import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/shared/config/firebase";
import { COLLECTIONS } from "@/shared/config/constants";
import { AppSettings, DEFAULT_SETTINGS } from "@/shared/types/settings";

const SETTINGS_DOC_ID = "app-settings";

// Helper function to convert Firestore document data to AppSettings
function convertFirestoreSettingsDoc(doc: any): AppSettings {
  const data = doc.data();
  return {
    projectName: data.projectName || DEFAULT_SETTINGS.projectName!,
    tagline: data.tagline || DEFAULT_SETTINGS.tagline!,
    primaryColor: data.primaryColor || DEFAULT_SETTINGS.primaryColor!,
    defaultTheme: data.defaultTheme || DEFAULT_SETTINGS.defaultTheme!,
    createdAt:
      data.createdAt instanceof Timestamp
        ? data.createdAt.toDate()
        : new Date(data.createdAt || Date.now()),
    updatedAt:
      data.updatedAt instanceof Timestamp
        ? data.updatedAt.toDate()
        : new Date(data.updatedAt || Date.now()),
    updatedBy: data.updatedBy || "",
  };
}

// Get app settings
export async function getAppSettings(): Promise<AppSettings> {
  try {
    const settingsRef = doc(db, COLLECTIONS.SETTINGS, SETTINGS_DOC_ID);
    const settingsSnap = await getDoc(settingsRef);

    if (settingsSnap.exists()) {
      return convertFirestoreSettingsDoc(settingsSnap);
    } else {
      // Return default settings if no settings document exists
      return {
        ...DEFAULT_SETTINGS,
        createdAt: new Date(),
        updatedAt: new Date(),
        updatedBy: "",
      } as AppSettings;
    }
  } catch (error) {
    console.error("Error getting app settings:", error);
    // Return default settings on error
    return {
      ...DEFAULT_SETTINGS,
      createdAt: new Date(),
      updatedAt: new Date(),
      updatedBy: "",
    } as AppSettings;
  }
}

// Update app settings
export async function updateAppSettings(
  updates: Partial<AppSettings>,
  updatedBy: string
): Promise<void> {
  try {
    const settingsRef = doc(db, COLLECTIONS.SETTINGS, SETTINGS_DOC_ID);
    const settingsSnap = await getDoc(settingsRef);

    if (settingsSnap.exists()) {
      // Update existing settings
      await updateDoc(settingsRef, {
        ...updates,
        updatedAt: serverTimestamp(),
        updatedBy,
      });
    } else {
      // Create new settings document
      await setDoc(settingsRef, {
        ...DEFAULT_SETTINGS,
        ...updates,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        updatedBy,
      });
    }
  } catch (error) {
    console.error("Error updating app settings:", error);
    throw error;
  }
}

// Reset settings to default
export async function resetAppSettings(updatedBy: string): Promise<void> {
  try {
    const settingsRef = doc(db, COLLECTIONS.SETTINGS, SETTINGS_DOC_ID);
    await setDoc(settingsRef, {
      ...DEFAULT_SETTINGS,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      updatedBy,
    });
  } catch (error) {
    console.error("Error resetting app settings:", error);
    throw error;
  }
}
