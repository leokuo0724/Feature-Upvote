"use client";

import React, { useState } from "react";
import { Plus, Filter, SortAsc, SortDesc } from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Badge,
} from "@/shared/ui";
import { FeatureRequestStatus, FeatureRequestSort } from "@/shared/types";
import { useAuth } from "@/shared/hooks/use-auth";
import { useInfiniteFeatureRequests } from "@/entities/feature-request";
import { FeatureRequestCard } from "@/widgets/feature-request-card";
import { CreateFeatureRequestForm } from "@/features/create-feature-request";

const statusTabs = [
  { value: "Open", label: "Open", count: 0 },
  { value: "In Progress", label: "In Progress", count: 0 },
  { value: "Completed", label: "Completed", count: 0 },
] as const;

type SortOption = {
  value: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  sort: FeatureRequestSort;
};

const sortOptions: SortOption[] = [
  {
    value: "upvotes",
    label: "Most Upvoted",
    icon: SortDesc,
    sort: { field: "votes", direction: "desc" },
  },
  {
    value: "createdAt",
    label: "Newest First",
    icon: SortDesc,
    sort: { field: "createdAt", direction: "desc" },
  },
  {
    value: "createdAt_asc",
    label: "Oldest First",
    icon: SortAsc,
    sort: { field: "createdAt", direction: "asc" },
  },
];

export default function FeatureRequestsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<FeatureRequestStatus>("Open");
  const [sortBy, setSortBy] = useState<string>("upvotes");
  const [showCreateForm, setShowCreateForm] = useState(false);

  const currentSort =
    sortOptions.find((opt) => opt.value === sortBy)?.sort ||
    sortOptions[0].sort;

  const queryParams = {
    filters: { status: activeTab },
    sort: currentSort,
    limit: 12,
  };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteFeatureRequests(queryParams);

  const featureRequests =
    data?.pages.flatMap((page) => page.featureRequests) ?? [];

  const handleCreateSuccess = () => {
    // The query will automatically refetch due to cache invalidation
  };

  const handleFeatureRequestClick = (featureRequest: any) => {
    // Navigate to feature request details page
    window.location.href = `/feature-requests/${featureRequest.id}`;
  };

  const getSortIcon = () => {
    const option = sortOptions.find((opt) => opt.value === sortBy);
    return option?.icon || SortDesc;
  };

  const getSortLabel = () => {
    const option = sortOptions.find((opt) => opt.value === sortBy);
    return option?.label || "Most Upvoted";
  };

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Feature Requests
            </h1>
            <p className="text-muted-foreground">
              Share your ideas and vote on features you'd like to see
            </p>
          </div>

          {user && (
            <Button onClick={() => setShowCreateForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Request
            </Button>
          )}
        </div>

        {/* Tabs and Controls */}
        <div className="flex items-center justify-between mb-6">
          <Tabs
            value={activeTab}
            onValueChange={(value) =>
              setActiveTab(value as FeatureRequestStatus)
            }
            className="w-auto"
          >
            <TabsList className="grid w-full grid-cols-3">
              {statusTabs.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="flex items-center gap-2"
                >
                  {tab.label}
                  <Badge variant="secondary" className="ml-1 text-xs">
                    {
                      featureRequests.filter((fr) => fr.status === tab.value)
                        .length
                    }
                  </Badge>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          {/* Sort Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                {React.createElement(getSortIcon(), { className: "h-4 w-4" })}
                {getSortLabel()}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {sortOptions.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => setSortBy(option.value)}
                  className="flex items-center gap-2"
                >
                  {React.createElement(option.icon, { className: "h-4 w-4" })}
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Content */}
        <Tabs value={activeTab} className="w-full">
          {statusTabs.map((tab) => (
            <TabsContent key={tab.value} value={tab.value} className="mt-0">
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-48 bg-muted animate-pulse rounded-lg"
                    />
                  ))}
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <p className="text-destructive mb-4">
                    Error loading feature requests
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => window.location.reload()}
                  >
                    Try Again
                  </Button>
                </div>
              ) : featureRequests.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground mb-4">
                    No {tab.label.toLowerCase()} feature requests yet
                  </p>
                  {user && tab.value === "Open" && (
                    <Button onClick={() => setShowCreateForm(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Create the first one
                    </Button>
                  )}
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Feature Requests Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {featureRequests
                      .filter((fr) => fr.status === tab.value)
                      .map((featureRequest) => (
                        <FeatureRequestCard
                          key={featureRequest.id}
                          featureRequest={featureRequest}
                          onClick={handleFeatureRequestClick}
                        />
                      ))}
                  </div>

                  {/* Load More Button */}
                  {hasNextPage && (
                    <div className="flex justify-center pt-6">
                      <Button
                        variant="outline"
                        onClick={() => fetchNextPage()}
                        disabled={isFetchingNextPage}
                      >
                        {isFetchingNextPage ? "Loading..." : "Load More"}
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>

        {/* Create Feature Request Form */}
        <CreateFeatureRequestForm
          open={showCreateForm}
          onOpenChange={setShowCreateForm}
          onSuccess={handleCreateSuccess}
        />
      </div>
    </div>
  );
}
