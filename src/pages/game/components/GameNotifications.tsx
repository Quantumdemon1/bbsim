
import React from 'react';
import { Notification } from '@/hooks/auth/types';
import { adaptGameNotificationToAuthNotification, isGameNotificationArray } from '@/types/notificationTypes';

interface GameNotificationsProps {
  notifications: any[];
}

const GameNotifications: React.FC<GameNotificationsProps> = ({ notifications }) => {
  const adaptedNotifications: Notification[] = React.useMemo(() => {
    if (!notifications || notifications.length === 0) return [];
    
    if (isGameNotificationArray(notifications)) {
      return notifications.map(adaptGameNotificationToAuthNotification);
    }
    
    return notifications as unknown as Notification[];
  }, [notifications]);

  return { adaptedNotifications };
};

export default GameNotifications;
