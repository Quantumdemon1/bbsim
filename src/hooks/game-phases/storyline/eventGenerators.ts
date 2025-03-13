
// This is now just a barrel file that re-exports from the generators directory
// to maintain backward compatibility with existing imports
import {
  createDiaryRoomEvent,
  createSocialEvent,
  generateTargetedEvent,
  generateStorylineEvent,
  generateRandomGameEvent
} from './generators';

export {
  createDiaryRoomEvent,
  createSocialEvent,
  generateTargetedEvent,
  generateStorylineEvent,
  generateRandomGameEvent
};
