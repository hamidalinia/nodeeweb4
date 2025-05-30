import { useEffect, DependencyList } from 'react';

/**
 * Custom hook that debounces the execution of a function.
 *
 * @param fn The function to be debounced.
 * @param waitTime The time to wait before executing the function (in milliseconds).
 * @param deps Optional dependencies array to trigger the effect when any of the dependencies change.
 */
export function useDebounceEffect(
  fn: () => void,
  waitTime: number,
  deps?: DependencyList
) {
  useEffect(() => {
    const t = setTimeout(() => {
      fn.apply(undefined, deps);
    }, waitTime);

    return () => {
      clearTimeout(t);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
