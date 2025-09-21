import { vi } from 'vitest';
import { commentService } from './comment-service';
import { getDb } from '@/database/database';
import type { User } from '@/types';

vi.mock('@/database/database');

const mockCollection = {
  insert: vi.fn(),
  find: vi.fn(() => ({
    sort: vi.fn(() => ({
      exec: vi.fn(),
      $: vi.fn(),
    })),
  })),
  findOne: vi.fn(() => ({
    exec: vi.fn(),
  })),
};

const mockDb = {
  comments: mockCollection,
};

const mockUser: User = {
  id: 'user-1',
  firstName: 'Donald',
  lastName: 'Duck',
  email: 'donald@duckburg.com',
};

describe('CommentService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (getDb as ReturnType<typeof vi.fn>).mockResolvedValue(mockDb);
  });

  describe('createComment', () => {
    it('should create a new comment', async () => {
      const mockDoc = {
        id: 'comment-1',
        text: 'Test comment',
        authorId: 'user-1',
        authorName: 'Donald Duck',
        createdAt: '2024-01-01T00:00:00.000Z',
        replies: [],
      };

      mockCollection.insert.mockResolvedValue(mockDoc);

      const result = await commentService.createComment(
        {
          text: 'Test comment',
        },
        mockUser
      );

      expect(mockCollection.insert).toHaveBeenCalledWith(
        expect.objectContaining({
          text: 'Test comment',
          authorId: 'user-1',
          authorName: 'Donald Duck',
          replies: [],
        })
      );
      expect(result).toEqual(mockDoc);
    });

    it('should add reply when parentId is provided', async () => {
      const parentDoc = {
        id: 'parent-1',
        text: 'Parent comment',
        authorId: 'user-1',
        authorName: 'Donald Duck',
        createdAt: '2024-01-01T00:00:00.000Z',
        replies: [],
        update: vi.fn().mockResolvedValue({
          id: 'parent-1',
          text: 'Parent comment',
          authorId: 'user-1',
          authorName: 'Donald Duck',
          createdAt: '2024-01-01T00:00:00.000Z',
          replies: [expect.any(Object)],
        }),
      };

      mockCollection.findOne.mockReturnValue({
        exec: vi.fn().mockResolvedValue(parentDoc),
      });

      await commentService.createComment(
        {
          text: 'Reply text',
          parentId: 'parent-1',
        },
        mockUser
      );

      expect(parentDoc.update).toHaveBeenCalledWith({
        $set: { replies: expect.arrayContaining([expect.any(Object)]) },
      });
    });
  });

  describe('deleteComment', () => {
    it('should delete comment by id', async () => {
      const mockDoc = {
        id: 'comment-1',
        text: 'Test comment',
        authorId: 'user-1',
        authorName: 'Donald Duck',
        createdAt: '2024-01-01T00:00:00.000Z',
        replies: [],
        remove: vi.fn().mockResolvedValue({ id: 'comment-1' }),
      };

      mockCollection.findOne.mockReturnValue({
        exec: vi.fn().mockResolvedValue(mockDoc),
      });

      await commentService.deleteComment('comment-1');

      expect(mockCollection.findOne).toHaveBeenCalledWith({
        selector: { id: 'comment-1' },
      });
      expect(mockDoc.remove).toHaveBeenCalled();
    });

    it('should throw error if comment not found', async () => {
      mockCollection.findOne.mockReturnValue({
        exec: vi.fn().mockResolvedValue(null),
      });

      await expect(
        commentService.deleteComment('non-existent')
      ).rejects.toThrow('Component not found');
    });
  });
});
