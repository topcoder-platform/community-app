/**
 * Routing of Wipro Community.
 */

import Error404 from 'components/Error404';
import Footer from 'components/tc-communities/communities/wipro/Footer';
import Header from 'containers/tc-communities/Header';
import Home from 'components/tc-communities/communities/qa/Home';
import Learn from 'components/tc-communities/communities/qa/Learn';
import PT from 'prop-types';
import React from 'react';
import { Route, Switch } from 'react-router-dom';

import ChallengeListing from '../ChallengeListing';

export default function QA({ base, member, meta }) {
  return (
    <Route
      component={({ match }) => (
        <div>
          <Header pageId={match.params.pageId || 'home'} />
          <Switch>
            <Route
              component={() => <ChallengeListing meta={meta} />}
              exact
              path={`${base}/challenges`}
            />
            <Route
              component={Learn}
              exact
              path={`${base}/learn`}
            />
            <Route
              component={() => <Home member={member} />}
              exact
              path={`${base}/home`}
            />
            <Route
              component={() => <Home member={member} />}
              exact
              path={`${base}`}
            />
            <Route component={Error404} />
          </Switch>
          <Footer />
        </div>
      )}
      path={`${base}/:pageId?`}
    />
  );
}

QA.defaultProps = {
  base: '',
};

QA.propTypes = {
  base: PT.string,
  member: PT.bool.isRequired,
  meta: PT.shape().isRequired,
};
