
import { useState, useEffect } from 'react';
import { PlayerData } from '@/components/PlayerProfileTypes';
import { toast } from "@/components/ui/use-toast";

export type AuthState = {
  isAuthenticated: boolean;
  currentPlayer: PlayerData | null;
  isGuest: boolean;
  friends: string[];
  notifications: Notification[];
  settings: PlayerSettings;
}

export type Notification = {
  id: string;
  type: 'friend_request' | 'game_invite' | 'system_message';
  message: string;
  from?: string;
  timestamp: number;
  read: boolean;
}

export type PlayerSettings = {
  theme: 'light' | 'dark';
  notifications: boolean;
  privacy: 'public' | 'friends' | 'private';
  autoDeclineInvites: boolean;
}

const defaultSettings: PlayerSettings = {
  theme: 'dark',
  notifications: true,
  privacy: 'public',
  autoDeclineInvites: false
};

export function usePlayerAuth() {
  const [authState, setAuthState] = useState<AuthState>(() => {
    // Check local storage for existing session
    const savedAuth = localStorage.getItem('playerAuth');
    if (savedAuth) {
      try {
        const parsed = JSON.parse(savedAuth);
        
        // Ensure the parsed data has all required fields
        return {
          isAuthenticated: parsed.isAuthenticated || false,
          currentPlayer: parsed.currentPlayer || null,
          isGuest: parsed.isGuest || true,
          friends: parsed.friends || [],
          notifications: parsed.notifications || [],
          settings: parsed.settings || defaultSettings
        };
      } catch (e) {
        console.error("Failed to parse auth data:", e);
      }
    }
    return { 
      isAuthenticated: false, 
      currentPlayer: null, 
      isGuest: true,
      friends: [],
      notifications: [],
      settings: defaultSettings
    };
  });

  // Save auth state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('playerAuth', JSON.stringify(authState));
  }, [authState]);

  const login = (player: PlayerData) => {
    setAuthState({
      ...authState,
      isAuthenticated: true,
      currentPlayer: player,
      isGuest: false
    });
    
    toast({
      title: "Welcome back!",
      description: `You're now logged in as ${player.name}.`,
    });
  };

  const register = (player: PlayerData) => {
    // In a real app, we would register the user in a database
    setAuthState({
      ...authState,
      isAuthenticated: true,
      currentPlayer: player,
      isGuest: false
    });
    
    toast({
      title: "Account created!",
      description: `Welcome to the game, ${player.name}!`,
    });
  };

  const loginAsGuest = (guestName: string) => {
    const guestPlayer: PlayerData = {
      id: `guest-${Date.now()}`,
      name: guestName,
      stats: { hohWins: 0, povWins: 0, timesNominated: 0, daysInHouse: 0 }
    };
    
    setAuthState({
      ...authState,
      isAuthenticated: true,
      currentPlayer: guestPlayer,
      isGuest: true
    });
    
    toast({
      title: "Playing as guest",
      description: `Welcome, ${guestName}! Your progress won't be saved when you leave.`,
    });
  };

  const logout = () => {
    setAuthState({
      isAuthenticated: false,
      currentPlayer: null,
      isGuest: true,
      friends: [],
      notifications: [],
      settings: defaultSettings
    });
    
    toast({
      title: "Logged out",
      description: "You've been logged out successfully.",
    });
  };
  
  const updateProfile = (updatedProfile: Partial<PlayerData>) => {
    if (!authState.currentPlayer) return;
    
    setAuthState({
      ...authState,
      currentPlayer: {
        ...authState.currentPlayer,
        ...updatedProfile
      }
    });
    
    toast({
      title: "Profile updated",
      description: "Your profile has been updated successfully.",
    });
  };
  
  const updateSettings = (newSettings: Partial<PlayerSettings>) => {
    setAuthState({
      ...authState,
      settings: {
        ...authState.settings,
        ...newSettings
      }
    });
    
    toast({
      title: "Settings updated",
      description: "Your settings have been updated successfully.",
    });
  };
  
  const addFriend = (friendId: string) => {
    if (authState.friends.includes(friendId)) return;
    
    setAuthState({
      ...authState,
      friends: [...authState.friends, friendId]
    });
    
    toast({
      title: "Friend added",
      description: "Friend request accepted.",
    });
  };
  
  const removeFriend = (friendId: string) => {
    setAuthState({
      ...authState,
      friends: authState.friends.filter(id => id !== friendId)
    });
    
    toast({
      title: "Friend removed",
      description: "Friend has been removed from your list.",
    });
  };
  
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
    authState,
    login,
    register,
    loginAsGuest,
    logout,
    updateProfile,
    updateSettings,
    addFriend,
    removeFriend,
    addNotification,
    markNotificationAsRead,
    clearNotifications
  };
}
