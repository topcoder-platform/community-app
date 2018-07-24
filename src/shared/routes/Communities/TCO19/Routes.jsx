/**
 * Routing of TCO Community.
 */

import Error404 from 'components/Error404';
import Header from 'containers/tc-communities/Header';
import Home from 'containers/tc-communities/tco19/Home';
import PT from 'prop-types';
import React from 'react';
import { Route, Switch } from 'react-router-dom';

import headerTheme from 'components/tc-communities/communities/tco19/themes/header.scss';

export default function TCO19({ base }) {
  return (
    <Route
      component={({ match }) => (
        <div>
          <Header
            baseUrl={base}
            hideJoinNow
            pageId={match.params.pageId || 'home'}
            theme={headerTheme}
          />
          <Switch>
            <Route
              component={() => <Home baseUrl={base} />}
              exact
              path={`${base}`}
            />
            <Route
              component={() => <Home baseUrl={base} />}
              exact
              path={`${base}/home`}
            />
            <Route
              component={Error404}
              path={`${base}/:any`}
            />
          </Switch>
        </div>
      )}
      path={`${base}/:pageId?`}
    />
  );
}

TCO19.defaultProps = {
  base: '',
};

TCO19.propTypes = {
  base: PT.string,
};
