/**
 * Routing of Wipro Community.
 */

import Error404 from 'components/Error404';
import FAQ from 'components/tc-communities/communities/wipro/FAQ';
import Footer from 'components/tc-communities/communities/wipro/Footer';
import Header from 'containers/tc-communities/Header';
import Home from 'containers/tc-communities/wipro/Home';
import Learn from 'components/tc-communities/communities/wipro/Learn';
import PT from 'prop-types';
import React from 'react';
import theme from 'components/tc-communities/communities/wipro/theme';
import { ThemeProvider } from 'react-css-themr';
import { Route, Switch } from 'react-router-dom';

import ChallengeListing from '../ChallengeListing';
import Leaderboard from '../Leaderboard';

export default function Wipro({ base, meta }) {
  return (
    <Route
      component={({ match }) => (
        <ThemeProvider theme={theme} >
          <div>
            <Header pageId={match.params.pageId || 'home'} />
            <Switch>
              <Route
                component={() => <ChallengeListing meta={meta} />}
                exact
                path={`${base}/challenges`}
              />
              <Route
                component={FAQ}
                exact
                path={`${base}/faq`}
              />
              <Route
                component={() => <Leaderboard meta={meta} />}
                exact
                path={`${base}/leaderboard`}
              />
              <Route
                component={Learn}
                exact
                path={`${base}/learn`}
              />
              <Route
                component={Home}
                exact
                path={`${base}/home`}
              />
              <Route
                component={Home}
                exact
                path={`${base}`}
              />
              <Route component={Error404} />
            </Switch>
            <Footer />
          </div>
        </ThemeProvider>
      )}
      path={`${base}/:pageId?`}
    />
  );
}

Wipro.defaultProps = {
  base: '',
};

Wipro.propTypes = {
  base: PT.string,
  meta: PT.shape().isRequired,
};
