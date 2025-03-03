
import React from 'react';
import { Loader2 } from 'lucide-react';

export type LoadingSize = 'sm' | 'md' | 'lg' | 'xl';
export type LoadingVariant = 'default' | 'primary' | 'secondary' | 'ghost';

interface LoadingStateProps {
  size?: LoadingSize;
  variant?: LoadingVariant;
  text?: string;
  fullScreen?: boolean;
  className?: string;
}

const sizeClasses: Record<LoadingSize, string> = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
  xl: 'h-12 w-12'
};

const variantClasses: Record<LoadingVariant, string> = {
  default: 'text-gray-500',
  primary: 'text-primary',
  secondary: 'text-secondary',
  ghost: 'text-gray-300'
};

export const LoadingState: React.FC<LoadingStateProps> = ({
  size = 'md',
  variant = 'primary',
  text,
  fullScreen = false,
  className = ''
}) => {
  const content = (
    <div className={`flex flex-col items-center justify-center gap-2 ${className}`}>
      <Loader2 className={`${sizeClasses[size]} ${variantClasses[variant]} animate-spin`} />
      {text && <p className="text-sm text-muted-foreground animate-pulse">{text}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50">
        {content}
      </div>
    );
  }

  return content;
};

export const FullScreenLoading: React.FC<{ text?: string }> = ({ text }) => {
  return <LoadingState fullScreen size="lg" text={text} />;
};
