import { openDB, IDBPDatabase, deleteDB } from 'idb';
import { ClaimsDB } from './schema/types';
import { DB_NAME, DB_VERSION, STORES, INDEXES } from './config';

let db: IDBPDatabase<ClaimsDB> | null = null;

export async function resetDatabase() {
  if (db) {
    db.close();
    db = null;
  }
  await deleteDB(DB_NAME);
  return await initDatabase();
}

export async function initDatabase() {
  if (db) return db;

  try {
    db = await openDB<ClaimsDB>(DB_NAME, DB_VERSION, {
      upgrade(database, oldVersion, newVersion) {
        // Delete existing stores if they exist
        if (oldVersion > 0) {
          const storeNames = [...database.objectStoreNames];
          storeNames.forEach(storeName => {
            database.deleteObjectStore(storeName);
          });
        }

        // Claims store
        const claimsStore = database.createObjectStore(STORES.CLAIMS, { keyPath: 'id' });
        claimsStore.createIndex(INDEXES.CLAIMS.BY_STATUS, 'status');
        claimsStore.createIndex(INDEXES.CLAIMS.BY_DATE, 'createdAt');
        claimsStore.createIndex(INDEXES.CLAIMS.BY_INSURER, 'insurerCompanyId');

        // Comments store
        const commentsStore = database.createObjectStore(STORES.COMMENTS, { keyPath: 'id' });
        commentsStore.createIndex(INDEXES.COMMENTS.BY_CLAIM, 'claimId');
        commentsStore.createIndex(INDEXES.COMMENTS.BY_DATE, 'createdAt');

        // Documents store
        const documentsStore = database.createObjectStore(STORES.DOCUMENTS, { keyPath: 'id' });
        documentsStore.createIndex(INDEXES.DOCUMENTS.BY_CLAIM, 'claimId');
        documentsStore.createIndex(INDEXES.DOCUMENTS.BY_CATEGORY, 'category');

        // Payments store
        const paymentsStore = database.createObjectStore(STORES.PAYMENTS, { keyPath: 'id' });
        paymentsStore.createIndex(INDEXES.PAYMENTS.BY_PAYER, 'payerCompanyId');
        paymentsStore.createIndex(INDEXES.PAYMENTS.BY_RECEIVER, 'receiverCompanyId');
        paymentsStore.createIndex(INDEXES.PAYMENTS.BY_STATUS, 'status');
        paymentsStore.createIndex(INDEXES.PAYMENTS.BY_DATE, 'createdAt');

        // Payment Claims store
        const paymentClaimsStore = database.createObjectStore(STORES.PAYMENT_CLAIMS, { 
          keyPath: ['paymentId', 'claimId'] 
        });
        paymentClaimsStore.createIndex(INDEXES.PAYMENT_CLAIMS.BY_PAYMENT, 'paymentId');
        paymentClaimsStore.createIndex(INDEXES.PAYMENT_CLAIMS.BY_CLAIM, 'claimId');

        // Payment Comments store
        const paymentCommentsStore = database.createObjectStore(STORES.PAYMENT_COMMENTS, { keyPath: 'id' });
        paymentCommentsStore.createIndex(INDEXES.PAYMENT_COMMENTS.BY_PAYMENT, 'paymentId');
        paymentCommentsStore.createIndex(INDEXES.PAYMENT_COMMENTS.BY_DATE, 'createdAt');
      },
      blocked() {
        console.warn('Database upgrade blocked. Close other tabs.');
      },
      blocking() {
        db?.close();
        db = null;
      },
      terminated() {
        db = null;
      },
    });

    return db;
  } catch (error) {
    console.error('Failed to initialize database:', error);
    throw error;
  }
}

export async function getDatabase() {
  if (!db) {
    db = await initDatabase();
  }
  return db;
}

export async function closeDatabase() {
  if (db) {
    db.close();
    db = null;
  }
}