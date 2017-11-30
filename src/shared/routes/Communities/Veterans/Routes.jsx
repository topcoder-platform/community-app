/**
 * Routing of Veterans Community.
 */

import ChallengeDetails from 'routes/ChallengeDetails';
import ChallengeListing from 'routes/Communities/ChallengeListing';
import Error404 from 'components/Error404';
import Footer from 'components/tc-communities/communities/veterans/Footer';
import Header from 'containers/tc-communities/Header';
import Home from 'components/tc-communities/communities/veterans/Home';
import imageTextStyle from 'components/tc-communities/communities/veterans/themes/image-text.scss';
import Learn from 'components/tc-communities/communities/veterans/Learn';
import PT from 'prop-types';
import React from 'react';
import Submission from 'routes/Submission';
import SubmissionManagement from 'routes/SubmissionManagement';
import { ThemeProvider } from 'react-css-super-themr';
import { Route, Switch } from 'react-router-dom';

import Leaderboard from '../Leaderboard';

export default function Routes({ base, member, meta }) {
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
                component={() => ChallengeListing({
                  challengesUrl: `${base}/challenges`,
                  meta,
                  newChallengeDetails: true,
                })}
                exact
                path={`${base}/challenges`}
              />
              <Route
                component={routeProps => ChallengeDetails({
                  ...routeProps,
                  challengesUrl: `${base}/challenges`,
                })}
                exact
                path={`${base}/challenges/:challengeId(\\d{8})`}
              />
              <Route
                component={routeProps => Submission({
                  ...routeProps,
                  challengesUrl: `${base}/challenges`,
                })}
                exact
                path={`${base}/challenges/:challengeId(\\d{8})/submit`}
              />
              <Route
                component={routeProps => SubmissionManagement({
                  ...routeProps,
                  challengesUrl: `${base}/challenges`,
                })}
                exact
                path={`${base}/challenges/:challengeId(\\d{8})/my-submissions`}
              />
              <Route
                component={() => <Leaderboard meta={meta} />}
                exact
                path={`${base}/leaderboard`}
              />
              <Route
                component={() => (
                  <Learn baseUrl={base} member={member} />
                )}
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
  member: PT.bool.isRequired,
  meta: PT.shape().isRequired,
};
