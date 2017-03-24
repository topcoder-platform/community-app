/**
 * Routes of various examples of using various staff
 * available in this App code.
 */

import React from 'react';
import {
  Switch,
  Route,
} from 'react-router-dom';

import CssModules from '../../components/examples/CssModules';
import DataFetch from './DataFetch';
import SvgLoading from '../../components/examples/SvgLoading';

export default function Examples() {
  return (
    <Switch>
      <Route path="*/css-modules" component={CssModules} />
      <Route path="*/data-fetch" component={DataFetch} />
      <Route path="*/svg-loading" component={SvgLoading} />
    </Switch>
  );
}
