import type { RxJsonSchema } from 'rxdb';
import type { DatabaseDocument } from '../types';

export const commentSchema: RxJsonSchema<DatabaseDocument> = {
  version: 0,
  primaryKey: 'id',
  type: 'object',
  properties: {
    id: {
      type: 'string',
      maxLength: 36,
    },
    _deleted: {
      type: 'boolean',
    },
    text: {
      type: 'string',
      maxLength: 1000,
    },
    authorId: {
      type: 'string',
      maxLength: 36,
    },
    authorName: {
      type: 'string',
      maxLength: 200,
    },
    createdAt: {
      type: 'string',
      format: 'date-time',
      maxLength: 100,
    },
    replies: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            maxLength: 36,
          },
          text: {
            type: 'string',
            maxLength: 1000,
          },
          authorId: {
            type: 'string',
            maxLength: 36,
          },
          authorName: {
            type: 'string',
            maxLength: 200,
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            maxLength: 100,
          },
        },
        required: ['id', 'text', 'authorId', 'authorName', 'createdAt'],
      },
    },
  },
  required: ['id', 'text', 'authorId', 'authorName', 'createdAt', 'replies'],
  indexes: ['createdAt'],
};
