
/**
 * Performance monitoring service
 * Tracks key performance metrics and reports them
 */

// Performance marks and measurements
const PERFORMANCE_MARKS = {
  APP_INIT_START: 'app-init-start',
  APP_INIT_END: 'app-init-end',
  GAME_LOAD_START: 'game-load-start',
  GAME_LOAD_END: 'game-load-end',
  PHASE_CHANGE_START: 'phase-change-start',
  PHASE_CHANGE_END: 'phase-change-end',
  SAVE_GAME_START: 'save-game-start',
  SAVE_GAME_END: 'save-game-end',
};

// Check if Performance API is available
const isPerformanceSupported = typeof performance !== 'undefined' && 
  typeof performance.mark === 'function' && 
  typeof performance.measure === 'function';

// Track a performance mark
export function markPerformance(markName: string): void {
  if (!isPerformanceSupported) return;
  
  try {
    performance.mark(markName);
  } catch (error) {
    console.error(`Failed to create performance mark ${markName}:`, error);
  }
}

// Measure time between two marks
export function measurePerformance(
  measureName: string, 
  startMark: string, 
  endMark: string,
  report: boolean = true
): PerformanceEntry | undefined {
  if (!isPerformanceSupported) return;
  
  try {
    performance.measure(measureName, startMark, endMark);
    const measurements = performance.getEntriesByName(measureName);
    const lastMeasurement = measurements[measurements.length - 1];
    
    if (report && lastMeasurement) {
      reportPerformanceMeasurement(measureName, lastMeasurement.duration);
    }
    
    return lastMeasurement;
  } catch (error) {
    console.error(`Failed to measure ${measureName} between ${startMark} and ${endMark}:`, error);
    return undefined;
  }
}

// Track app initialization
export function trackAppInitialization(): void {
  markPerformance(PERFORMANCE_MARKS.APP_INIT_START);
  
  window.addEventListener('load', () => {
    markPerformance(PERFORMANCE_MARKS.APP_INIT_END);
    measurePerformance(
      'app-initialization', 
      PERFORMANCE_MARKS.APP_INIT_START, 
      PERFORMANCE_MARKS.APP_INIT_END
    );
  });
}

// Track game loading
export function trackGameLoading(): { start: () => void; end: () => void } {
  return {
    start: () => markPerformance(PERFORMANCE_MARKS.GAME_LOAD_START),
    end: () => {
      markPerformance(PERFORMANCE_MARKS.GAME_LOAD_END);
      measurePerformance(
        'game-loading',
        PERFORMANCE_MARKS.GAME_LOAD_START,
        PERFORMANCE_MARKS.GAME_LOAD_END
      );
    }
  };
}

// Track phase changes
export function trackPhaseChange(): { start: () => void; end: () => void } {
  return {
    start: () => markPerformance(PERFORMANCE_MARKS.PHASE_CHANGE_START),
    end: () => {
      markPerformance(PERFORMANCE_MARKS.PHASE_CHANGE_END);
      measurePerformance(
        'phase-change',
        PERFORMANCE_MARKS.PHASE_CHANGE_START,
        PERFORMANCE_MARKS.PHASE_CHANGE_END
      );
    }
  };
}

// Track save game operations
export function trackSaveGame(): { start: () => void; end: () => void } {
  return {
    start: () => markPerformance(PERFORMANCE_MARKS.SAVE_GAME_START),
    end: () => {
      markPerformance(PERFORMANCE_MARKS.SAVE_GAME_END);
      measurePerformance(
        'save-game',
        PERFORMANCE_MARKS.SAVE_GAME_START,
        PERFORMANCE_MARKS.SAVE_GAME_END
      );
    }
  };
}

// Report performance measurement to analytics
function reportPerformanceMeasurement(name: string, duration: number): void {
  // In production, this would send data to an analytics service
  // For now, we'll just log to console
  console.log(`Performance: ${name} took ${duration.toFixed(2)}ms`);
  
  // Example implementation for when analytics is added:
  // if (window.analytics) {
  //   window.analytics.track('Performance Measurement', {
  //     name,
  //     duration,
  //     timestamp: new Date().toISOString(),
  //   });
  // }
}

// Clear all performance marks and measurements
export function clearPerformanceMarks(): void {
  if (!isPerformanceSupported) return;
  
  try {
    performance.clearMarks();
    performance.clearMeasures();
  } catch (error) {
    console.error('Failed to clear performance marks:', error);
  }
}

// Initialize performance monitoring
export function initPerformanceMonitoring(): void {
  if (!isPerformanceSupported) {
    console.warn('Performance API not supported in this browser');
    return;
  }
  
  trackAppInitialization();
  
  // Log long tasks
  if ('PerformanceObserver' in window) {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          console.warn(`Long task detected: ${entry.duration}ms`, entry);
        });
      });
      
      observer.observe({ entryTypes: ['longtask'] });
    } catch (e) {
      console.warn('Long Task monitoring not supported', e);
    }
  }
}
