import { RouteGuard, RouteMetaObject, useMetaRoutes } from '@';
import { fireEvent, render } from '@testing-library/react';
import { FC } from 'react';
import { BrowserRouter as Router, Navigate } from 'react-router-dom';
import { expect, test, describe } from 'vitest';
import { List, App } from './element';

describe('useMetaRoutes guard', function () {
  const logined = { value: false };

  const routes: RouteMetaObject[] = [
    {
      path: '/',
      element: <App />,
      meta: { needLogin: false },
    },
    { path: '/list', element: <List />, meta: { needLogin: true } },
  ];

  const guard: RouteGuard = function ({ route: { meta } }) {
    if (meta?.needLogin && !logined.value) {
      return <Navigate replace to='/' />;
    }
  };

  test('route guard', async function () {
    const Routes: FC = function () {
      return useMetaRoutes({ routes, guard });
    };

    const app = render(
      <Router>
        <Routes />
      </Router>,
    );

    let link = app.getByTestId('list_link');
    fireEvent.click(link);

    let listText = app.queryByTestId('list');
    expect(listText).toBeNull();

    logined.value = true;

    link = app.getByTestId('list_link');
    fireEvent.click(link);

    listText = app.queryByTestId('list');
    expect(listText).not.toBeNull();
    expect(listText!.innerHTML).toBe('List');
  });
});
