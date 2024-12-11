import React from 'react';
import { CheckCircle, AlertCircle, Info } from 'lucide-react';
import { Notification } from '../../types';

interface NotificationListProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
}

export function NotificationList({ notifications, onMarkAsRead }: NotificationListProps) {
  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  return (
    <div className="space-y-4">
      {notifications.length === 0 ? (
        <p className="text-center text-gray-500 py-8">No notifications yet</p>
      ) : (
        notifications.map((notification) => (
          <div
            key={notification.id}
            className={`flex items-start space-x-4 p-4 rounded-lg ${
              notification.read ? 'bg-gray-50' : 'bg-white shadow'
            }`}
            onClick={() => !notification.read && onMarkAsRead(notification.id)}
          >
            {getIcon(notification.type)}
            <div className="flex-1">
              <p className="text-sm text-gray-900">{notification.message}</p>
              <p className="text-xs text-gray-500 mt-1">
                {new Date(notification.createdAt).toLocaleString()}
              </p>
            </div>
            {!notification.read && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                New
              </span>
            )}
          </div>
        ))
      )}
    </div>
  );
}