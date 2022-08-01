<p align="center">
  <img src="./public/logo.svg" width="200" alt="logo" />
</p>

<h1 align="center">use-meta-route</h1>

<p align="center">rewrite useRoutes of react-router-dom to support route meta and route guard</p>
<br />
<br />

# useMetaRoutes

> provide meta data for route, which you can use in components or guard,the use method is exactly the same as useRoutes,
> and you can seamlessly switch between the two.

```typescript
function useMetaRoutes(options: {
  routes: RouteMetaObject[];
  locationArg?: Partial<Location> | string;
  guard?: RouteGuard;
}): ReactElement | null;
```

```react
const routes: RouteMetaObject[] = [
      { path: '/', element: <App />, children: [{ path: '/child', element: <Child /> }] },
      { path: '/list', element: <List /> },
    ];

const Routes: FC = function () {
    const Routes = useMetaRoutes({ routes });

    return (
        <BrowserRouter>
            <Routes />
        </BrowserRouter>,
    );
};

```

# useMeta

> if you want to get meta data in the component, you can use this hook to get it

```typescript
function useRouteMeta<Meta extends Record<string, any> = Record<string, any>>(): Partial<Meta>;
```

```react
const routes: RouteMetaObject[] = [
    {
        path: '/',
        element: <App />,
        meta: { title: 'appTitle' },
    },
    { path: '/list', element: <List />, meta: { login: false } },
];

const Routes: FC = function () {
    const Routes = useMetaRoutes({ routes });

    return (
        <BrowserRouter>
            <Routes />
        </BrowserRouter>,
    );
};

// App.tsx

const App: FC = function () {
  const { title } = useMeta<{ title: string }>();

  return (
      <p>{title}</p>
  );
};
```

# Guard

> you can do something before entering the routing component (e.g. authentication),if the function return a component,
> render returns the component first.

```react
const routes: RouteMetaObject[] = [
    {
        path: '/',
        element: <App />,
        meta: { needLogin: false },
    },
    { path: '/list', element: <List />, meta: { needLogin: true } },
];

const Routes: FC = function () {
  const {isAuth} = useRecoilValue(userState);

  const guard = useCallback<RouteGuard>(
    function ({route: {meta}}) {
      const { needLogin } = meta ?? {};

      if (needLogin && !isAuth) {
        return <Navigate replace to={HOME_PATH} />;
      }
    },
    [countValue],
  );
      
    const Routes = useMetaRoutes({ routes, guard });

    return (
        <BrowserRouter>
            <Routes />
        </BrowserRouter>,
    );
};
```
