
import React, { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { ErrorBoundary } from '@/components/error/ErrorBoundary';
import { LoadingState } from '@/components/ui/loading-state';

interface GameContainerProps {
  isLoading: boolean;
  error: Error | null;
  children: ReactNode;
}

const GameContainer: React.FC<GameContainerProps> = ({ 
  isLoading, 
  error, 
  children 
}) => {
  const navigate = useNavigate();

  if (isLoading) {
    return <LoadingState fullScreen text="Loading game..." />;
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center bg-game-dark text-white p-4">
        <div className="max-w-md text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-4">An error occurred</h2>
          <p className="mb-6">{error.message}</p>
          <div className="flex justify-center gap-4">
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-game-accent hover:bg-game-highlight text-black font-medium rounded"
            >
              Reload Game
            </button>
            <button 
              onClick={() => navigate('/')} 
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded"
            >
              Return to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="h-full relative overflow-hidden">
        {children}
      </div>
    </ErrorBoundary>
  );
};

export default GameContainer;
