export interface AppSettings {
  // Basic branding
  projectName: string;
  tagline: string;

  // Theme settings
  primaryColor: string;
  defaultTheme: "light" | "dark" | "system";

  // Metadata
  createdAt: Date;
  updatedAt: Date;
  updatedBy: string;
}

export interface ThemeColors {
  primary: string;
  accent: string;
  background: string;
  foreground: string;
  muted: string;
  border: string;
}

export const DEFAULT_SETTINGS: Partial<AppSettings> = {
  projectName: "Feature Upvote",
  tagline: "A feature request and upvoting platform for product teams",
  primaryColor: "#3b82f6", // blue-500
  defaultTheme: "system",
};
