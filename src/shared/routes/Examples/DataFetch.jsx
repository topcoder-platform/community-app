/**
 * Routes for Data Fetch example.
 */

import DataFetchIntro from 'components/examples/DataFetch';
import DataFetchContainer from 'containers/examples/DataFetch';
import React from 'react';
import {
  Switch,
  Route,
} from 'react-router-dom';

export default function DataFetchRoute() {
  return (
    <Switch>
      <Route exact path="*/data-fetch" component={DataFetchIntro} />
      <Route component={DataFetchContainer} />
    </Switch>
  );
}
