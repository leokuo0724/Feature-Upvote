export interface Comment {
  id: string;
  content: string;
  featureRequestId: string;
  authorId: string;
  authorName: string;
  authorEmail: string;
  authorPhotoURL?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCommentData {
  content: string;
  featureRequestId: string;
}

export interface UpdateCommentData {
  content: string;
}

export interface CommentsQuery {
  featureRequestId: string;
  limit?: number;
  page?: number;
}
