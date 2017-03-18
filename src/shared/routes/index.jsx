/**
 * The top-level routing of the App.
 */

import 'isomorphic-fetch';
import React from 'react';
import {
  Switch,
  Route,
} from 'react-router-dom';

import Content from '../components/examples/Content';
import Error404 from '../components/Error404';

export default function Routes() {
  return (
    <Switch>
      <Route exact path="/" component={Content} />
      <Route component={Error404} />
    </Switch>
  );
}
