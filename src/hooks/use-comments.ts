import { useState, useEffect, useCallback } from 'react';
import { commentService } from '../services/comment-service';
import type { Comment, CommentInput, User } from '../types';
import type { Subscription } from 'rxjs';
import type { RxDocument } from 'rxdb';

export const useComments = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let subscription: Subscription | undefined;

    const init = async () => {
      try {
        const allComments = await commentService.getAllComments();
        setComments(allComments);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }

      const commentsObservable = await commentService.getCommentsObservable();

      subscription = commentsObservable.subscribe({
        next: (docs: RxDocument<Comment>[]) => {
          const updatedComments = docs.map((doc) =>
            commentService.toCommentObj(doc)
          );
          setComments(updatedComments);
        },
        error: (err) => {
          setError(
            err instanceof Error
              ? err.message
              : 'RxDB observable subscription error'
          );
        },
      });
    };

    init();

    return () => {
      if (subscription) subscription.unsubscribe();
    };
  }, []);

  const addComment = useCallback(async (input: CommentInput, user: User): Promise<void> => {
    try {
      await commentService.createComment(input, user);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add comment');
    }
  }, []);

  const removeComment = useCallback(async (id: string): Promise<void> => {
    try {
      await commentService.deleteComment(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete comment');
    }
  }, []);

  const addReply = useCallback(async (reply: CommentInput, user: User): Promise<void> => {
    try {
      await commentService.createComment(reply, user);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add reply');
    }
  }, []);

  return {
    comments,
    loading,
    error,
    addComment,
    removeComment,
    addReply,
  };
};
