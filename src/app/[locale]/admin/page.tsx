"use client";

import Link from "next/link";
import { Settings, Tag, RefreshCw, Crown } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
} from "@/shared/ui";
import { useAuth } from "@/shared/hooks/use-auth";
import {
  useActiveUsers,
  useTotalFeatureRequests,
  useTotalComments,
} from "@/entities/analytics";

const adminFeatures = [
  {
    title: "userManagement",
    description: "userManagement",
    icon: Crown,
    href: "/admin/users",
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    disabled: false,
  },
  {
    title: "labelManagement",
    description: "labelManagement",
    icon: Tag,
    href: "/admin/labels",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    disabled: false,
  },
  {
    title: "settings",
    description: "settings",
    icon: Settings,
    href: "/admin/settings",
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    disabled: false,
  },
];

interface StatCardProps {
  title: string;
  value: number | undefined;
  isLoading: boolean;
  error: Error | null;
  onRefresh?: () => void;
}

function StatCard({
  title,
  value,
  isLoading,
  error,
  onRefresh,
}: StatCardProps) {
  const t = useTranslations("admin");

  return (
    <Card>
      <CardContent className="pt-4">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="text-2xl font-bold text-primary">
              {isLoading ? (
                <div className="animate-pulse bg-muted h-8 w-16 rounded mx-auto"></div>
              ) : error ? (
                t("overview.error")
              ) : (
                value?.toLocaleString() || "0"
              )}
            </div>
            {onRefresh && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={onRefresh}
                disabled={isLoading}
              >
                <RefreshCw
                  className={`h-3 w-3 ${isLoading ? "animate-spin" : ""}`}
                />
              </Button>
            )}
          </div>
          <p className="text-sm text-muted-foreground">{title}</p>
          {error && (
            <p className="text-xs text-destructive mt-1">
              {t("overview.failedToLoad")}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function AdminPage() {
  const { user } = useAuth();
  const t = useTranslations("admin");

  // Analytics queries
  const {
    data: activeUsers,
    isLoading: activeUsersLoading,
    error: activeUsersError,
    refetch: refetchActiveUsers,
  } = useActiveUsers("monthly");

  const {
    data: totalFeatureRequests,
    isLoading: featureRequestsLoading,
    error: featureRequestsError,
    refetch: refetchFeatureRequests,
  } = useTotalFeatureRequests();

  const {
    data: totalComments,
    isLoading: commentsLoading,
    error: commentsError,
    refetch: refetchComments,
  } = useTotalComments();

  // Redirect if not admin
  if (user && !user.isAdmin) {
    return (
      <div className="container mx-auto py-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">
            {t("access.denied.title")}
          </h1>
          <p className="text-muted-foreground">{t("access.denied.message")}</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto py-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">
            {t("access.signInRequired.title")}
          </h1>
          <p className="text-muted-foreground">
            {t("access.signInRequired.message")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">{t("title")}</h1>
          <p className="text-muted-foreground mt-2">{t("subtitle")}</p>
        </div>

        {/* Admin Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {adminFeatures.map((feature) => {
            const IconComponent = feature.icon;

            if (feature.disabled) {
              return (
                <Card
                  key={feature.title}
                  className="opacity-50 cursor-not-allowed"
                >
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${feature.bgColor}`}>
                        <IconComponent className={`h-6 w-6 ${feature.color}`} />
                      </div>
                      <div>
                        <CardTitle className="text-lg">
                          {t(`features.${feature.title}.title`)}
                        </CardTitle>
                        <CardDescription className="text-sm">
                          {t("status.comingSoon")}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {t(`features.${feature.description}.description`)}
                    </p>
                  </CardContent>
                </Card>
              );
            }

            return (
              <Link key={feature.title} href={feature.href}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${feature.bgColor}`}>
                        <IconComponent className={`h-6 w-6 ${feature.color}`} />
                      </div>
                      <div>
                        <CardTitle className="text-lg">
                          {t(`features.${feature.title}.title`)}
                        </CardTitle>
                        <CardDescription className="text-sm">
                          {t("status.manageAndConfigure")}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {t(`features.${feature.description}.description`)}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Quick Stats */}
        <div className="mt-12">
          <h2 className="text-xl font-semibold mb-4">{t("overview.title")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard
              title={t("overview.stats.activeUsers")}
              value={activeUsers}
              isLoading={activeUsersLoading}
              error={activeUsersError}
            />
            <StatCard
              title={t("overview.stats.totalFeatureRequests")}
              value={totalFeatureRequests}
              isLoading={featureRequestsLoading}
              error={featureRequestsError}
            />
            <StatCard
              title={t("overview.stats.totalComments")}
              value={totalComments}
              isLoading={commentsLoading}
              error={commentsError}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
