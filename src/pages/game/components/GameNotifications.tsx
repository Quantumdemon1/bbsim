
import React from 'react';
import { Notification } from '@/hooks/auth/types';
import { adaptGameNotificationToAuthNotification, isGameNotificationArray } from '@/types/notificationTypes';

interface GameNotificationsProps {
  notifications: any[];
}

// Moved the logic to a custom hook to separate rendering from data transformation
export const useGameNotifications = ({ notifications }: GameNotificationsProps) => {
  const adaptedNotifications: Notification[] = React.useMemo(() => {
    if (!notifications || notifications.length === 0) return [];
    
    if (isGameNotificationArray(notifications)) {
      return notifications.map(adaptGameNotificationToAuthNotification);
    }
    
    return notifications as unknown as Notification[];
  }, [notifications]);

  return { adaptedNotifications };
};

// The component now returns null since it's just a logic wrapper
const GameNotifications: React.FC<GameNotificationsProps> = (props) => {
  // This component doesn't actually render anything,
  // it's just a wrapper for the hook logic
  return null;
};

export default GameNotifications;
