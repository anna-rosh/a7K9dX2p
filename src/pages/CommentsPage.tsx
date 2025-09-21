import { useComments } from '@/hooks';
import { CommentForm, CommentList } from '@/components';
import UserSelector from '@/components/UserSelector';

const CommentsPage = () => {
  const { comments, loading, error, addComment, removeComment, addReply } =
    useComments();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Local-First Comments
          </h1>
          <p className="mt-2 text-gray-600">
            A real-time commenting system with offline support and CouchDB sync
          </p>
        </div>

        <div className="space-y-8">
          <UserSelector />
          <CommentForm onSubmit={addComment} loading={loading} />

          <CommentList
            comments={comments}
            loading={loading}
            error={error}
            onDelete={removeComment}
            onAddReply={addReply}
          />
        </div>
      </div>
    </div>
  );
};

export default CommentsPage;
