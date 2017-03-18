/**
 * This module creates Redux store.
 */

/* Conditional requires are absolutely necessary in this module. */
/* eslint-disable global-require */

import { compose, createStore } from 'redux';
import reducers from './reducers';

const IS_DEV = process.env.NODE_ENV === 'development';

const devTools = IS_DEV
  ? require('./containers/DevTools').default.instrument()
  : undefined;

const enhancer = compose(
  /* applyMiddleware(...) should be placed here, before devTools! */
  devTools);

const store = createStore(reducers, {}, enhancer);

if (IS_DEV && module.hot) {
  module.hot.accept('./reducers', () =>
    store.replaceReducer(require('./reducers').default));
}

export default store;
