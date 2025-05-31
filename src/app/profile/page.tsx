"use client";

import React from "react";
import { formatDistanceToNow } from "date-fns";
import {
  User,
  Calendar,
  FileText,
  Crown,
  Settings,
  RefreshCw,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
  Button,
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/ui";
import { useAuth } from "@/shared/hooks/use-auth";
import { FeatureRequestCard } from "@/widgets/feature-request-card";
import {
  useUserStats,
  useUserFeatureRequests,
} from "@/entities/user/api/queries";
import { formatCount } from "@/shared/lib/utils";
import { FeatureRequest } from "@/shared/types";

export default function ProfilePage() {
  const { user, loading } = useAuth();

  // Get user data
  const {
    data: userStats,
    isLoading: statsLoading,
    error: statsError,
    refetch: refetchStats,
  } = useUserStats(user?.uid || "");

  const {
    data: featureRequestsData,
    isLoading: featureRequestsLoading,
    error: featureRequestsError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useUserFeatureRequests(user?.uid || "");

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Loading...</h1>
          <p className="text-muted-foreground">
            Please wait while we load your profile.
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto py-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Please Sign In</h1>
          <p className="text-muted-foreground">
            You need to sign in to view your profile.
          </p>
        </div>
      </div>
    );
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleFeatureRequestClick = (featureRequest: FeatureRequest) => {
    window.location.href = `/feature-requests/${featureRequest.id}`;
  };

  // Flatten all feature requests from all pages
  const allFeatureRequests =
    featureRequestsData?.pages.flatMap((page) => page.featureRequests) || [];

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Profile Header */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={user.photoURL || undefined} />
                <AvatarFallback className="text-lg">
                  {getInitials(user.displayName || "User")}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <h1 className="text-2xl font-bold">
                    {user.displayName || "Anonymous User"}
                  </h1>
                  {user.isAdmin && (
                    <Badge
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      <Crown className="h-3 w-3" />
                      Admin
                    </Badge>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    <span>{user.email}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>
                      Joined{" "}
                      {user.createdAt
                        ? formatDistanceToNow(user.createdAt, {
                            addSuffix: true,
                          })
                        : "recently"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardContent className="pt-4">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <div className="text-2xl font-bold text-primary">
                    {statsLoading ? (
                      <div className="animate-pulse bg-muted h-8 w-8 rounded"></div>
                    ) : (
                      formatCount(userStats?.featureRequestsCount || 0)
                    )}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Feature Requests
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-1">
                  {statsLoading ? (
                    <div className="animate-pulse bg-muted h-8 w-8 rounded mx-auto"></div>
                  ) : (
                    formatCount(userStats?.commentsCount || 0)
                  )}
                </div>
                <p className="text-sm text-muted-foreground">Comments</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Content Tabs */}
        <Card>
          <CardHeader>
            <CardTitle>My Feature Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mt-6">
              {featureRequestsLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-48 bg-muted animate-pulse rounded-lg"
                    />
                  ))}
                </div>
              ) : featureRequestsError ? (
                <div className="text-center py-12">
                  <p className="text-destructive mb-4">
                    Error loading your feature requests
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => window.location.reload()}
                  >
                    Try Again
                  </Button>
                </div>
              ) : allFeatureRequests.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">
                    You haven't created any feature requests yet.
                  </p>
                  <Button
                    onClick={() => (window.location.href = "/feature-requests")}
                  >
                    Create Your First Request
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {allFeatureRequests.map((featureRequest) => (
                      <FeatureRequestCard
                        key={featureRequest.id}
                        featureRequest={featureRequest}
                        onClick={handleFeatureRequestClick}
                        showActions={false}
                      />
                    ))}
                  </div>

                  {/* Load More Button */}
                  {hasNextPage && (
                    <div className="flex justify-center mt-8">
                      <Button
                        onClick={() => fetchNextPage()}
                        disabled={isFetchingNextPage}
                        variant="outline"
                        className="flex items-center gap-2"
                      >
                        {isFetchingNextPage ? (
                          <>
                            <RefreshCw className="h-4 w-4 animate-spin" />
                            Loading...
                          </>
                        ) : (
                          "Load More"
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
