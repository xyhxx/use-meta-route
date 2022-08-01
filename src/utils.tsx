import { ReactElement } from 'react';
import { RouteMatch, UNSAFE_RouteContext as RouteContext } from 'react-router-dom';
import { RouteGuard, RouteMetaMatch } from './types';

export const joinPaths = (paths: string[]): string => paths.join('/').replace(/\/\/+/g, '/');

export function invariant(cond: any, message: string): asserts cond {
  if (!cond) throw new Error(message);
}

export function warning(cond: any, message: string): void {
  if (!cond) {
    // eslint-disable-next-line no-console
    if (typeof console !== 'undefined') console.warn(message);

    try {
      // Welcome to debugging React Router!
      //
      // This error is thrown as a convenience so you can more easily
      // find the source for a warning that appears in the console by
      // enabling "pause on exceptions" in your JavaScript debugger.
      throw new Error(message);
      // eslint-disable-next-line no-empty
    } catch (e) {}
  }
}

const alreadyWarned: Record<string, boolean> = {};
export function warningOnce(key: string, cond: boolean, message: string) {
  if (!cond && !alreadyWarned[key]) {
    alreadyWarned[key] = true;
    warning(false, message);
  }
}

export function renderMatches(options: {
  matches: RouteMetaMatch[] | null;
  parentMatches?: RouteMatch[];
  guard?: RouteGuard;
}): ReactElement | null {
  const { matches, guard, parentMatches } = options;
  if (matches === null) return null;

  const { Provider } = RouteContext;

  return matches.reduceRight((outlet, match, index) => {
    const el = guard?.(match);

    return (
      <Provider
        value={{
          outlet,
          matches: (parentMatches ?? []).concat((matches as any[]).slice(0, index + 1)),
        }}
      >
        {el ?? match.route.element ?? outlet}
      </Provider>
    );
  }, null as ReactElement | null);
}
