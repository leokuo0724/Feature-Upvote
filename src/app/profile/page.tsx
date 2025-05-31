"use client";

import React, { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import {
  User,
  Calendar,
  ThumbsUp,
  FileText,
  MessageCircle,
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/ui";
import { useAuth } from "@/shared/hooks/use-auth";
import { FeatureRequestCard } from "@/widgets/feature-request-card";
import {
  useUserStats,
  useUserFeatureRequests,
  useUserVotedFeatureRequests,
} from "@/entities/user/api/queries";
import { formatCount } from "@/shared/lib/utils";
import { FeatureRequest } from "@/shared/types";

export default function ProfilePage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("my-requests");

  // Get user data
  const {
    data: userStats,
    isLoading: statsLoading,
    error: statsError,
    refetch: refetchStats,
  } = useUserStats(user?.uid || "");

  const {
    data: userFeatureRequests = [],
    isLoading: featureRequestsLoading,
    error: featureRequestsError,
  } = useUserFeatureRequests(user?.uid || "");

  const {
    data: votedFeatureRequests = [],
    isLoading: votedRequestsLoading,
    error: votedRequestsError,
  } = useUserVotedFeatureRequests(user?.uid || "");

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

              <Button variant="outline" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Edit Profile
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => refetchStats()}
                    disabled={statsLoading}
                  >
                    <RefreshCw
                      className={`h-3 w-3 ${
                        statsLoading ? "animate-spin" : ""
                      }`}
                    />
                  </Button>
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
                    <div className="animate-pulse bg-muted h-8 w-12 rounded mx-auto"></div>
                  ) : (
                    formatCount(userStats?.totalUpvotesReceived || 0)
                  )}
                </div>
                <p className="text-sm text-muted-foreground">Total Upvotes</p>
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

          <Card>
            <CardContent className="pt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-1">
                  {statsLoading ? (
                    <div className="animate-pulse bg-muted h-8 w-8 rounded mx-auto"></div>
                  ) : (
                    formatCount(userStats?.votesGiven || 0)
                  )}
                </div>
                <p className="text-sm text-muted-foreground">Votes Given</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Content Tabs */}
        <Card>
          <CardHeader>
            <CardTitle>My Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="my-requests">
                  My Feature Requests ({userStats?.featureRequestsCount || 0})
                </TabsTrigger>
                <TabsTrigger value="my-votes">
                  My Votes ({userStats?.votesGiven || 0})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="my-requests" className="mt-6">
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
                ) : userFeatureRequests.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">
                      You haven't created any feature requests yet.
                    </p>
                    <Button
                      onClick={() =>
                        (window.location.href = "/feature-requests")
                      }
                    >
                      Create Your First Request
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {userFeatureRequests.map((featureRequest) => (
                      <FeatureRequestCard
                        key={featureRequest.id}
                        featureRequest={featureRequest}
                        onClick={handleFeatureRequestClick}
                        showActions={false}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="my-votes" className="mt-6">
                {votedRequestsLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div
                        key={i}
                        className="h-48 bg-muted animate-pulse rounded-lg"
                      />
                    ))}
                  </div>
                ) : votedRequestsError ? (
                  <div className="text-center py-12">
                    <p className="text-destructive mb-4">
                      Error loading your voted requests
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => window.location.reload()}
                    >
                      Try Again
                    </Button>
                  </div>
                ) : votedFeatureRequests.length === 0 ? (
                  <div className="text-center py-12">
                    <ThumbsUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">
                      You haven't voted on any feature requests yet.
                    </p>
                    <Button
                      onClick={() =>
                        (window.location.href = "/feature-requests")
                      }
                    >
                      Explore Feature Requests
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {votedFeatureRequests.map((featureRequest) => (
                      <FeatureRequestCard
                        key={featureRequest.id}
                        featureRequest={featureRequest}
                        onClick={handleFeatureRequestClick}
                        showActions={false}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
