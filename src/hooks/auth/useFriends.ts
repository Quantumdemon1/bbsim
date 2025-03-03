
import { useState } from 'react';
import { AuthState } from './types';
import { toast } from "@/components/ui/use-toast";

export function useFriends(authState: AuthState, setAuthState: React.Dispatch<React.SetStateAction<AuthState>>) {
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

  return {
    addFriend,
    removeFriend
  };
}
