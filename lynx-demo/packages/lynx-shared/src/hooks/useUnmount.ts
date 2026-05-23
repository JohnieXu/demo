import { useEffect, useRef } from '@lynx-js/react';

/**
 * Hook that runs a callback when component unmounts
 */
export function useUnmount(fn: () => void) {
  const fnRef = useRef(fn);
  fnRef.current = fn;

  useEffect(() => {
    return () => {
      fnRef.current();
    };
  }, []);
}
