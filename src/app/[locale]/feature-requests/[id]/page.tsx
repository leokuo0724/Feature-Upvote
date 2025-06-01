"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { useTranslations } from "next-intl";
import {
  ChevronUp,
  ArrowLeft,
  Edit,
  Trash2,
  MoreHorizontal,
  User,
  Calendar,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Avatar,
  AvatarFallback,
  AvatarImage,
  LabelTag,
} from "@/shared/ui";
import { useAuth } from "@/shared/hooks/use-auth";
import {
  useFeatureRequest,
  useToggleUpvote,
  useDeleteFeatureRequest,
} from "@/entities/feature-request";
import { CommentList } from "@/widgets/comment-list";
import { CreateFeatureRequestForm } from "@/features/create-feature-request";
import { formatCount } from "@/shared/lib/utils";

const statusColors = {
  Open: "default",
  "In Progress": "info",
  Completed: "success",
  "Won't Do": "destructive",
  Considering: "secondary",
  "Will Do": "success",
  Archived: "outline",
} as const;

export default function FeatureRequestDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const t = useTranslations("feature");
  const [showEditForm, setShowEditForm] = useState(false);
  const [isUpvoting, setIsUpvoting] = useState(false);

  const featureRequestId = params.id as string;

  const {
    data: featureRequest,
    isLoading,
    error,
  } = useFeatureRequest(featureRequestId);
  const toggleUpvote = useToggleUpvote();
  const deleteFeatureRequest = useDeleteFeatureRequest();

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/4"></div>
            <div className="h-32 bg-muted rounded"></div>
            <div className="h-64 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !featureRequest) {
    return (
      <div className="container mx-auto py-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">{t("notFound.title")}</h1>
          <p className="text-muted-foreground mb-6">{t("notFound.message")}</p>
          <Button onClick={() => router.push("/feature-requests")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t("notFound.backButton")}
          </Button>
        </div>
      </div>
    );
  }

  const hasUpvoted = user ? featureRequest.upvotedBy.includes(user.uid) : false;
  const canEdit =
    user && (user.isAdmin || user.uid === featureRequest.authorId);
  const canDelete =
    user && (user.isAdmin || user.uid === featureRequest.authorId);

  const handleUpvote = async () => {
    if (!user || isUpvoting) return;

    setIsUpvoting(true);
    try {
      await toggleUpvote.mutateAsync({
        featureRequestId: featureRequest.id,
        userId: user.uid,
      });
    } finally {
      setIsUpvoting(false);
    }
  };

  const handleEdit = () => {
    setShowEditForm(true);
  };

  const handleDelete = async () => {
    if (!confirm(t("confirmDelete"))) {
      return;
    }

    try {
      await deleteFeatureRequest.mutateAsync(featureRequest.id);
      router.push("/feature-requests");
    } catch (error) {
      console.error("Error deleting feature request:", error);
    }
  };

  const handleEditSuccess = () => {
    setShowEditForm(false);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => router.push("/feature-requests")}
          className="mb-0 sm:mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t("actions.back")}
        </Button>

        {/* Main Content */}
        <Card>
          <CardHeader>
            <div className="flex flex-col items-start justify-between gap-4">
              <div className="w-full ">
                <div className="flex flex-row items-center justify-between gap-4 mb-3">
                  <CardTitle className="text-2xl ">
                    {featureRequest.title}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    {/* Upvote Button */}
                    <Button
                      variant={hasUpvoted ? "default" : "outline"}
                      size="sm"
                      className="flex items-center gap-2"
                      onClick={handleUpvote}
                      disabled={isUpvoting || !user}
                    >
                      <ChevronUp
                        className={`h-4 w-4 ${
                          hasUpvoted ? "fill-current" : ""
                        }`}
                      />
                      <span>{formatCount(featureRequest.upvotes)}</span>
                    </Button>

                    {/* Actions Menu */}
                    {(canEdit || canDelete) && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {canEdit && (
                            <DropdownMenuItem onClick={handleEdit}>
                              <Edit className="mr-2 h-4 w-4" />
                              {t("actions.edit")}
                            </DropdownMenuItem>
                          )}
                          {canDelete && (
                            <>
                              {canEdit && <DropdownMenuSeparator />}
                              <DropdownMenuItem
                                onClick={handleDelete}
                                className="text-destructive focus:text-destructive"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                {t("actions.delete")}
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    <span>
                      {t("details.createdBy")} {featureRequest.authorName}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {formatDistanceToNow(featureRequest.createdAt, {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <Badge
                    variant={statusColors[featureRequest.status] || "default"}
                  >
                    {t(`status.${featureRequest.status}`)}
                  </Badge>

                  {featureRequest.labels.map((labelId) => (
                    <LabelTag key={labelId} labelId={labelId} />
                  ))}
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <div className="prose prose-sm max-w-none">
              <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                {featureRequest.description}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Author Info */}
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={undefined} />
                <AvatarFallback>
                  {getInitials(featureRequest.authorName)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{featureRequest.authorName}</p>
                <p className="text-sm text-muted-foreground">
                  {t("details.createdAt")}{" "}
                  {formatDistanceToNow(featureRequest.createdAt, {
                    addSuffix: true,
                  })}
                  {featureRequest.updatedAt.getTime() !==
                    featureRequest.createdAt.getTime() && (
                    <span>
                      {" • "}
                      {t("details.updatedAt")}{" "}
                      {formatDistanceToNow(featureRequest.updatedAt, {
                        addSuffix: true,
                      })}
                    </span>
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Comments Section */}
        <CommentList featureRequestId={featureRequest.id} />

        {/* Edit Form Modal */}
        {showEditForm && (
          <CreateFeatureRequestForm
            open={showEditForm}
            onOpenChange={setShowEditForm}
            onSuccess={handleEditSuccess}
            editData={featureRequest}
          />
        )}
      </div>
    </div>
  );
}
