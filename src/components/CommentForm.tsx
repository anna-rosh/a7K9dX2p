import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useUser } from '@/hooks/use-user';
import type { CommentInput, User } from '@/types';

interface CommentFormProps {
  onSubmit: (comment: CommentInput, user: User) => void;
  loading?: boolean;
  parentId?: string;
  placeholder?: string;
  className?: string;
  isVisible?: boolean;
}

const CommentForm = ({
  onSubmit,
  loading = false,
  parentId,
  placeholder = 'Write your comment here...',
  className,
  isVisible = true,
}: CommentFormProps) => {
  const [text, setText] = useState('');
  const { currentUser } = useUser();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onSubmit({ text: text.trim(), parentId }, currentUser);
      setText('');
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{parentId ? 'Add Reply' : 'Add Comment'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="comment" className="block text-sm font-medium mb-2">
              {parentId ? 'Reply' : 'Comment'}
            </label>
            <Textarea
              id="comment"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={placeholder}
              disabled={loading}
              required
              rows={parentId ? 3 : 4}
            />
          </div>

          <Button
            type="submit"
            disabled={loading || !text.trim()}
            className="w-full"
          >
            {loading
              ? parentId
                ? 'Adding Reply...'
                : 'Adding Comment...'
              : parentId
                ? 'Add Reply'
                : 'Add Comment'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CommentForm;
