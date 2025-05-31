"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Plus, Filter, SortAsc, SortDesc, ChevronDown } from "lucide-react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui";
import { FeatureRequestStatus, FeatureRequestSort } from "@/shared/types";
import { useAuth } from "@/shared/hooks/use-auth";
import {
  useInfiniteFeatureRequests,
  useTabGroupCounts,
} from "@/entities/feature-request";
import { FeatureRequestCard } from "@/widgets/feature-request-card";
import { CreateFeatureRequestForm } from "@/features/create-feature-request";
import { ALL_STATUSES } from "@/shared/config/constants";

// Define tab groups for user interface
type TabGroup = "all" | "open" | "in-progress" | "done";

type TabOption = {
  value: TabGroup;
  label: string;
  statuses: FeatureRequestStatus[];
};

const tabOptions: TabOption[] = [
  {
    value: "all",
    label: "All",
    statuses: [
      "Open",
      "Considering",
      "Will Do",
      "In Progress",
      "Completed",
      "Won't Do",
    ],
  },
  {
    value: "open",
    label: "Open",
    statuses: ["Open", "Considering", "Will Do"],
  },
  {
    value: "in-progress",
    label: "In Progress",
    statuses: ["In Progress"],
  },
  {
    value: "done",
    label: "Done",
    statuses: ["Completed", "Won't Do"],
  },
];

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

function FeatureRequestsContent() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get tab group from URL or default to "all"
  const tabFromUrl = searchParams.get("tab") as TabGroup | null;
  const [activeTab, setActiveTab] = useState<TabGroup>(tabFromUrl || "all");
  const [sortBy, setSortBy] = useState<string>("upvotes");
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Get tab counts
  const { data: tabCounts = { all: 0, open: 0, "in-progress": 0, done: 0 } } =
    useTabGroupCounts();

  // Update URL when tab changes (simplified)
  const handleTabChange = (value: string) => {
    const newTab = value as TabGroup;
    setActiveTab(newTab);
    const params = new URLSearchParams(searchParams);
    params.set("tab", newTab);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  // Sync with URL on mount only
  useEffect(() => {
    const urlTab = searchParams.get("tab") as TabGroup | null;
    if (urlTab && urlTab !== activeTab) {
      setActiveTab(urlTab);
    }
  }, []); // Only run on mount

  const currentSort =
    sortOptions.find((opt) => opt.value === sortBy)?.sort ||
    sortOptions[0].sort;

  // Get current tab option
  const currentTabOption =
    tabOptions.find((tab) => tab.value === activeTab) || tabOptions[0];

  // Build query params based on selected tab
  const queryParams = {
    filters:
      activeTab === "all"
        ? {}
        : {
            statuses: currentTabOption.statuses,
          },
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

  // Get feature requests (now properly filtered by Firestore)
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

  // Get count for each tab group
  const getTabCount = (tabValue: TabGroup) => {
    return tabCounts[tabValue] || 0;
  };

  // Get current tab label
  const getCurrentTabLabel = () => {
    return currentTabOption.label;
  };

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Feature Requests
            </h1>
            <p className="text-muted-foreground">
              Share your ideas and vote on features you'd like to see
            </p>
          </div>

          {user && (
            <Button
              className="w-full sm:w-fit"
              onClick={() => setShowCreateForm(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              New Request
            </Button>
          )}
        </div>

        {/* Tab Selection and Controls */}
        <div className="flex  gap-4 justify-between mb-6">
          {/* Desktop: Tabs, Mobile: Dropdown */}
          <div>
            {/* Desktop Tabs (hidden on mobile) */}
            <div className="hidden md:block">
              <Tabs
                value={activeTab}
                onValueChange={handleTabChange}
                className="w-auto"
              >
                <TabsList className="grid w-full grid-cols-4">
                  {tabOptions.map((option) => (
                    <TabsTrigger
                      key={option.value}
                      value={option.value}
                      className="flex items-center gap-2"
                    >
                      {option.label}
                      <Badge variant="secondary" className="ml-1 text-xs">
                        {getTabCount(option.value)}
                      </Badge>
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>

            {/* Mobile Dropdown (hidden on desktop) */}
            <div className="md:hidden">
              <Select value={activeTab} onValueChange={handleTabChange}>
                <SelectTrigger className="w-full">
                  <SelectValue>
                    <div className="flex items-center gap-2">
                      <span>{getCurrentTabLabel()}</span>
                      <Badge variant="secondary" className="text-xs">
                        {getTabCount(activeTab)}
                      </Badge>
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {tabOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        <span>{option.label}</span>
                        <Badge variant="secondary" className="text-xs">
                          {getTabCount(option.value)}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

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
        <div className="w-full">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                No {activeTab === "all" ? "" : activeTab.replace("-", " ")}{" "}
                feature requests yet
              </p>
              {user && (activeTab === "all" || activeTab === "open") && (
                <Button onClick={() => setShowCreateForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create the first one
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {/* Feature Requests Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {featureRequests.map((featureRequest) => (
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
        </div>

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

// Loading component for Suspense fallback
function FeatureRequestsLoading() {
  return (
    <div className="container mx-auto py-8">
      <div className="max-w-6xl mx-auto">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="h-12 bg-muted rounded"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-48 bg-muted rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FeatureRequestsPage() {
  return (
    <Suspense fallback={<FeatureRequestsLoading />}>
      <FeatureRequestsContent />
    </Suspense>
  );
}
