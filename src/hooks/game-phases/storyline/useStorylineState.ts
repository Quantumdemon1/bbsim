
// This is now just a barrel file that re-exports from the state directory
// to maintain backward compatibility with existing imports
import { useStorylineState } from './state';

export { useStorylineState };
export default useStorylineState;
