
/**
 * Error handling utilities for game state
 */

import { toast } from "@/hooks/use-toast";

// Error codes for different scenarios
export enum GameErrorCode {
  SAVE_FAILED = 'SAVE_FAILED',
  LOAD_FAILED = 'LOAD_FAILED',
  DELETE_FAILED = 'DELETE_FAILED',
  INVALID_GAME_STATE = 'INVALID_GAME_STATE',
  NETWORK_ERROR = 'NETWORK_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  AUTHORIZATION_ERROR = 'AUTHORIZATION_ERROR',
  DATABASE_ERROR = 'DATABASE_ERROR',
}

// Interface for structured errors
export interface GameError {
  code: GameErrorCode;
  message: string;
  originalError?: any;
  context?: Record<string, any>;
}

// Create a structured error
export function createGameError(
  code: GameErrorCode,
  message: string,
  originalError?: any,
  context?: Record<string, any>
): GameError {
  return {
    code,
    message,
    originalError,
    context,
  };
}

// Handle errors with consistent logging and toast notification
export function handleGameError(error: Error | GameError | unknown, silent: boolean = false): GameError {
  let gameError: GameError;
  
  if ((error as GameError).code) {
    gameError = error as GameError;
  } else if (error instanceof Error) {
    gameError = createGameError(
      GameErrorCode.UNKNOWN_ERROR,
      error.message,
      error
    );
  } else {
    gameError = createGameError(
      GameErrorCode.UNKNOWN_ERROR,
      'An unknown error occurred',
      error
    );
  }
  
  // Log error to console with structured data
  console.error(`[Game Error] ${gameError.code}: ${gameError.message}`, {
    originalError: gameError.originalError,
    context: gameError.context
  });
  
  // Show toast notification unless silent mode is enabled
  if (!silent) {
    toast({
      title: getFriendlyErrorTitle(gameError.code),
      description: gameError.message,
      variant: "destructive",
    });
  }
  
  return gameError;
}

// Get user-friendly error titles based on error code
function getFriendlyErrorTitle(code: GameErrorCode): string {
  switch (code) {
    case GameErrorCode.SAVE_FAILED:
      return 'Save Failed';
    case GameErrorCode.LOAD_FAILED:
      return 'Load Failed';
    case GameErrorCode.DELETE_FAILED:
      return 'Delete Failed';
    case GameErrorCode.INVALID_GAME_STATE:
      return 'Invalid Game State';
    case GameErrorCode.NETWORK_ERROR:
      return 'Network Error';
    case GameErrorCode.VALIDATION_ERROR:
      return 'Validation Error';
    case GameErrorCode.AUTHORIZATION_ERROR:
      return 'Authorization Error';
    case GameErrorCode.DATABASE_ERROR:
      return 'Database Error';
    case GameErrorCode.UNKNOWN_ERROR:
    default:
      return 'Error';
  }
}

// Validate game state before loading or saving
export function validateGameState(gameState: any): boolean {
  // Basic validation - can be expanded based on requirements
  if (!gameState) return false;
  if (!gameState.game_id) return false;
  if (!gameState.players || !Array.isArray(gameState.players)) return false;
  if (typeof gameState.week !== 'number') return false;
  if (!gameState.phase || typeof gameState.phase !== 'string') return false;
  
  return true;
}
