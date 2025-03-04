
import { useEventDecisionManager as useEventDecisionManagerImpl } from './decisions/useEventDecisionManager';

/**
 * Re-export the main hook for backward compatibility
 */
export function useEventDecisionManager() {
  return useEventDecisionManagerImpl();
}
