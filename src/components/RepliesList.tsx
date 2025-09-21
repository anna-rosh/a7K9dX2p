import ReplyItem from './ReplyItem';
import type { Reply } from '@/types';

interface RepliesListProps {
  replies: Reply[];
}

const RepliesList = ({ replies }: RepliesListProps) => {
  if (replies.length === 0) {
    return null;
  }

  return (
    <div className="ml-6 space-y-3 border-l-2 border-border pl-4">
      {replies.map((reply) => (
        <ReplyItem key={reply.id} reply={reply} />
      ))}
    </div>
  );
};

export default RepliesList;
