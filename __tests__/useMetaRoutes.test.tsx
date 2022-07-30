import { RouteMetaObject, useMetaRoutes } from '@';
import { fireEvent, render } from '@testing-library/react';
import { FC } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { expect, test, describe } from 'vitest';
import { Child, List, App } from './element';

describe('useMetaRoutes', function () {
  test('useMetaRoutes is define', function () {
    expect(useMetaRoutes).toBeDefined();
  });

  test('route render', async function () {
    const routes: RouteMetaObject[] = [
      { path: '/', element: <App />, children: [{ path: '/child', element: <Child /> }] },
      { path: '/list', element: <List /> },
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

    const appPElement = app.getByTestId('app');
    const appChildPExist = app.queryByTestId('child');

    expect(appChildPExist).toBeNull();
    expect(appPElement.innerHTML).toBe('App');

    const appChildLink = app.getByTestId('child_link');
    fireEvent.click(appChildLink);

    const appChildPElement = app.getByTestId('child');
    expect(appChildPElement.innerHTML).toBe('Child');

    const AppListLink = app.getByTestId('list_link');
    fireEvent.click(AppListLink);

    const listPElement = app.getByTestId('list');
    expect(listPElement.innerHTML).toBe('List');
  });
});
