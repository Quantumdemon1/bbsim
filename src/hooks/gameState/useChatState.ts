
import { useState } from 'react';

export function useChatState() {
  const [showChat, setShowChat] = useState(false);
  
  return {
    showChat,
    setShowChat
  };
}
