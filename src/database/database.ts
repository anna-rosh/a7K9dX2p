import { createRxDatabase, type RxCollection, type RxDatabase } from 'rxdb';
import { commentSchema } from './schemas';
import { LOCAL_DATABASE_NAME, RXDB_COLLECTION_NAME } from '../constants';
import { initializeRxDBPlugins, getConfiguredStorage } from './plugins';
import { setupReplication } from './replication';
import type { Comment } from '../types';

export type CommentCollection = RxCollection<Comment>;

export type CommentsDatabase = RxDatabase<{
  [RXDB_COLLECTION_NAME]: CommentCollection;
}>;

initializeRxDBPlugins();

let dbPromise: Promise<CommentsDatabase> | null = null;

const initializeDatabase = async (): Promise<CommentsDatabase> => {
  try {
    console.log('Initializing local database...');

    const db = await createRxDatabase({
      name: LOCAL_DATABASE_NAME,
      storage: getConfiguredStorage(),
    });

    await db.addCollections({
      [RXDB_COLLECTION_NAME]: {
        schema: commentSchema,
      },
    });

    console.log('Local database ready');

    setupReplication(db as unknown as RxDatabase<CommentsDatabase>);

    return db as unknown as RxDatabase<CommentsDatabase>;
  } catch (error) {
    console.error('Failed to initialize database:', error);
    throw error;
  }
};

export const getDb = async (): Promise<CommentsDatabase> => {
  if (!dbPromise) {
    dbPromise = initializeDatabase();
  }
  return dbPromise;
};
