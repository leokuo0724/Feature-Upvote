export interface AppSettings {
  // Basic branding
  projectName: string;
  tagline: string;
  logoUrl?: string;
  faviconUrl?: string;

  // Theme settings
  primaryColor: string;
  defaultTheme: "light" | "dark" | "system";
  customCss?: string;

  // Content customization
  welcomeBanner?: {
    enabled: boolean;
    title: string;
    description: string;
    backgroundImage?: string;
    ctaText?: string;
    ctaLink?: string;
  };

  // Footer content
  footerContent?: {
    companyName: string;
    links: Array<{
      label: string;
      url: string;
    }>;
    socialLinks: Array<{
      platform: string;
      url: string;
    }>;
  };

  // Feature flags
  features: {
    allowAnonymousVoting: boolean;
    requireApproval: boolean;
    enableComments: boolean;
    enableLabels: boolean;
    maxVotesPerUser?: number;
  };

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
  features: {
    allowAnonymousVoting: false,
    requireApproval: false,
    enableComments: true,
    enableLabels: true,
  },
};
