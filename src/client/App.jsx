/**
 * Client-side rendering of the App.
 */

import { BrowserRouter, browserHistory } from 'react-router-dom';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';

import App from '../shared';
import store from '../shared/store';

render(
  <Provider store={store}>
    <BrowserRouter history={browserHistory}>
      <App />
    </BrowserRouter>
  </Provider>,
  document.getElementById('react-view'));
