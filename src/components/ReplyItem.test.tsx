import { render, screen } from '@testing-library/react';
import ReplyItem from './ReplyItem';
import type { Reply } from '@/types';

const mockReply: Reply = {
  id: '1',
  text: 'Test reply',
  authorId: 'user-1',
  authorName: 'Scrooge McDuck',
  createdAt: '2024-01-01T00:00:00.000Z',
};

describe('ReplyItem', () => {
  it('renders reply content', () => {
    render(<ReplyItem reply={mockReply} />);

    expect(screen.getByText('Test reply')).toBeInTheDocument();
    expect(screen.getByText('Scrooge McDuck')).toBeInTheDocument();
  });
});
