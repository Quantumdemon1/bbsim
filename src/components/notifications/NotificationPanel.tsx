
import React from 'react';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription,
  SheetFooter
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bell, UserPlus, Gamepad, Info, Clock, CheckCircle, Trash } from 'lucide-react';
import { Notification } from '@/hooks/usePlayerAuth';

interface NotificationPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  notifications: Notification[];
  onClearAll: () => void;
  onMarkAsRead: (id: string) => void;
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({
  open,
  onOpenChange,
  notifications,
  onClearAll,
  onMarkAsRead
}) => {
  const formatTime = (timestamp: number) => {
    const now = new Date();
    const notifTime = new Date(timestamp);
    const diffMs = now.getTime() - notifTime.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays} days ago`;
  };
  
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'friend_request':
        return <UserPlus className="h-5 w-5 text-blue-500" />;
      case 'game_invite':
        return <Gamepad className="h-5 w-5 text-green-500" />;
      case 'system_message':
      default:
        return <Info className="h-5 w-5 text-yellow-500" />;
    }
  };
  
  const unreadCount = notifications.filter(n => !n.read).length;
  
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="bg-game-dark text-white border-l border-game-accent w-80 sm:w-96 max-w-full">
        <SheetHeader>
          <SheetTitle className="text-white flex items-center">
            <Bell className="mr-2 h-5 w-5 text-game-accent" />
            Notifications
            {unreadCount > 0 && (
              <span className="ml-2 bg-game-accent text-black text-xs rounded-full px-2 py-0.5">
                {unreadCount} new
              </span>
            )}
          </SheetTitle>
          <SheetDescription className="text-gray-400">
            Stay updated with game events and friend requests
          </SheetDescription>
        </SheetHeader>
        
        <ScrollArea className="h-[calc(100vh-12rem)] pr-4 mt-4">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-gray-400">
              <Bell className="h-10 w-10 mb-2 opacity-30" />
              <p>No notifications yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {notifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={`p-3 rounded-lg relative ${
                    notification.read ? 'bg-game-medium/40' : 'bg-game-medium/80 border-l-4 border-game-accent'
                  }`}
                >
                  <div className="flex">
                    <div className="mr-3 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">{notification.message}</p>
                      <div className="flex items-center text-xs text-gray-400 mt-1">
                        <Clock className="h-3 w-3 mr-1" />
                        {formatTime(notification.timestamp)}
                      </div>
                    </div>
                  </div>
                  {!notification.read && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 absolute top-2 right-2 text-gray-400 hover:text-white"
                      onClick={() => onMarkAsRead(notification.id)}
                    >
                      <CheckCircle className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
        
        <SheetFooter className="mt-4">
          <Button 
            variant="outline" 
            onClick={onClearAll}
            disabled={notifications.length === 0}
            className="w-full text-gray-400 border-gray-700 hover:bg-gray-700"
          >
            <Trash className="h-4 w-4 mr-2" />
            Clear All
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default NotificationPanel;
