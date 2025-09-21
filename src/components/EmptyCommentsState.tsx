interface EmptyCommentsStateProps {
  message?: string;
}

const EmptyCommentsState = ({
  message = 'No comments yet. Be the first to add one!',
}: EmptyCommentsStateProps) => {
  return (
    <div className="text-center py-8">
      <p className="text-muted-foreground">{message}</p>
    </div>
  );
};

export default EmptyCommentsState;
