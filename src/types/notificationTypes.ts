
import { GameNotification } from './gameTypes';
import { Notification } from '@/hooks/auth/types';

/**
 * Type adapter to convert between GameNotification and Notification types
 */
export function adaptGameNotificationToAuthNotification(
  gameNotification: GameNotification
): Notification {
  return {
    id: gameNotification.id,
    type: "system_message", // Default type for game notifications
    message: gameNotification.message,
    timestamp: gameNotification.timestamp,
    read: gameNotification.read
  };
}

export function adaptAuthNotificationToGameNotification(
  notification: Notification
): GameNotification {
  return {
    id: notification.id,
    type: "info", // Default type for auth notifications
    message: notification.message,
    timestamp: notification.timestamp,
    read: notification.read
  };
}

/**
 * Type guard to check if an array is of GameNotification type
 */
export function isGameNotificationArray(
  notifications: GameNotification[] | Notification[]
): notifications is GameNotification[] {
  return notifications.length === 0 || 
    ('type' in notifications[0] && 
    (notifications[0].type === 'info' || 
     notifications[0].type === 'warning' || 
     notifications[0].type === 'error' || 
     notifications[0].type === 'success'));
}
