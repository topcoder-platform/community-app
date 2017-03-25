/**
 * Routes of various examples of using various staff
 * available in this App code.
 */

import CssModules from 'components/examples/CssModules';
import FontsTest from 'components/examples/FontsTest';
import React from 'react';
import {
  Switch,
  Route,
} from 'react-router-dom';
import SvgLoading from 'components/examples/SvgLoading';

import DataFetch from './DataFetch';

export default function Examples() {
  return (
    <Switch>
      <Route path="*/css-modules" component={CssModules} />
      <Route path="*/data-fetch" component={DataFetch} />
      <Route path="*/fonts-test" component={FontsTest} />
      <Route path="*/svg-loading" component={SvgLoading} />
    </Switch>
  );
}
