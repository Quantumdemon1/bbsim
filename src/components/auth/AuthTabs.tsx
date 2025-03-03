
import React from 'react';
import { Button } from "@/components/ui/button";
import { LogIn, UserPlus } from 'lucide-react';

interface AuthTabsProps {
  activeTab: 'login' | 'register';
  setActiveTab: (tab: 'login' | 'register') => void;
}

const AuthTabs: React.FC<AuthTabsProps> = ({ activeTab, setActiveTab }) => {
  return (
    <div className="flex mb-4">
      <Button
        variant={activeTab === 'login' ? 'default' : 'outline'}
        className={`flex-1 rounded-r-none ${activeTab === 'login' ? 'bg-game-accent' : ''}`}
        onClick={() => setActiveTab('login')}
      >
        <LogIn className="w-4 h-4 mr-2" />
        Login
      </Button>
      <Button
        variant={activeTab === 'register' ? 'default' : 'outline'}
        className={`flex-1 rounded-l-none ${activeTab === 'register' ? 'bg-game-accent' : ''}`}
        onClick={() => setActiveTab('register')}
      >
        <UserPlus className="w-4 h-4 mr-2" />
        Register
      </Button>
    </div>
  );
};

export default AuthTabs;
