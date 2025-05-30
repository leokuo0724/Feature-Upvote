"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import {
  MessageCircle,
  MoreHorizontal,
  Edit,
  Trash2,
  Send,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  Button,
  Textarea,
  Avatar,
  AvatarFallback,
  AvatarImage,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui";
import { Comment, CommentsQuery } from "@/shared/types";
import { useAuth } from "@/shared/hooks/use-auth";
import {
  useInfiniteComments,
  useCreateComment,
  useUpdateComment,
  useDeleteComment,
} from "@/entities/comment";

interface CommentListProps {
  featureRequestId: string;
}

interface CommentItemProps {
  comment: Comment;
  onEdit: (comment: Comment) => void;
  onDelete: (comment: Comment) => void;
}

function CommentItem({ comment, onEdit, onDelete }: CommentItemProps) {
  const { user } = useAuth();
  const canEdit = user && (user.isAdmin || user.uid === comment.authorId);
  const canDelete = user && (user.isAdmin || user.uid === comment.authorId);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="flex gap-3 group">
      <Avatar className="h-8 w-8 mt-1">
        <AvatarImage src={comment.authorPhotoURL} />
        <AvatarFallback className="text-xs">
          {getInitials(comment.authorName)}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-medium text-sm">{comment.authorName}</span>
          <span className="text-xs text-muted-foreground">
            {formatDistanceToNow(comment.createdAt, { addSuffix: true })}
          </span>

          {(canEdit || canDelete) && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity ml-auto"
                >
                  <MoreHorizontal className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {canEdit && (
                  <DropdownMenuItem onClick={() => onEdit(comment)}>
                    <Edit className="mr-2 h-3 w-3" />
                    Edit
                  </DropdownMenuItem>
                )}
                {canDelete && (
                  <>
                    {canEdit && <DropdownMenuSeparator />}
                    <DropdownMenuItem
                      onClick={() => onDelete(comment)}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="mr-2 h-3 w-3" />
                      Delete
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        <p className="text-sm leading-relaxed whitespace-pre-wrap">
          {comment.content}
        </p>
      </div>
    </div>
  );
}

export function CommentList({ featureRequestId }: CommentListProps) {
  const { user } = useAuth();
  const [newComment, setNewComment] = useState("");
  const [editingComment, setEditingComment] = useState<Comment | null>(null);
  const [editContent, setEditContent] = useState("");

  const queryParams: CommentsQuery = { featureRequestId, limit: 20 };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteComments(queryParams);

  const createComment = useCreateComment();
  const updateComment = useUpdateComment();
  const deleteComment = useDeleteComment();

  const comments = data?.pages.flatMap((page) => page.comments) ?? [];

  const handleSubmitComment = async () => {
    if (!user || !newComment.trim()) return;

    try {
      await createComment.mutateAsync({
        data: {
          content: newComment.trim(),
          featureRequestId,
        },
        authorId: user.uid,
        authorName: user.displayName || "Anonymous",
        authorEmail: user.email || "",
        authorPhotoURL: user.photoURL || undefined,
      });
      setNewComment("");
    } catch (error) {
      console.error("Error creating comment:", error);
    }
  };

  const handleEditComment = (comment: Comment) => {
    setEditingComment(comment);
    setEditContent(comment.content);
  };

  const handleUpdateComment = async () => {
    if (!editingComment || !editContent.trim()) return;

    try {
      await updateComment.mutateAsync({
        id: editingComment.id,
        updates: { content: editContent.trim() },
      });
      setEditingComment(null);
      setEditContent("");
    } catch (error) {
      console.error("Error updating comment:", error);
    }
  };

  const handleDeleteComment = async (comment: Comment) => {
    try {
      await deleteComment.mutateAsync({
        id: comment.id,
        featureRequestId: comment.featureRequestId,
      });
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const handleCancelEdit = () => {
    setEditingComment(null);
    setEditContent("");
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <MessageCircle className="h-5 w-5" />
            <h3 className="font-semibold">Comments</h3>
          </div>
          <div className="text-center text-muted-foreground py-8">
            Loading comments...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          <h3 className="font-semibold">Comments ({comments.length})</h3>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Add new comment */}
        {user && (
          <div className="flex gap-3">
            <Avatar className="h-8 w-8 mt-1">
              <AvatarImage src={user.photoURL || undefined} />
              <AvatarFallback className="text-xs">
                {user.displayName
                  ? user.displayName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2)
                  : "U"}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-2">
              <Textarea
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={3}
                className="resize-none"
              />
              <div className="flex justify-end">
                <Button
                  onClick={handleSubmitComment}
                  disabled={!newComment.trim() || createComment.isPending}
                  size="sm"
                >
                  <Send className="h-4 w-4 mr-2" />
                  {createComment.isPending ? "Posting..." : "Post Comment"}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Comments list */}
        <div className="space-y-4">
          {comments.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              No comments yet. Be the first to comment!
            </div>
          ) : (
            comments.map((comment) => (
              <div key={comment.id}>
                {editingComment?.id === comment.id ? (
                  <div className="flex gap-3">
                    <Avatar className="h-8 w-8 mt-1">
                      <AvatarImage src={comment.authorPhotoURL} />
                      <AvatarFallback className="text-xs">
                        {comment.authorName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()
                          .slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 space-y-2">
                      <Textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        rows={3}
                        className="resize-none"
                      />
                      <div className="flex gap-2 justify-end">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleCancelEdit}
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleUpdateComment}
                          disabled={
                            !editContent.trim() || updateComment.isPending
                          }
                          size="sm"
                        >
                          {updateComment.isPending ? "Updating..." : "Update"}
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <CommentItem
                    comment={comment}
                    onEdit={handleEditComment}
                    onDelete={handleDeleteComment}
                  />
                )}
              </div>
            ))
          )}
        </div>

        {/* Load more button */}
        {hasNextPage && (
          <div className="flex justify-center pt-4">
            <Button
              variant="outline"
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
            >
              {isFetchingNextPage ? "Loading..." : "Load More Comments"}
            </Button>
          </div>
        )}

        {/* Login prompt for non-authenticated users */}
        {!user && (
          <div className="text-center text-muted-foreground py-4 border-t">
            Please log in to add comments
          </div>
        )}
      </CardContent>
    </Card>
  );
}
