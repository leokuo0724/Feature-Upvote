"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/shared/ui";
import { useSettings } from "@/shared/contexts/settings-context";

export function WelcomeBanner() {
  const { settings } = useSettings();

  // Don't render if banner is disabled or not configured
  if (!settings.welcomeBanner?.enabled) {
    return null;
  }

  const { welcomeBanner } = settings;

  return (
    <div
      className="relative bg-gradient-to-r from-primary/10 to-primary/5 border rounded-lg p-8 mb-8"
      style={{
        backgroundImage: welcomeBanner.backgroundImage
          ? `url(${welcomeBanner.backgroundImage})`
          : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {welcomeBanner.backgroundImage && (
        <div className="absolute inset-0 bg-black/40 rounded-lg" />
      )}

      <div className="relative z-10 text-center max-w-3xl mx-auto">
        <h1
          className={`text-4xl font-bold mb-4 ${
            welcomeBanner.backgroundImage ? "text-white" : "text-foreground"
          }`}
        >
          {welcomeBanner.title}
        </h1>

        <p
          className={`text-lg mb-6 ${
            welcomeBanner.backgroundImage
              ? "text-white/90"
              : "text-muted-foreground"
          }`}
        >
          {welcomeBanner.description}
        </p>

        {welcomeBanner.ctaText && welcomeBanner.ctaLink && (
          <Link href={welcomeBanner.ctaLink}>
            <Button size="lg" className="font-semibold">
              {welcomeBanner.ctaText}
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}
