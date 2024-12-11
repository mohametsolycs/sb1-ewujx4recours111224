import { IDBPDatabase, openDB, deleteDB } from 'idb';
import { AppDatabase } from '../schema/schema';
import { DATABASE, STORES, INDEXES } from '../config/constants';
import { DatabaseError } from '../utils/errors';

export class Database {
  private static instance: Database;
  private db: IDBPDatabase<AppDatabase> | null = null;

  private constructor() {}

  static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  async initialize(): Promise<void> {
    if (this.db) return;

    try {
      this.db = await openDB<AppDatabase>(DATABASE.NAME, DATABASE.VERSION, {
        upgrade: (db, oldVersion, newVersion) => this.upgradeDatabase(db, oldVersion, newVersion),
        blocked: () => console.warn('Database upgrade blocked by other tabs'),
        blocking: () => console.warn('This tab is blocking a database upgrade'),
        terminated: () => {
          console.error('Database connection terminated unexpectedly');
          this.db = null;
        },
      });
    } catch (error) {
      console.error('Failed to initialize database:', error);
      throw new DatabaseError('Database initialization failed');
    }
  }

  async reset(): Promise<void> {
    if (this.db) {
      this.db.close();
      this.db = null;
    }
    await deleteDB(DATABASE.NAME);
  }

  getConnection(): IDBPDatabase<AppDatabase> {
    if (!this.db) {
      throw new DatabaseError('Database not initialized');
    }
    return this.db;
  }

  private upgradeDatabase(
    db: IDBPDatabase<AppDatabase>,
    oldVersion: number,
    newVersion: number | null
  ): void {
    // Delete existing stores if upgrading
    if (oldVersion > 0) {
      const storeNames = [...db.objectStoreNames];
      storeNames.forEach(storeName => db.deleteObjectStore(storeName));
    }

    // Create claims store
    const claimsStore = db.createObjectStore(STORES.CLAIMS, { keyPath: 'id' });
    claimsStore.createIndex(INDEXES.CLAIMS.BY_STATUS, 'status');
    claimsStore.createIndex(INDEXES.CLAIMS.BY_DATE, 'createdAt');

    // Create comments store
    const commentsStore = db.createObjectStore(STORES.COMMENTS, { keyPath: 'id' });
    commentsStore.createIndex(INDEXES.COMMENTS.BY_CLAIM, 'claimId');
    commentsStore.createIndex(INDEXES.COMMENTS.BY_DATE, 'createdAt');

    // Create documents store
    const documentsStore = db.createObjectStore(STORES.DOCUMENTS, { keyPath: 'id' });
    documentsStore.createIndex(INDEXES.DOCUMENTS.BY_CLAIM, 'claimId');
    documentsStore.createIndex(INDEXES.DOCUMENTS.BY_CATEGORY, 'category');

    // Create payments store
    const paymentsStore = db.createObjectStore(STORES.PAYMENTS, { keyPath: 'id' });
    paymentsStore.createIndex(INDEXES.PAYMENTS.BY_PAYER, 'payerCompanyId');
    paymentsStore.createIndex(INDEXES.PAYMENTS.BY_RECEIVER, 'receiverCompanyId');
    paymentsStore.createIndex(INDEXES.PAYMENTS.BY_STATUS, 'status');
    paymentsStore.createIndex(INDEXES.PAYMENTS.BY_DATE, 'createdAt');

    // Create payment claims store
    const paymentClaimsStore = db.createObjectStore(STORES.PAYMENT_CLAIMS, { 
      keyPath: ['paymentId', 'claimId'] 
    });
    paymentClaimsStore.createIndex(INDEXES.PAYMENT_CLAIMS.BY_PAYMENT, 'paymentId');
    paymentClaimsStore.createIndex(INDEXES.PAYMENT_CLAIMS.BY_CLAIM, 'claimId');

    // Create payment comments store
    const paymentCommentsStore = db.createObjectStore(STORES.PAYMENT_COMMENTS, { keyPath: 'id' });
    paymentCommentsStore.createIndex(INDEXES.PAYMENT_COMMENTS.BY_PAYMENT, 'paymentId');
    paymentCommentsStore.createIndex(INDEXES.PAYMENT_COMMENTS.BY_DATE, 'createdAt');
  }
}

export const database = Database.getInstance();