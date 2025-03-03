
import { useState } from 'react';
import { AuthState, Notification } from './types';
import { toast } from "@/components/ui/use-toast";

export function useNotifications(authState: AuthState, setAuthState: React.Dispatch<React.SetStateAction<AuthState>>) {
  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      timestamp: Date.now(),
      read: false,
      ...notification
    };
    
    setAuthState({
      ...authState,
      notifications: [newNotification, ...authState.notifications]
    });
    
    if (authState.settings.notifications) {
      toast({
        title: notification.type === 'friend_request' ? 'New Friend Request' : 
               notification.type === 'game_invite' ? 'New Game Invite' : 'New Notification',
        description: notification.message,
      });
    }
  };
  
  const markNotificationAsRead = (notificationId: string) => {
    setAuthState({
      ...authState,
      notifications: authState.notifications.map(notif => 
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    });
  };
  
  const clearNotifications = () => {
    setAuthState({
      ...authState,
      notifications: []
    });
    
    toast({
      title: "Notifications cleared",
      description: "All notifications have been cleared.",
    });
  };

  return {
    addNotification,
    markNotificationAsRead,
    clearNotifications
  };
}
