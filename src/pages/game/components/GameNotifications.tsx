
import React from 'react';
import { Notification } from '@/hooks/auth/types';
import { adaptGameNotificationToAuthNotification, isGameNotificationArray } from '@/types/notificationTypes';

interface GameNotificationsProps {
  notifications: any[];
}

/**
 * Custom hook to efficiently transform game notifications
 * Separated from rendering logic for better testability and reuse
 */
export const useGameNotifications = ({ notifications }: GameNotificationsProps) => {
  // Use memoization to prevent unnecessary recalculations
  const adaptedNotifications: Notification[] = React.useMemo(() => {
    if (!notifications || notifications.length === 0) return [];
    
    if (isGameNotificationArray(notifications)) {
      return notifications.map(adaptGameNotificationToAuthNotification);
    }
    
    return notifications as unknown as Notification[];
  }, [notifications]);

  return { adaptedNotifications };
};

/**
 * This component doesn't render anything, it's just a wrapper for the hook logic
 * It's kept for backwards compatibility but can be removed in future refactoring
 */
const GameNotifications: React.FC<GameNotificationsProps> = () => {
  return null;
};

export default GameNotifications;
