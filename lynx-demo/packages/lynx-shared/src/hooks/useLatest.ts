import { useRef } from '@lynx-js/react';

/**
 * Hook to always get the latest value without causing re-renders
 */
export function useLatest<T>(value: T) {
  const ref = useRef(value);
  ref.current = value;
  return ref;
}
