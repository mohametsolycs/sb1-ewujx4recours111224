import { useState, useEffect, useCallback } from 'react';
import { Notification } from '../types';
import { notificationRepository } from '../database/repositories/notificationRepository';
import { useAuthStore } from '../store/authStore';
import { useDatabase } from './useDatabase';

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const user = useAuthStore((state) => state.user);
  const { isInitialized } = useDatabase();

  const loadNotifications = useCallback(async () => {
    if (!user || !isInitialized) return;

    try {
      const loadedNotifications = await notificationRepository.findByUser(user.id);
      setNotifications(loadedNotifications);
      setUnreadCount(loadedNotifications.filter(n => !n.read).length);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user, isInitialized]);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const addNotification = async (data: { 
    message: string; 
    type: Notification['type'];
    relatedClaimId?: string;
  }) => {
    if (!user || !isInitialized) return;

    const newNotification: Notification & { userId: string } = {
      id: Date.now().toString(),
      ...data,
      createdAt: new Date(),
      read: false,
      userId: user.id
    };

    try {
      await notificationRepository.create(newNotification);
      setNotifications(prev => [newNotification, ...prev]);
      setUnreadCount(prev => prev + 1);
      return newNotification;
    } catch (error) {
      console.error('Failed to create notification:', error);
      throw error;
    }
  };

  const markAsRead = async (id: string) => {
    if (!isInitialized) return;

    try {
      await notificationRepository.markAsRead(id);
      setNotifications(prev =>
        prev.map(notification =>
          notification.id === id ? { ...notification, read: true } : notification
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    if (!user || !isInitialized) return;

    try {
      await notificationRepository.markAllAsRead(user.id);
      setNotifications(prev =>
        prev.map(notification => ({ ...notification, read: true }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  return {
    notifications,
    unreadCount,
    isLoading,
    addNotification,
    markAsRead,
    markAllAsRead,
  };
}