import { getDatabase } from '../db';
import { DatabaseError } from './errors';

interface QueryConfig {
  table: string;
  type: 'SELECT' | 'INSERT' | 'UPDATE' | 'DELETE';
  conditions?: Record<string, any>;
  data?: any;
}

export async function executeQuery(config: QueryConfig) {
  const db = await getDatabase();
  const tx = db.transaction(config.table, config.type === 'SELECT' ? 'readonly' : 'readwrite');
  const store = tx.objectStore(config.table);

  try {
    switch (config.type) {
      case 'SELECT':
        if (config.conditions) {
          // If conditions are provided, filter the results
          const allRecords = await store.getAll();
          return allRecords.filter(record => {
            return Object.entries(config.conditions!).every(
              ([key, value]) => record[key] === value
            );
          });
        }
        return store.getAll();

      case 'INSERT':
        if (!config.data) {
          throw new DatabaseError('No data provided for INSERT operation');
        }
        await store.add(config.data);
        break;

      case 'UPDATE':
        if (!config.data || !config.conditions) {
          throw new DatabaseError('Missing data or conditions for UPDATE operation');
        }
        const record = await store.get(config.conditions.id);
        if (!record) {
          throw new DatabaseError('Record not found');
        }
        await store.put({ ...record, ...config.data });
        break;

      case 'DELETE':
        if (!config.conditions) {
          throw new DatabaseError('No conditions provided for DELETE operation');
        }
        await store.delete(config.conditions.id);
        break;

      default:
        throw new DatabaseError('Invalid query type');
    }

    await tx.done;
    return null;
  } catch (error) {
    console.error('Database operation failed:', error);
    throw new DatabaseError(
      `Failed to execute ${config.type} operation on ${config.table}`
    );
  }
}

export async function executeTransaction(operations: QueryConfig[]) {
  const db = await getDatabase();
  const tx = db.transaction(
    [...new Set(operations.map(op => op.table))],
    'readwrite'
  );

  try {
    await Promise.all(
      operations.map(async (operation) => {
        const store = tx.objectStore(operation.table);
        switch (operation.type) {
          case 'INSERT':
            await store.add(operation.data);
            break;
          case 'UPDATE':
            await store.put(operation.data);
            break;
          case 'DELETE':
            await store.delete(operation.conditions!.id);
            break;
          default:
            throw new DatabaseError('Invalid operation type in transaction');
        }
      })
    );

    await tx.done;
  } catch (error) {
    console.error('Transaction failed:', error);
    throw new DatabaseError('Failed to execute transaction');
  }
}

export async function executeRawQuery(query: string, params?: any[]) {
  try {
    const db = await getDatabase();
    // This is a placeholder for potential future implementation
    // of raw SQL queries if needed
    console.warn('Raw queries are not implemented yet');
    return null;
  } catch (error) {
    console.error('Raw query execution failed:', error);
    throw new DatabaseError('Failed to execute raw query');
  }
}