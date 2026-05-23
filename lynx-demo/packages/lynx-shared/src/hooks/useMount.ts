import { useEffect } from '@lynx-js/react';

/**
 * Hook that runs a callback once on component mount
 */
export function useMount(fn: () => void) {
  useEffect(() => {
    fn();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
