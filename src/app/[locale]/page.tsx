"use client";

import React from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/shared/ui";
import { useSettings } from "@/shared/contexts/settings-context";

export default function HomePage() {
  const { settings } = useSettings();
  const t = useTranslations();

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        {/* Hero Image */}
        <div className="flex justify-center mt-6 sm:mt-0">
          <Image
            src="/home.png"
            alt="Feature Upvote Hero"
            width={400}
            height={300}
            priority
          />
        </div>

        {/* Content */}
        <div className="space-y-4">
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight">
            {settings.projectName}
            <br></br>
            {t("home.upvotingPlatform")}
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            {settings.tagline}
          </p>
          <div className="flex justify-center gap-4 pt-4">
            <Link href="/feature-requests">
              <Button size="lg" className="font-semibold px-8 py-4">
                {t("home.exploreFeatureRequests")}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
