export interface Comment {
  id?: string;
  userId: string;
  createdAt: Date;
  updatedAt?: Date;
  text?: string;
  entityId: string;
  entityType: string;
  username: string,
  userImagePath?: string;
}

export interface CommentRequest {
  text: string;
  entityId: string;
  entityType: string;
  userId: string;
}
