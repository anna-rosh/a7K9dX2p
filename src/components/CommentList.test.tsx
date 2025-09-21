import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import CommentList from './CommentList';
import { UserProvider } from '@/contexts/UserContext';
import type { Comment } from '@/types';

const renderWithUserProvider = (component: React.ReactElement) => {
  return render(<UserProvider>{component}</UserProvider>);
};

const mockComments: Comment[] = [
  {
    id: '1',
    text: 'First comment',
    authorId: 'user-1',
    authorName: 'Winnie The Pooh',
    createdAt: '2024-01-01T00:00:00.000Z',
    replies: [],
  },
  {
    id: '2',
    text: 'Second comment',
    authorId: 'user-2',
    authorName: 'Donald Duck',
    createdAt: '2024-01-02T00:00:00.000Z',
    replies: [
      {
        id: '3',
        text: 'A reply',
        authorId: 'user-1',
        authorName: 'Winnie The Pooh',
        createdAt: '2024-01-03T00:00:00.000Z',
      },
    ],
  },
];

describe('CommentList', () => {
  const mockOnDelete = vi.fn();
  const mockOnAddReply = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows error state when error is present', () => {
    const errorMessage = 'Failed to load comments';

    renderWithUserProvider(
      <CommentList
        comments={[]}
        loading={false}
        error={errorMessage}
        onDelete={mockOnDelete}
        onAddReply={mockOnAddReply}
      />
    );

    expect(screen.getByText('Error loading comments')).toBeInTheDocument();
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('shows empty state when no comments and not loading', () => {
    renderWithUserProvider(
      <CommentList
        comments={[]}
        loading={false}
        error={null}
        onDelete={mockOnDelete}
        onAddReply={mockOnAddReply}
      />
    );

    expect(
      screen.getByText('No comments yet. Be the first to add one!')
    ).toBeInTheDocument();
  });

  it('renders comments when comments are present', () => {
    renderWithUserProvider(
      <CommentList
        comments={mockComments}
        loading={false}
        error={null}
        onDelete={mockOnDelete}
        onAddReply={mockOnAddReply}
      />
    );

    expect(screen.getByText('Comments (2)')).toBeInTheDocument();
    expect(screen.getByText('First comment')).toBeInTheDocument();
    expect(screen.getByText('Second comment')).toBeInTheDocument();
    expect(screen.getAllByText('Winnie The Pooh')).toHaveLength(2);
    expect(screen.getByText('Donald Duck')).toBeInTheDocument();
  });

  it('shows correct comment count in header', () => {
    renderWithUserProvider(
      <CommentList
        comments={mockComments}
        loading={false}
        error={null}
        onDelete={mockOnDelete}
        onAddReply={mockOnAddReply}
      />
    );

    expect(screen.getByText('Comments (2)')).toBeInTheDocument();
  });
});
