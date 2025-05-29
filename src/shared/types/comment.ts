export interface Comment {
  id: string;
  featureRequestId: string;
  userId: string;
  userName: string;
  userPhotoURL?: string;
  content: string;
  hearts: string[]; // Array of user IDs who hearted
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCommentData {
  featureRequestId: string;
  content: string;
}
