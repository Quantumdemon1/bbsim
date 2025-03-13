
// Barrel file for storyline actions
import { handleStoryChoice } from './eventHandler';
import { generateRandomEvent } from './randomEventGenerator';
import { presentNextEvent, startStoryline } from './storylineManager';
import { triggerDiaryRoomEvent, triggerSocialEvent } from './eventTriggers';

// Export all action creators together
export {
  handleStoryChoice,
  generateRandomEvent,
  presentNextEvent,
  startStoryline,
  triggerDiaryRoomEvent,
  triggerSocialEvent
};
