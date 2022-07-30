import { useMeta } from '@';
import { FC } from 'react';
import { useOutlet, Link } from 'react-router-dom';

export const App: FC = function () {
  const Outlet = useOutlet();
  const { title } = useMeta<{ title: string }>();

  return (
    <>
      <Link to='/child' data-testid='child_link'>
        show child
      </Link>
      <Link to='/list' data-testid='list_link'>
        to list
      </Link>
      <p data-testid='app'>App</p>
      <p data-testid='app_meta'>{title}</p>
      {Outlet}
    </>
  );
};

export const List: FC = function () {
  const { login } = useMeta<{ login: boolean }>();

  return (
    <>
      <p data-testid='list'>List</p>
      <p data-testid='list_meta'>{login?.toString()}</p>
    </>
  );
};

export const Child: FC = function () {
  const { title } = useMeta<{ title: string }>();

  return (
    <>
      <p data-testid='child'>Child</p>
      <p data-testid='child_meta'>{title}</p>
    </>
  );
};
