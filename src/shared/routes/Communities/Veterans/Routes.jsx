/**
 * Routing of Veterans Community.
 */

import Error404 from 'components/Error404';
import Footer from 'components/tc-communities/communities/veterans/Footer';
import Header from 'containers/tc-communities/Header';
import Home from 'components/tc-communities/communities/veterans/Home';
import imageTextStyle from 'components/tc-communities/communities/veterans/themes/image-text.scss';
import Learn from 'components/tc-communities/communities/veterans/Learn';
import PT from 'prop-types';
import React from 'react';
import { ThemeProvider } from 'react-css-super-themr';
import { Route, Switch } from 'react-router-dom';

import ChallengeListing from '../ChallengeListing';
import Leaderboard from '../Leaderboard';

export default function Routes({ base, meta }) {
  return (
    <Route
      component={({ match }) => (
        <ThemeProvider
          theme={{
            ImageText2: imageTextStyle,
          }}
        >
          <div>
            <Header
              baseUrl={base}
              pageId={match.params.pageId || 'home'}
            />
            <Switch>
              <Route
                component={() => <ChallengeListing meta={meta} />}
                exact
                path={`${base}/challenges`}
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
                component={() => <Home baseUrl={base} />}
                exact
                path={`${base}/home`}
              />
              <Route
                component={Error404}
                path={`${base}/:any`}
              />
              <Route
                component={() => <Home baseUrl={base} />}
                exact
                path={`${base}`}
              />
            </Switch>
            <Footer />
          </div>
        </ThemeProvider>
      )}
      path={`${base}/:pageId?`}
    />
  );
}

Routes.defaultProps = {
  base: '',
};

Routes.propTypes = {
  base: PT.string,
  meta: PT.shape().isRequired,
};
