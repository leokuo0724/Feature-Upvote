"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import {
  ChevronUp,
  MessageCircle,
  MoreHorizontal,
  Edit,
  Trash2,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  Badge,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui";
import { FeatureRequest } from "@/shared/types";
import { useAuth } from "@/shared/hooks/use-auth";
import { useToggleUpvote } from "@/entities/feature-request";
import { formatCount, truncateText } from "@/shared/lib/utils";

interface FeatureRequestCardProps {
  featureRequest: FeatureRequest;
  onEdit?: (featureRequest: FeatureRequest) => void;
  onDelete?: (featureRequest: FeatureRequest) => void;
  onClick?: (featureRequest: FeatureRequest) => void;
  showActions?: boolean;
}

const statusColors = {
  Open: "default",
  "In Progress": "info",
  Completed: "success",
  "Won't Do": "destructive",
  Pending: "warning",
  "Under Discussion": "secondary",
  "Will Do": "success",
} as const;

export function FeatureRequestCard({
  featureRequest,
  onEdit,
  onDelete,
  onClick,
  showActions = true,
}: FeatureRequestCardProps) {
  const { user } = useAuth();
  const toggleUpvote = useToggleUpvote();
  const [isUpvoting, setIsUpvoting] = useState(false);

  const hasUpvoted = user ? featureRequest.upvotedBy.includes(user.uid) : false;
  const canEdit =
    user && (user.isAdmin || user.uid === featureRequest.authorId);
  const canDelete =
    user && (user.isAdmin || user.uid === featureRequest.authorId);

  const handleUpvote = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!user) {
      // TODO: Show login modal or redirect to login
      return;
    }

    if (isUpvoting) return;

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

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit?.(featureRequest);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.(featureRequest);
  };

  const handleCardClick = () => {
    onClick?.(featureRequest);
  };

  return (
    <Card
      className="group cursor-pointer transition-all hover:shadow-md hover:border-primary/20"
      onClick={handleCardClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg leading-tight mb-2 group-hover:text-primary transition-colors">
              {featureRequest.title}
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {truncateText(featureRequest.description, 150)}
            </p>
          </div>

          {showActions && (canEdit || canDelete) && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {canEdit && (
                  <DropdownMenuItem onClick={handleEdit}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
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
                      Delete
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardHeader>

      <CardContent className="py-3">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant={statusColors[featureRequest.status] || "default"}>
            {featureRequest.status}
          </Badge>

          {featureRequest.labels.map((label) => (
            <Badge key={label} variant="outline" className="text-xs">
              {label}
            </Badge>
          ))}
        </div>
      </CardContent>

      <CardFooter className="pt-3 border-t bg-muted/20">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <MessageCircle className="h-4 w-4" />
              <span>{formatCount(featureRequest.commentsCount)}</span>
            </div>

            <div className="flex items-center gap-1">
              <span>by {featureRequest.authorName}</span>
              <span>•</span>
              <span>
                {formatDistanceToNow(featureRequest.createdAt, {
                  addSuffix: true,
                })}
              </span>
            </div>
          </div>

          <Button
            variant={hasUpvoted ? "default" : "outline"}
            size="sm"
            className="flex items-center gap-1 min-w-[60px]"
            onClick={handleUpvote}
            disabled={isUpvoting || !user}
          >
            <ChevronUp
              className={`h-4 w-4 ${hasUpvoted ? "fill-current" : ""}`}
            />
            <span>{formatCount(featureRequest.upvotes)}</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
