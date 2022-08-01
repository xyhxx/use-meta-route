import { ReactElement, useContext } from 'react';
import {
  matchRoutes,
  parsePath,
  UNSAFE_RouteContext as RouteContext,
  useInRouterContext,
  useLocation,
} from 'react-router-dom';
import { RouteGuard, RouteMetaMatch, RouteMetaObject } from './types';
import { invariant, joinPaths, renderMatches, warningOnce } from './utils';

export function useMeta<Meta extends Record<string, any> = Record<string, any>>() {
  const context = useContext(RouteContext);
  const match = context.matches[context.matches.length - 1] as RouteMetaMatch;

  return (match.route.meta ?? {}) as Partial<Meta>;
}

export function useMetaRoutes(options: {
  routes: RouteMetaObject[];
  locationArg?: Partial<Location> | string;
  guard?: RouteGuard;
}): ReactElement | null {
  const { routes, locationArg, guard } = options;

  invariant(
    useInRouterContext(),
    // router loaded. We can help them understand how to avoid that.
    `useRoutes() may be used only in the context of a <Router> component.`,
  );

  const { matches: parentMatches } = useContext(RouteContext);
  const routeMatch = parentMatches[parentMatches.length - 1];
  const parentParams = routeMatch ? routeMatch.params : {};
  const parentPathname = routeMatch ? routeMatch.pathname : '/';
  const parentPathnameBase = routeMatch ? routeMatch.pathnameBase : '/';
  const parentRoute = routeMatch && routeMatch.route;

  if (process.env.NODE_ENV !== 'production') {
    const parentPath = (parentRoute && parentRoute.path) || '';
    warningOnce(
      parentPathname,
      !parentRoute || parentPath.endsWith('*'),
      `You rendered descendant <Routes> (or called \`useRoutes()\`) at ` +
        `"${parentPathname}" (under <Route path="${parentPath}">) but the ` +
        `parent route path has no trailing "*". This means if you navigate ` +
        `deeper, the parent won't match anymore and therefore the child ` +
        `routes will never render.\n\n` +
        `Please change the parent <Route path="${parentPath}"> to <Route ` +
        `path="${parentPath === '/' ? '*' : `${parentPath}/*`}">.`,
    );
  }

  const locationFromContext = useLocation();

  let location;
  if (locationArg) {
    const parsedLocationArg =
      typeof locationArg === 'string' ? parsePath(locationArg) : locationArg;

    invariant(
      parentPathnameBase === '/' || parsedLocationArg.pathname?.startsWith(parentPathnameBase),
      `When overriding the location using \`<Routes location>\` or \`useRoutes(routes, location)\`, ` +
        `the location pathname must begin with the portion of the URL pathname that was ` +
        `matched by all parent routes. The current pathname base is "${parentPathnameBase}" ` +
        `but pathname "${parsedLocationArg.pathname}" was given in the \`location\` prop.`,
    );

    location = parsedLocationArg;
  } else {
    location = locationFromContext;
  }

  const pathname = location.pathname || '/';
  const remainingPathname =
    parentPathnameBase === '/' ? pathname : pathname.slice(parentPathnameBase.length) || '/';
  const matches = matchRoutes(routes, { pathname: remainingPathname }) as RouteMetaMatch[];

  const matchList =
    matches &&
    matches.map(match =>
      Object.assign({}, match, {
        params: Object.assign({}, parentParams, match.params),
        pathname: joinPaths([parentPathnameBase, match.pathname]),
        pathnameBase:
          match.pathnameBase === '/'
            ? parentPathnameBase
            : joinPaths([parentPathnameBase, match.pathnameBase]),
      }),
    );

  return renderMatches({ matches: matchList, parentMatches, guard });
}
