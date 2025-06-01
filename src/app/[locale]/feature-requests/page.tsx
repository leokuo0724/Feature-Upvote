"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Plus, Filter, SortAsc, SortDesc, ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
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
import {
  FeatureRequestStatus,
  FeatureRequestSort,
  FeatureRequest,
} from "@/shared/types";
import { useAuth } from "@/shared/hooks/use-auth";
import {
  useInfiniteFeatureRequests,
  useTabGroupCounts,
  useDeleteFeatureRequest,
} from "@/entities/feature-request";
import { FeatureRequestCard } from "@/widgets/feature-request-card";
import { CreateFeatureRequestForm } from "@/features/create-feature-request";
import {
  ALL_STATUSES,
  PUBLIC_STATUSES,
  ARCHIVED_STATUS,
} from "@/shared/config/constants";

// Define tab groups for user interface
type TabGroup = "all" | "open" | "in-progress" | "done" | "archived";

type TabOption = {
  value: TabGroup;
  labelKey: string;
  statuses: FeatureRequestStatus[];
  adminOnly?: boolean;
};

type SortOption = {
  value: string;
  labelKey: string;
  icon: React.ComponentType<{ className?: string }>;
  sort: FeatureRequestSort;
};

function FeatureRequestsContent() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingFeatureRequest, setEditingFeatureRequest] =
    useState<FeatureRequest | null>(null);
  const [sortBy, setSortBy] = useState<string>("upvotes");

  // Define tab options with translation keys
  const tabOptions: TabOption[] = [
    {
      value: "all",
      labelKey: "common.all",
      statuses: PUBLIC_STATUSES, // Exclude archived from "all"
    },
    {
      value: "open",
      labelKey: "common.open",
      statuses: ["Open", "Considering", "Will Do"],
    },
    {
      value: "in-progress",
      labelKey: "feature.status.In Progress",
      statuses: ["In Progress"],
    },
    {
      value: "done",
      labelKey: "feature.status.Completed",
      statuses: ["Completed", "Won't Do"],
    },
    {
      value: "archived",
      labelKey: "feature.status.Archived",
      statuses: [ARCHIVED_STATUS],
      adminOnly: true,
    },
  ];

  const sortOptions: SortOption[] = [
    {
      value: "upvotes",
      labelKey: "feature.details.votes",
      icon: SortDesc,
      sort: { field: "votes", direction: "desc" },
    },
    {
      value: "createdAt",
      labelKey: "common.newest",
      icon: SortDesc,
      sort: { field: "createdAt", direction: "desc" },
    },
    {
      value: "createdAt_asc",
      labelKey: "common.oldest",
      icon: SortAsc,
      sort: { field: "createdAt", direction: "asc" },
    },
  ];

  // Get tab group from URL or default to "open"
  const tabFromUrl = searchParams.get("tab") as TabGroup | null;
  const [activeTab, setActiveTab] = useState<TabGroup>(tabFromUrl || "open");

  // Get tab counts
  const {
    data: tabCounts = {
      all: 0,
      open: 0,
      "in-progress": 0,
      done: 0,
      archived: 0,
    },
  } = useTabGroupCounts();

  // Import delete mutation
  const deleteFeatureRequest = useDeleteFeatureRequest();

  // Filter tabs based on user permissions
  const visibleTabOptions = tabOptions.filter(
    (tab) => !tab.adminOnly || user?.isAdmin
  );

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
    visibleTabOptions.find((tab) => tab.value === activeTab) ||
    visibleTabOptions[0];

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

  const handleFeatureRequestClick = (featureRequest: FeatureRequest) => {
    router.push(`/feature-requests/${featureRequest.id}`);
  };

  const handleEdit = (featureRequest: FeatureRequest) => {
    setEditingFeatureRequest(featureRequest);
  };

  const handleDelete = async (featureRequest: FeatureRequest) => {
    if (
      window.confirm(
        "Are you sure you want to delete this feature request? This action cannot be undone."
      )
    ) {
      try {
        await deleteFeatureRequest.mutateAsync(featureRequest.id);
      } catch (error) {
        console.error("Error deleting feature request:", error);
      }
    }
  };

  const handleEditSuccess = () => {
    setEditingFeatureRequest(null);
  };

  const getSortIcon = () => {
    return sortOptions.find((opt) => opt.value === sortBy)?.icon || SortDesc;
  };

  const getSortLabel = () => {
    const option = sortOptions.find((opt) => opt.value === sortBy);
    return option ? t(option.labelKey) : t("common.sort");
  };

  const getTabCount = (tabValue: TabGroup) => {
    return tabCounts[tabValue] || 0;
  };

  const getCurrentTabLabel = () => {
    const option = currentTabOption;
    return option ? t(option.labelKey) : t("common.all");
  };

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              {t("feature.title")}
            </h1>
            <p className="text-muted-foreground">{t("feature.subtitle")}</p>
          </div>

          {user && (
            <Button
              className="w-full sm:w-fit"
              onClick={() => setShowCreateForm(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              {t("feature.createNew")}
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
                <TabsList
                  className={`grid w-full ${
                    visibleTabOptions.length === 5
                      ? "grid-cols-5"
                      : "grid-cols-4"
                  }`}
                >
                  {visibleTabOptions.map((option) => (
                    <TabsTrigger
                      key={option.value}
                      value={option.value}
                      className="flex items-center gap-2"
                    >
                      {t(option.labelKey)}
                      <Badge variant="outline" className="ml-1 text-xs">
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
                      <Badge variant="outline" className="text-xs">
                        {getTabCount(activeTab)}
                      </Badge>
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {visibleTabOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        <span>{t(option.labelKey)}</span>
                        <Badge variant="outline" className="text-xs">
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
                  onClick={() => setSortBy(option.value as string)}
                  className="flex items-center gap-2"
                >
                  {React.createElement(option.icon, { className: "h-4 w-4" })}
                  {t(option.labelKey)}
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
                {t("common.error")} loading feature requests
              </p>
              <Button
                variant="outline"
                onClick={() => window.location.reload()}
              >
                {t("buttons.refresh")}
              </Button>
            </div>
          ) : featureRequests.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">
                {t("feature.noRequests")}
              </p>
              {user && (activeTab === "all" || activeTab === "open") && (
                <Button onClick={() => setShowCreateForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  {t("feature.noRequestsDescription")}
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
                    onEdit={handleEdit}
                    onDelete={handleDelete}
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
                    {isFetchingNextPage
                      ? t("common.loading")
                      : t("buttons.loadMore")}
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

        {/* Edit Feature Request Form */}
        {editingFeatureRequest && (
          <CreateFeatureRequestForm
            open={!!editingFeatureRequest}
            onOpenChange={(open) => !open && setEditingFeatureRequest(null)}
            onSuccess={handleEditSuccess}
            editData={editingFeatureRequest}
          />
        )}
      </div>
    </div>
  );
}

function FeatureRequestsLoading() {
  return (
    <div className="container mx-auto py-8">
      <div className="max-w-6xl mx-auto">
        <div className="h-8 bg-muted animate-pulse rounded mb-4"></div>
        <div className="h-4 bg-muted animate-pulse rounded w-1/2 mb-8"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-48 bg-muted animate-pulse rounded-lg" />
          ))}
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
