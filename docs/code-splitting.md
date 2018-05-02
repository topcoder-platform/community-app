# Code Splitting

***Functionality described below has been moved to `topcoder-react-utils`.***
***This document will be updated accordingly and moved shortly.***

### Background

As a codebase grows in size, so do the JS and CSS bundles generated from this codebase. Reaching megabytes of JS and CSS is extremely easy, and this size start having an impact on website loading time, and performance of development tools. Solution to this problem is the code splitting: JS and CSS bundles are devided into multiple pieces which are loaded dynamically from the server (or the local cache) when necessary. Different routes of an app are obvious choice for the split points.

Although this idea sounds simple, its implementation is not, especially for a complex application setup, using server-side rendering, SCSS compilation, etc. Webpack's generic documentation on the code splitting ([1](https://webpack.js.org/guides/code-splitting/), [2](https://webpack.js.org/guides/lazy-loading/)) refer to **react-router**'s [Code Splitting](https://reacttraining.com/react-router/web/guides/code-splitting) documentation for instructions on code-splitting support in ReactJS. That document says in the end:

> ### Code-splitting + server rendering
> We’ve tried and failed a couple of times. What we learned:
> - You need synchronous module resolution on the server so you can get those bundles in the initial render.
> - You need to load all the bundles in the client that were involved in the server render before rendering so that the client render is the same as the server render. (The trickiest part, I think its possible but this is where I gave up.)
> - You need asynchronous resolution for the rest of the client app’s life.
> 
> We determined that google was indexing our sites well enough for our needs without server rendering, so we dropped it in favor of code-splitting + service worker caching. Godspeed those who attempt the server-rendered, code-split apps.

It proves the point that code-splitting with server rendering is non-trivial, and, probably, hardly anybody does it.

**Welcome to Topcoder! Here difficult things are achieved fast, and miracles take just a bit longer!**

In other words, we got our custom solution for code-splitting with support for server-side rendering, and all other bells and whistles we have in our `community-app` setup.

**P.S.:** Current solution may look a bit ugly due to large amount of boilerplate code necessary to process client- and server-side imports in a correct way. The amount of such boilerplate code can be radically decreased if we write our own small Babel plugin, which will take care about these imports in the way we need.

### How To Do The Code-Splitting

We use `react-router` for routing inside the app. A trivial router with just one route looks like:

```
import Component from 'components/Component';
import { Route } from 'react-router-dom';

export default Routes() {
  return <Route path="/endpoint" component={Component} />;
}
```

When this code is bundled by Webpack, the compiled JS and CSS code for the Component is bundled into the main app bundle. To split it into a separate bundle, which is loaded dynamically, when necessary, you replace this code by:

```
import LoadingIndicator from 'components/LoadingIndicator';
import path from 'path';
import { requireWeak, resolveWeak, SplitRoute } from 'utils/router';

export default Routes() {
  return (
    <SplitRoute
      chunkName="sample-split-route"
      path="/endpoint"
      renderClientAsync={(props) =>
        import(
          /* webpackChunkName: "sample-split-route" */
          'components/Component',
        ).then(({ default: Component }) => <Component {...props} />)
      }
      renderPlaceholder={(props) => <LoadingIndicator {...props} />}
      renderServer={(props) => {
        const p = resolveWeak('components/Component');
        const Component = requireWeak(path.resolve(__dirname, p));
        return <Component {...props} />;
      }}
    />
  );
}

```

First of all, under the hood `SplitRoute` uses **react-router**'s `Route` to make the actual routing, so it accepts the following `Route` props (they work exactly the same as for the `Router`): `exact`, `location`, `path`, `strict`. Instead of `children`, `component`, and `render` props you MUST provide `id`, and `renderClientAsync` props; and you MAY additionally provide `renderPlaceholder` and `renderServer` props. These work the following way:

-   `chunkName` must be a string ID, unique among different instances of the `SplitRoute` in the app; but the same at the client- and server-side for the same instance of `SplitRoute`. It also must match the value of `webpackChunkName` comment inside `renderClientAsync` function (if you make a misprint, the styling of the splitted code will be lost);

-   `renderClientAsync` must be a function, which receives Route props (`match`, `location`, `history`), performs dynamic (async) loading of the related code (if necessary), and renders the component to be mounted on the route. To work properly, you should import the module in question as `import(/* webpackChunkName: "sample-split-route" */ 'PATH/TO/THE/MODULE')` (you must pass the path statically, passing in a variable holding the path, won't work properly). This instruction returns a promise which resolves to the requested module, once it is loaded from the server or from the local cache (the module required this way, is not bundled into the main bundle). Because we use ES6 modules, the component exported from such module as `export default Component` will be stored in the `default` field of the resolved promise value. You should map it into the actual component to mount on the route, thus `.then(({ default: Component }) => <Component {...props }>)` (sure, you may omit `props` if your component does not need them).

-   The component's module will be loaded from the server the first time the route is matched. It will take some time during which nothing will be rendered at this route. To work around it there is an optional `renderPlaceholder` prop. If provided, when the route is matched, this prop will be used to render a placeholder component in the route until the async component is loaded.

-   `renderServer` prop, which is executed only at the server side and it specifies how the server-side rendering of the route is done when the route is matched. To work properly, you should require your component inside this `renderServer` function, using the code 
    ```
    const p = resolveWeak('PATH/TO/THE/MODULE);
    const Component = requireWeak(path.resolve(__dirname, p));
    ```
    This block of code does the same as `import Component from 'PATH/TO/THE/MODULE'`, but the required module is not bundled into the main bundle by Webpack.

    In general, you want to ensure that `renderServer` and `renderClientAsync` functions render exactly the same component, so that when you go directly to the route, you don't see any changes in the page during its loading, it just loads in its target form from the beginning. Though, technically, it is not obligatory to render the same in this functions. If they render different things, then the components rendered by `renderServer` will be visible until the moment when the `renderClientAsync` finishes rendering at the client side, and then the content will be switched to the result of `renderClientAsync`.

### Caveats

Here are some non-trivial points, that should be merged into the body of documentation above, but for now they are just mentioned here as points to remember:

- Although `<SplitRoute>` is technically a route, it is not quite possible to use it inside `<Switch>`, so in many cases you just have to use it as a usual component.

- If the chunk of code you split uses routing, you should use `<StaticRouter>` inside `renderServer` prop.

### Demo / Test

A simple demo / test of the code splitting is available at `/examples/code-splitting` endpoint of the app.