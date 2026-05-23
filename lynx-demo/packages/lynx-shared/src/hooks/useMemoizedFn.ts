import { useRef, useCallback } from '@lynx-js/react';

/**
 * Hook to keep a function reference stable while always calling the latest version
 * Useful for passing callbacks to optimized child components
 */
export function useMemoizedFn<T extends (...args: unknown[]) => unknown>(fn: T): T {
  const fnRef = useRef(fn);
  fnRef.current = fn;

  return useCallback(((...args: unknown[]) => fnRef.current(...args)) as T, []);
}
