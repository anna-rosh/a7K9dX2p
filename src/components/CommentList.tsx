import CommentItem from './CommentItem';
import LoadingState from './LoadingState';
import EmptyCommentsState from './EmptyCommentsState';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import type { Comment, CommentInput, User } from '@/types';

interface CommentListProps {
  comments: Comment[];
  loading: boolean;
  error: string | null;
  onDelete: (id: string) => void;
  onAddReply: (reply: CommentInput, user: User) => void;
}

const CommentList = ({
  comments,
  loading,
  error,
  onDelete,
  onAddReply,
}: CommentListProps) => {
  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error loading comments</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (comments.length === 0) {
    return <EmptyCommentsState />;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Comments ({comments.length})
      </h2>
      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          onDelete={onDelete}
          onAddReply={onAddReply}
        />
      ))}
    </div>
  );
};

export default CommentList;
