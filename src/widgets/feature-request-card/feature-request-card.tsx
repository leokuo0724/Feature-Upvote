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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  LabelTag,
} from "@/shared/ui";
import { FeatureRequest, FeatureRequestStatus } from "@/shared/types";
import { useAuth } from "@/shared/hooks/use-auth";
import {
  useToggleUpvote,
  useUpdateFeatureRequest,
} from "@/entities/feature-request";
import { formatCount, truncateText } from "@/shared/lib/utils";
import { useToast } from "@/shared/ui";

interface FeatureRequestCardProps {
  featureRequest: FeatureRequest;
  onEdit?: (featureRequest: FeatureRequest) => void;
  onDelete?: (featureRequest: FeatureRequest) => void;
  onClick?: (featureRequest: FeatureRequest) => void;
  showActions?: boolean;
}

const statusColors = {
  Open: "default",
  "In Progress": "warning",
  Completed: "success",
  "Won't Do": "deprecated",
  Considering: "info1",
  "Will Do": "info2",
  Archived: "outline",
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
  const updateFeatureRequest = useUpdateFeatureRequest();
  const { toast } = useToast();
  const [isUpvoting, setIsUpvoting] = useState(false);

  const hasUpvoted = user ? featureRequest.upvotedBy.includes(user.uid) : false;
  const canEdit =
    user && (user.isAdmin || user.uid === featureRequest.authorId);
  const canDelete =
    user && (user.isAdmin || user.uid === featureRequest.authorId);
  const isAdmin = user?.isAdmin;

  const handleUpvote = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!user) {
      toast({
        title: "Login Required",
        description: "Please sign in to vote on feature requests.",
        variant: "destructive",
      });
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

  const handleStatusChange = async (newStatus: FeatureRequestStatus) => {
    if (!isAdmin) return;

    try {
      await updateFeatureRequest.mutateAsync({
        id: featureRequest.id,
        updates: { status: newStatus },
      });
      toast({
        title: "Success",
        description: `Status updated to ${newStatus}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive",
      });
    }
  };

  return (
    <Card
      className="group cursor-pointer transition-all hover:shadow-md hover:border-primary/20 flex flex-col justify-between"
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
                  className="h-8 w-8 p-0 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
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

      <div>
        <CardContent className="py-3">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant={statusColors[featureRequest.status] || "default"}>
              {featureRequest.status}
            </Badge>

            {featureRequest.labels.map((labelId) => (
              <LabelTag key={labelId} labelId={labelId} />
            ))}
          </div>
        </CardContent>
        <CardFooter className="pt-3 border-t bg-muted/50">
          <div className="flex items-center justify-between w-full gap-2">
            <div className="flex items-center gap-3 text-sm text-muted-foreground min-w-0">
              <div className="flex items-center gap-1">
                <MessageCircle className="h-4 w-4" />
                <span>{formatCount(featureRequest.commentsCount)}</span>
              </div>

              <div className="flex items-center gap-1 min-w-0 flex-1 text-xs sm:text-sm">
                <span className="truncate">
                  by {featureRequest.authorName} •{" "}
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
      </div>
    </Card>
  );
}
