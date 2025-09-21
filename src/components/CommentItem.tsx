import { useState } from 'react';
import { formatDate } from '../utils';
import CommentForm from './CommentForm';
import RepliesList from './RepliesList';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { Comment, CommentInput, User } from '@/types';
import { useUser } from '@/hooks/use-user';

interface CommentItemProps {
  comment: Comment;
  onDelete: (id: string) => void;
  onAddReply: (reply: CommentInput, user: User) => void;
}

const CommentItem = ({ comment, onDelete, onAddReply }: CommentItemProps) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const { currentUser } = useUser();

  const handleReplySubmit = (reply: CommentInput) => {
    onAddReply(reply, currentUser);
    setShowReplyForm(false);
  };

  return (
    <Card>
      <CardContent className="pt-6">
        {/* Comment header */}
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1">
            <h3 className="font-medium">{comment.authorName}</h3>
            <p className="text-sm text-muted-foreground">
              {formatDate(comment.createdAt)}
            </p>
          </div>
          {currentUser.id === comment.authorId && (
            <div className="flex space-x-2">
              <Button
                onClick={() => onDelete(comment.id)}
                variant="destructive"
                size="sm"
              >
                Delete
              </Button>
            </div>
          )}
        </div>

        {/* Comment Text */}
        <p className="mb-3">{comment.text}</p>

        {/* Reply Button */}
        <div className="flex items-center space-x-4 mb-4">
          <Button
            onClick={() => setShowReplyForm(!showReplyForm)}
            variant="ghost"
            size="sm"
          >
            {showReplyForm ? 'Cancel' : 'Reply'}
          </Button>
          {comment.replies.length > 0 && (
            <span className="text-muted-foreground text-sm">
              {comment.replies.length}{' '}
              {comment.replies.length === 1 ? 'reply' : 'replies'}
            </span>
          )}
        </div>

        {/* Reply Form */}
        <CommentForm
          isVisible={showReplyForm}
          onSubmit={handleReplySubmit}
          parentId={comment.id}
          placeholder={`Reply to ${comment.authorName.split(' ')[0]}...`}
          className="mb-4"
        />

        {/* Replies */}
        <RepliesList replies={comment.replies} />
      </CardContent>
    </Card>
  );
};

export default CommentItem;
