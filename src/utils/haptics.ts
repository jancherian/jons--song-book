/**
 * Web Vibration API helper with graceful fallback
 */
export const triggerHaptic = (duration: number = 15): void => {
  if (typeof window !== 'undefined' && 'navigator' in window && typeof navigator.vibrate === 'function') {
    try {
      navigator.vibrate(duration);
    } catch {
      // Gracefully no-op on unsupported browsers or permission restrictions
    }
  }
};
