export interface CommentBase {
  id: string;
  text: string;
  authorId: string;
  authorName: string;
  createdAt: string;
}

export type Reply = CommentBase;

export interface Comment extends CommentBase {
  replies: Reply[];
}

export interface CommentInput {
  text: string;
  parentId?: string;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface DatabaseDocument extends Comment {
  _deleted?: boolean;
}
