import { getDatabase } from '../db';
import { STORES, INDEXES } from '../config';
import { Notification } from '../../types';
import { DatabaseError } from '../utils/errors';

export const notificationRepository = {
  async create(notification: Notification & { userId: string; claimId?: string }): Promise<void> {
    const db = await getDatabase();
    const tx = db.transaction(STORES.NOTIFICATIONS, 'readwrite');

    try {
      await tx.store.add(notification);
      await tx.done;
    } catch (error) {
      console.error('Failed to create notification:', error);
      throw new DatabaseError('Failed to create notification');
    }
  },

  async findByUser(userId: string): Promise<Notification[]> {
    const db = await getDatabase();
    const tx = db.transaction(STORES.NOTIFICATIONS, 'readonly');

    try {
      const index = tx.store.index(INDEXES.NOTIFICATIONS.BY_USER);
      const notifications = await index.getAll(userId);
      return notifications.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      throw new DatabaseError('Failed to fetch notifications');
    }
  },

  async findByClaim(claimId: string): Promise<Notification[]> {
    const db = await getDatabase();
    const tx = db.transaction(STORES.NOTIFICATIONS, 'readonly');

    try {
      const index = tx.store.index(INDEXES.NOTIFICATIONS.BY_CLAIM);
      return await index.getAll(claimId);
    } catch (error) {
      console.error('Failed to fetch claim notifications:', error);
      throw new DatabaseError('Failed to fetch claim notifications');
    }
  },

  async markAsRead(id: string): Promise<void> {
    const db = await getDatabase();
    const tx = db.transaction(STORES.NOTIFICATIONS, 'readwrite');

    try {
      const notification = await tx.store.get(id);
      if (notification) {
        notification.read = true;
        await tx.store.put(notification);
      }
      await tx.done;
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
      throw new DatabaseError('Failed to update notification');
    }
  },

  async markAllAsRead(userId: string): Promise<void> {
    const db = await getDatabase();
    const tx = db.transaction(STORES.NOTIFICATIONS, 'readwrite');

    try {
      const index = tx.store.index(INDEXES.NOTIFICATIONS.BY_USER);
      const notifications = await index.getAll(userId);
      
      await Promise.all(
        notifications
          .filter(n => !n.read)
          .map(n => tx.store.put({ ...n, read: true }))
      );
      
      await tx.done;
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
      throw new DatabaseError('Failed to update notifications');
    }
  }
};