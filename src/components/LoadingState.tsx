import { Skeleton } from '@/components/ui/skeleton';

interface LoadingStateProps {
  rows?: number;
}

const LoadingState = ({ rows = 3 }: LoadingStateProps) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: rows }, (_, index) => (
        <Skeleton
          key={index}
          className={`h-4 ${
            index === 0 ? 'w-full' : index === 1 ? 'w-3/4' : 'w-1/2'
          }`}
        />
      ))}
    </div>
  );
};

export default LoadingState;
