import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import CommentItem from './CommentItem';
import { UserProvider } from '@/contexts/UserContext';
import type { Comment } from '@/types';

const renderWithUserProvider = (component: React.ReactElement) => {
  return render(<UserProvider>{component}</UserProvider>);
};

const mockComment: Comment = {
  id: '1',
  text: 'Test comment',
  authorId: 'user-1',
  authorName: 'Mickey Mouse',
  createdAt: '2024-01-01T00:00:00.000Z',
  replies: [
    {
      id: '2',
      text: 'Test reply',
      authorId: 'user-2',
      authorName: 'Minnie Mouse',
      createdAt: '2024-01-02T00:00:00.000Z',
    },
  ],
};

describe('CommentItem', () => {
  const mockOnDelete = vi.fn();
  const mockOnAddReply = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders comment content', () => {
    renderWithUserProvider(
      <CommentItem
        comment={mockComment}
        onDelete={mockOnDelete}
        onAddReply={mockOnAddReply}
      />
    );

    expect(screen.getByText('Test comment')).toBeInTheDocument();
    expect(screen.getByText('Mickey Mouse')).toBeInTheDocument();
    expect(screen.getByText('1 reply')).toBeInTheDocument();
  });

  it('hides delete button when current user is not the author', () => {
    const commentByDifferentUser = {
      ...mockComment,
      authorId: 'user-2',
      authorName: 'Donald Duck',
    };

    renderWithUserProvider(
      <CommentItem
        comment={commentByDifferentUser}
        onDelete={mockOnDelete}
        onAddReply={mockOnAddReply}
      />
    );

    expect(screen.queryByText('Delete')).not.toBeInTheDocument();
  });

  it('calls onDelete when delete button is clicked', () => {
    renderWithUserProvider(
      <CommentItem
        comment={mockComment}
        onDelete={mockOnDelete}
        onAddReply={mockOnAddReply}
      />
    );

    fireEvent.click(screen.getByText('Delete'));
    expect(mockOnDelete).toHaveBeenCalledWith('1');
  });

  it('shows reply form when reply button is clicked', () => {
    renderWithUserProvider(
      <CommentItem
        comment={mockComment}
        onDelete={mockOnDelete}
        onAddReply={mockOnAddReply}
      />
    );

    fireEvent.click(screen.getByText('Reply'));
    expect(
      screen.getByPlaceholderText('Reply to Mickey...')
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Add Reply' })
    ).toBeInTheDocument();
  });

  it('displays correct reply count', () => {
    const commentWithMultipleReplies = {
      ...mockComment,
      replies: [
        {
          id: '2',
          text: 'Reply 1',
          authorId: 'user-2',
          authorName: 'Goofy',
          createdAt: '2024-01-01T00:00:00.000Z',
        },
        {
          id: '3',
          text: 'Reply 2',
          authorId: 'user-3',
          authorName: 'Pluto',
          createdAt: '2024-01-01T00:00:00.000Z',
        },
      ],
    };

    renderWithUserProvider(
      <CommentItem
        comment={commentWithMultipleReplies}
        onDelete={mockOnDelete}
        onAddReply={mockOnAddReply}
      />
    );

    expect(screen.getByText('2 replies')).toBeInTheDocument();
  });
});
