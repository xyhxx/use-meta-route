import { ReactNode } from 'react';
import { RouteMatch, RouteObject } from 'react-router-dom';

export type RouteMetaObject = Omit<RouteObject, 'children'> & {
  meta?: Record<string, any>;
  children?: RouteMetaObject[];
};

export type RouteMetaMatch = Omit<RouteMatch, 'route'> & { route: RouteMetaObject };

export type RouteGuard = (route: RouteMetaMatch) => void | ReactNode;
