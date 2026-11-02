/**
 * PoC code for the new implementation of server-side rendering.
 */

import React from 'react';
import { Provider } from 'react-redux';
import { withRouter } from 'react-router';
import { StaticRouter } from 'react-router-dom';
import { isomorphy, webpack } from 'topcoder-react-utils';

let ReactDOM;
if (isomorphy.isServerSide()) {
  ReactDOM = webpack.requireWeak('react-dom/server');
}

export async function DoSSR(request, store, App) {
  const ssrPromises = [];
  const context = {
    chunks: [],
    request,
    splits: {},
    ssrPromises,
    store,
  };
  ReactDOM.renderToString((
    <Provider store={store}>
      <StaticRouter context={context} location={request.originalUrl}>
        <App />
      </StaticRouter>
    </Provider>
  ));
  let i = 0;
  while (i < ssrPromises.length) {
    const pending = ssrPromises.slice(i);
    i = ssrPromises.length;
    await Promise.all(pending); // eslint-disable-line no-await-in-loop
  }
}

/**
 * Creates a decorator function for a component that benefits from server-side
 * rendering.
 * @param {Function} checkStore Given Redux store, and ExpressJS HTTP request,
 *  as its two arguments, this function should return `false` if the store
 *  misses any data necessary for the optimal server-side rendering. In this
 *  case the component will cut the rendering of ReactJS tree and call
 *  updateStore method to update the store. Once ready, it will continue
 *  with the rendering of decorated component, using updated store for that.
 * @param {Function} updateStore Given Redux store and ExpressJS HTTP request,
 *  as its two arguments, this function should update the store to the necessary
 *  state. It should return a promise that resolves when ready.
 */
export default function SSR(checkStore, updateStore) {
  return Component => (props) => {
    if (isomorphy.isClientSide()) return <Component {...props} />;
    const Wrapper = withRouter(({ location, staticContext }) => {
      const { request, ssrPromises, store } = staticContext;
      if (checkStore(store, props, request)) return <Component {...props} />;
      const promise = Promise.resolve().then(() => updateStore(store, props, request)).then(() => {
        ReactDOM.renderToString((
          <Provider store={store}>
            <StaticRouter context={staticContext} location={location}>
              <Component {...props} />
            </StaticRouter>
          </Provider>
        ));
      });
      // Mark rejections handled immediately while DoSSR awaits this same promise.
      // Otherwise another concurrent load can reject before its turn is awaited.
      promise.catch(() => undefined);
      if (ssrPromises) ssrPromises.push(promise);
      return null;
    });
    return <Wrapper />;
  };
}

/**
 * Creates a decorator function for a component that benefits from server-side
 * rendering.
 */
export function SSRPlaceholder() {
  return (Component, ComponentPlaceholder) => (props) => {
    if (isomorphy.isClientSide()) return <Component {...props} />;
    return <ComponentPlaceholder {...props} />;
  };
}
