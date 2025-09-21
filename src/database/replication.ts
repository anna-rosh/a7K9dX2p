import {
  replicateCouchDB,
  RxCouchDBReplicationState,
} from 'rxdb/plugins/replication-couchdb';
import {
  RXDB_COLLECTION_NAME,
  COUCHDB_BASE_URL,
  COUCHDB_USER,
  COUCHDB_PASSWORD,
  COUCHDB_COMMENTS_DB_NAME,
} from '../constants';
import type { Comment } from '../types';
import type { CommentsDatabase } from './database';

let replicationState: RxCouchDBReplicationState<Comment> | null = null;

const checkCouchDBReachable = async (baseUrl: string): Promise<void> => {
  const response = await fetch(baseUrl, {
    method: 'GET',
    signal: AbortSignal.timeout(5000),
  });

  if (!response.ok) {
    throw new Error(`CouchDB not reachable: ${response.status}`);
  }
};

const attachReplicationObservers = (
  replication: RxCouchDBReplicationState<Comment>
): void => {
  replication.error$.subscribe((error) => {
    console.warn('Replication error:', error?.message ?? error);
  });

  replication.active$.subscribe((active: boolean) => {
    console.log(active ? 'CouchDB sync active' : 'CouchDB sync paused');
  });
};

const startReplication = async (db: CommentsDatabase): Promise<void> => {
  if (replicationState) {
    replicationState.cancel();
  }

  try {
    await checkCouchDBReachable(COUCHDB_BASE_URL);

    replicationState = replicateCouchDB({
      replicationIdentifier: 'comments-replication',
      collection: db[RXDB_COLLECTION_NAME],
      url: `${COUCHDB_BASE_URL}/${COUCHDB_COMMENTS_DB_NAME}/`,
      pull: {},
      push: {},
      live: true,
      retryTime: 30_000,
      waitForLeadership: true,
      fetch: (url, options) => {
        const auth = btoa(`${COUCHDB_USER}:${COUCHDB_PASSWORD}`);
        return fetch(url, {
          ...options,
          headers: {
            ...options?.headers,
            Authorization: `Basic ${auth}`,
          },
        });
      },
    });

    replicationState.start();
    attachReplicationObservers(replicationState);
    console.log('CouchDB replication started');
  } catch (err) {
    console.warn('CouchDB not reachable, skipping replication:', err);
  }
};

const attachNetworkListeners = (db: CommentsDatabase): void => {
  if (typeof window === 'undefined') return;

  window.addEventListener('online', async () => {
    console.log('Browser online. Restarting CouchDB replication...');
    await startReplication(db);
  });

  window.addEventListener('offline', () => {
    console.log('Browser offline. CouchDB replication paused.');
  });
};

export const setupReplication = async (db: CommentsDatabase): Promise<void> => {
  console.log('Setting up CouchDB replication...');
  await startReplication(db);
  attachNetworkListeners(db);
};
