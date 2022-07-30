import { RouteMetaObject, useMeta, useMetaRoutes } from '@';
import { fireEvent, render } from '@testing-library/react';
import { FC } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { expect, test, describe } from 'vitest';
import { Child, List, App } from './element';

describe('useMeta', function () {
  test('useMeta is define', function () {
    expect(useMeta).toBeDefined();
  });

  test('route meta data', function () {
    const routes: RouteMetaObject[] = [
      {
        path: '/',
        element: <App />,
        meta: { title: 'appTitle' },
        children: [{ path: '/child', element: <Child />, meta: { title: 'childTitle' } }],
      },
      { path: '/list', element: <List />, meta: { login: false } },
    ];

    const Routes: FC = function () {
      const Routes = useMetaRoutes({ routes });

      return Routes;
    };

    const app = render(
      <Router>
        <Routes />
      </Router>,
    );

    const appMeta = app.getByTestId('app_meta');
    expect(appMeta.innerHTML).toBe('appTitle');

    const childLink = app.getByTestId('child_link');
    fireEvent.click(childLink);

    const childMeta = app.getByTestId('child_meta');
    expect(childMeta.innerHTML).toBe('childTitle');

    const listLink = app.getByTestId('list_link');
    fireEvent.click(listLink);

    const listMeta = app.getByTestId('list_meta');
    expect(listMeta.innerHTML).toBe('false');
  });
});
