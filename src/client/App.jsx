/**
 * Client-side rendering of the App.
 */

import { BrowserRouter } from 'react-router-dom';
import React from 'react';
import ReactDOM from 'react-dom';
import Routes from '../shared/routes';

ReactDOM.render(
  <BrowserRouter><Routes /></BrowserRouter>,
  document.getElementById('react-view'));
