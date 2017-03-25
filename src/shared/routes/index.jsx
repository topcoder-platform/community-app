/**
 * The top-level routing of the App.
 */

import Content from 'components/examples/Content';
import Error404 from 'components/Error404';
import 'isomorphic-fetch';
import React from 'react';
import {
  Switch,
  Route,
} from 'react-router-dom';

/* TODO: As we move towards production deploy, we should add a guard which
 * will prevent addition of /examples routes into production build. */
import Examples from './examples';

export default function Routes() {
  return (
    <Switch>
      <Route exact path="/" component={Content} />
      <Route exact path="/examples" component={Content} />
      <Route path="/examples" component={Examples} />
      <Route component={Error404} />
    </Switch>
  );
}
