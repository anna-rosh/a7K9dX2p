import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { useComments } from './use-comments';
import { commentService } from '@/services/comment-service';
import type { Comment, User } from '@/types';

const mockUser: User = {
  id: 'user-1',
  firstName: 'Winnie',
  lastName: 'The Pooh',
  email: 'winnie@hundredacre.com',
};

vi.mock('@/services/comment-service');

const mockCommentService = commentService as typeof commentService & {
  getAllComments: ReturnType<typeof vi.fn>;
  getCommentsObservable: ReturnType<typeof vi.fn>;
  createComment: ReturnType<typeof vi.fn>;
};

describe('useComments', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should load comments on mount', async () => {
    const mockComments: Comment[] = [
      {
        id: '1',
        text: 'Test comment',
        authorId: 'user-1',
        authorName: 'John',
        createdAt: '2024-01-01T00:00:00.000Z',
        replies: [],
      },
    ];

    mockCommentService.getAllComments.mockResolvedValue(mockComments);
    mockCommentService.getCommentsObservable.mockResolvedValue({
      subscribe: vi.fn(() => ({ unsubscribe: vi.fn() })),
    });

    const { result } = renderHook(() => useComments());

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.comments).toEqual(mockComments);
    expect(mockCommentService.getAllComments).toHaveBeenCalledTimes(1);
  });

  it('should handle errors when loading comments', async () => {
    mockCommentService.getAllComments.mockRejectedValue(
      new Error('Failed to load')
    );
    mockCommentService.getCommentsObservable.mockResolvedValue({
      subscribe: vi.fn(() => ({ unsubscribe: vi.fn() })),
    });

    const { result } = renderHook(() => useComments());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe('Failed to load');
  });

  it('should add comment', async () => {
    mockCommentService.getAllComments.mockResolvedValue([]);
    mockCommentService.getCommentsObservable.mockResolvedValue({
      subscribe: vi.fn(() => ({ unsubscribe: vi.fn() })),
    });
    mockCommentService.createComment.mockResolvedValue({
      id: '1',
      text: 'New comment',
      authorId: 'user-1',
      authorName: 'John',
      createdAt: '2024-01-01T00:00:00.000Z',
      replies: [],
    });

    const { result } = renderHook(() => useComments());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const commentInput = { text: 'New comment' };
    await result.current.addComment(commentInput, mockUser);

    expect(mockCommentService.createComment).toHaveBeenCalledWith(
      commentInput,
      mockUser
    );
  });
});
