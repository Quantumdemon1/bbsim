
import React, { useState, useRef, useEffect } from 'react';
import { Send, X, Smile, User, ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGameContext } from '@/contexts/GameContext';
import { PlayerData } from '@/components/PlayerProfileTypes';

export type ChatMessage = {
  id: string;
  sender: string;
  senderId: string;
  content: string;
  timestamp: number;
  isBot: boolean;
}

interface ChatPanelProps {
  onClose?: () => void;
  minimizable?: boolean;
  initialMinimized?: boolean;
}

const ChatPanel: React.FC<ChatPanelProps> = ({ 
  onClose, 
  minimizable = true,
  initialMinimized = false
}) => {
  const { players, currentPlayer } = useGameContext();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [minimized, setMinimized] = useState(initialMinimized);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Mock bot responses for demonstration
  const botResponses = [
    "I'm thinking about who to nominate this week...",
    "We need to talk about our alliance strategy.",
    "Did you see what happened in the competition?",
    "I think we should vote them out next week.",
    "Let's form an alliance. I trust you.",
    "Be careful what you say, others might be listening.",
    "I heard they're targeting you next.",
    "The HoH competition was really tough!",
    "I'm going to use the veto if I win it.",
    "Don't tell anyone, but I have a secret power.",
    "I think they're working together behind our backs."
  ];
  
  useEffect(() => {
    // Add welcome message
    const welcomeMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'Game Host',
      senderId: 'system',
      content: 'Welcome to the house chat! You can communicate with other houseguests here.',
      timestamp: Date.now(),
      isBot: true
    };
    
    setMessages([welcomeMessage]);
  }, []);
  
  useEffect(() => {
    // Scroll to bottom when messages update
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSendMessage = () => {
    if (!message.trim() || !currentPlayer) return;
    
    // Add user message
    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      sender: currentPlayer.name,
      senderId: currentPlayer.id,
      content: message,
      timestamp: Date.now(),
      isBot: false
    };
    
    setMessages([...messages, newMessage]);
    setMessage('');
    
    // Simulate bot response after a delay
    setTimeout(() => {
      // Randomly select a player for bot response
      const botsInHouse = players.filter(p => 
        p.id !== currentPlayer.id && 
        p.status !== 'evicted'
      );
      
      if (botsInHouse.length > 0) {
        const randomBot = botsInHouse[Math.floor(Math.random() * botsInHouse.length)];
        const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)];
        
        const botMessage: ChatMessage = {
          id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          sender: randomBot.name,
          senderId: randomBot.id,
          content: randomResponse,
          timestamp: Date.now(),
          isBot: true
        };
        
        setMessages(prevMessages => [...prevMessages, botMessage]);
      }
    }, 1000 + Math.random() * 2000); // Random delay between 1-3 seconds
  };
  
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };
  
  if (minimized) {
    return (
      <div className="fixed bottom-4 right-4 z-20">
        <Button 
          onClick={() => setMinimized(false)}
          className="bg-game-accent text-black hover:bg-game-highlight rounded-full p-2 h-14 w-14 flex items-center justify-center"
        >
          <ChevronUp className="w-6 h-6" />
        </Button>
      </div>
    );
  }
  
  return (
    <div className="fixed bottom-0 right-0 w-full sm:w-96 bg-game-dark border border-game-accent rounded-t-lg shadow-lg z-20">
      <div className="flex items-center justify-between bg-game-medium p-2 rounded-t-lg">
        <h3 className="font-semibold text-white">House Chat</h3>
        <div className="flex space-x-1">
          {minimizable && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setMinimized(true)}
              className="h-7 w-7 rounded-full hover:bg-game-accent/20"
            >
              <ChevronDown className="h-4 w-4 text-white" />
            </Button>
          )}
          {onClose && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onClose}
              className="h-7 w-7 rounded-full hover:bg-red-500/20"
            >
              <X className="h-4 w-4 text-white" />
            </Button>
          )}
        </div>
      </div>
      
      <div className="h-96 overflow-y-auto p-3 bg-game-dark/90">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`mb-2 flex ${msg.senderId === currentPlayer?.id ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[80%] rounded-lg px-3 py-2 ${
                msg.senderId === currentPlayer?.id 
                  ? 'bg-game-accent text-black' 
                  : msg.senderId === 'system'
                    ? 'bg-game-medium/70 text-white italic'
                    : 'bg-game-medium text-white'
              }`}
            >
              {msg.senderId !== currentPlayer?.id && msg.senderId !== 'system' && (
                <div className="font-semibold text-xs text-game-accent mb-1">
                  {msg.sender}
                </div>
              )}
              <div className="text-sm">{msg.content}</div>
              <div className="text-right text-xs opacity-70 mt-1">
                {formatTime(msg.timestamp)}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-2 bg-game-medium flex items-center space-x-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full text-gray-400 hover:text-white"
        >
          <Smile className="h-5 w-5" />
        </Button>
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Type a message..."
          className="bg-game-dark border-game-accent/50 text-white"
        />
        <Button
          variant="ghost"
          size="icon"
          onClick={handleSendMessage}
          className="h-8 w-8 rounded-full text-game-accent hover:text-white hover:bg-game-accent/20"
          disabled={!message.trim()}
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default ChatPanel;
