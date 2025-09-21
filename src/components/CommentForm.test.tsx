import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import CommentForm from './CommentForm';
import { UserProvider } from '@/contexts/UserContext';

const renderWithUserProvider = (component: React.ReactElement) => {
  return render(<UserProvider>{component}</UserProvider>);
};

describe('CommentForm', () => {
  it('renders with default placeholder and heading', () => {
    const mockOnSubmit = vi.fn();

    renderWithUserProvider(<CommentForm onSubmit={mockOnSubmit} />);

    expect(screen.getAllByText('Add Comment')[0]).toBeInTheDocument();
    expect(screen.getByLabelText('Comment')).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('Write your comment here...')
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Add Comment' })
    ).toBeInTheDocument();
  });

  it('renders as reply form when parentId is provided', () => {
    const mockOnSubmit = vi.fn();

    renderWithUserProvider(
      <CommentForm onSubmit={mockOnSubmit} parentId="parent-123" />
    );

    expect(screen.getAllByText('Add Reply')[0]).toBeInTheDocument();
    expect(screen.getByLabelText('Reply')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Add Reply' })
    ).toBeInTheDocument();
  });

  it('renders with custom placeholder', () => {
    const mockOnSubmit = vi.fn();

    renderWithUserProvider(
      <CommentForm onSubmit={mockOnSubmit} placeholder="Custom placeholder" />
    );

    expect(
      screen.getByPlaceholderText('Custom placeholder')
    ).toBeInTheDocument();
  });

  it('submits form with comment text when button is clicked', async () => {
    const mockOnSubmit = vi.fn();
    const user = userEvent.setup();

    renderWithUserProvider(<CommentForm onSubmit={mockOnSubmit} />);

    const input = screen.getByLabelText('Comment');
    const submitButton = screen.getByRole('button', { name: 'Add Comment' });

    await user.type(input, 'This is my test comment');
    await user.click(submitButton);

    expect(mockOnSubmit).toHaveBeenCalledWith(
      {
        text: 'This is my test comment',
      },
      expect.objectContaining({
        firstName: 'Winnie',
        lastName: 'The Pooh',
      })
    );
  });

  it('includes parentId when submitting reply', async () => {
    const mockOnSubmit = vi.fn();
    const user = userEvent.setup();

    renderWithUserProvider(
      <CommentForm onSubmit={mockOnSubmit} parentId="parent-123" />
    );

    const input = screen.getByLabelText('Reply');
    const submitButton = screen.getByRole('button', { name: 'Add Reply' });

    await user.type(input, 'This is a reply');
    await user.click(submitButton);

    expect(mockOnSubmit).toHaveBeenCalledWith(
      {
        text: 'This is a reply',
        parentId: 'parent-123',
      },
      expect.objectContaining({
        firstName: 'Winnie',
        lastName: 'The Pooh',
      })
    );
  });

  it('clears input after successful submission', async () => {
    const mockOnSubmit = vi.fn();
    const user = userEvent.setup();

    renderWithUserProvider(<CommentForm onSubmit={mockOnSubmit} />);

    const input = screen.getByLabelText('Comment');

    await user.type(input, 'Test comment');
    await user.click(screen.getByRole('button', { name: 'Add Comment' }));

    expect(input).toHaveValue('');
  });

  it('does not submit empty or whitespace-only comments', async () => {
    const mockOnSubmit = vi.fn();
    const user = userEvent.setup();

    renderWithUserProvider(<CommentForm onSubmit={mockOnSubmit} />);

    const submitButton = screen.getByRole('button', { name: 'Add Comment' });

    // Test empty comment
    await user.click(submitButton);
    expect(mockOnSubmit).not.toHaveBeenCalled();

    // Test whitespace-only comment
    const input = screen.getByLabelText('Comment');
    await user.type(input, '   ');
    await user.click(submitButton);
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('disables form when loading', () => {
    const mockOnSubmit = vi.fn();

    renderWithUserProvider(
      <CommentForm onSubmit={mockOnSubmit} loading={true} />
    );

    const input = screen.getByLabelText('Comment');
    const submitButton = screen.getByRole('button', {
      name: 'Adding Comment...',
    });

    expect(input).toBeDisabled();
    expect(submitButton).toBeDisabled();
  });

  it('shows correct loading text for replies', () => {
    const mockOnSubmit = vi.fn();

    renderWithUserProvider(
      <CommentForm
        onSubmit={mockOnSubmit}
        parentId="parent-123"
        loading={true}
      />
    );

    expect(
      screen.getByRole('button', { name: 'Adding Reply...' })
    ).toBeInTheDocument();
  });

  it('disables submit button when input is empty', () => {
    const mockOnSubmit = vi.fn();

    renderWithUserProvider(<CommentForm onSubmit={mockOnSubmit} />);

    const submitButton = screen.getByRole('button', { name: 'Add Comment' });

    expect(submitButton).toBeDisabled();
  });

  it('enables submit button when input has text', async () => {
    const mockOnSubmit = vi.fn();
    const user = userEvent.setup();

    renderWithUserProvider(<CommentForm onSubmit={mockOnSubmit} />);

    const input = screen.getByLabelText('Comment');
    const submitButton = screen.getByRole('button', { name: 'Add Comment' });

    expect(submitButton).toBeDisabled();

    await user.type(input, 'Some text');

    expect(submitButton).toBeEnabled();
  });
});
