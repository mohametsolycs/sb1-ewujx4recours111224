import { IDBPDatabase } from 'idb';
import { AppDatabase } from '../schema/schema';
import { database } from '../core/Database';
import { DatabaseError } from '../utils/errors';

export abstract class BaseRepository {
  protected async getDatabase(): Promise<IDBPDatabase<AppDatabase>> {
    try {
      return database.getConnection();
    } catch (error) {
      throw new DatabaseError('Database connection failed');
    }
  }

  protected handleError(error: unknown, message: string): never {
    console.error(message, error);
    throw error instanceof DatabaseError ? error : new DatabaseError(message);
  }
}