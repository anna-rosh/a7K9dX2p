import { memo } from 'react';
import { formatDate } from '../utils';
import { Card, CardContent } from '@/components/ui/card';
import type { Reply } from '@/types';

interface ReplyItemProps {
  reply: Reply;
}

const ReplyItem = memo(({ reply }: ReplyItemProps) => {
  return (
    <Card className="bg-muted/30">
      <CardContent className="p-3">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h4 className="font-medium text-sm">{reply.authorName}</h4>
            <p className="text-xs text-muted-foreground">
              {formatDate(reply.createdAt)}
            </p>
          </div>
        </div>
        <p className="text-sm">{reply.text}</p>
      </CardContent>
    </Card>
  );
});

export default ReplyItem;
