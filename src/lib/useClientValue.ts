import { useSyncExternalStore } from "react";

const noopSubscribe = () => () => {};

/**
 * A value that only exists in the browser (today's date, the platform). The prerendered HTML and the
 * hydration pass use `serverValue`, then React switches to the client value without a mismatch.
 * `read` must return a primitive so repeated reads compare equal.
 */
export function useClientValue<T extends string | number | boolean>(read: () => T, serverValue: T): T {
  return useSyncExternalStore(noopSubscribe, read, () => serverValue);
}
