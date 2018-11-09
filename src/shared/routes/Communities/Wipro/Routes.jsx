/**
 * Routing of Wipro Community.
 */

import ChallengeDetails from 'routes/ChallengeDetails';
import ChallengeListing from 'routes/Communities/ChallengeListing';
import ChallengeListingBanner from 'components/tc-communities/communities/wipro/ChallengeListingBanner';
import ContentfulRoute from 'components/Contentful/Route';
import FAQ from 'components/tc-communities/communities/wipro/FAQ';
import Footer from 'components/tc-communities/communities/wipro/Footer';
import Header from 'containers/tc-communities/Header';
import Home from 'containers/tc-communities/wipro/Home';
import LeaderboardBanner from 'components/tc-communities/communities/wipro/LeaderboardBanner';
import Learn from 'components/tc-communities/communities/wipro/Learn';
import PT from 'prop-types';
import React from 'react';
import Submission from 'routes/Submission';
import SubmissionManagement from 'routes/SubmissionManagement';
import TermsDetail from 'routes/TermsDetail';
import theme from 'components/tc-communities/communities/wipro/theme';
import { ThemeProvider } from 'react-css-super-themr';
import { Route, Switch } from 'react-router-dom';

import Leaderboard from '../Leaderboard';

export default function Wipro({ base, meta }) {
  return (
    <Route
      component={({ match }) => (
        <ThemeProvider theme={theme}>
          <div>
            <Header
              baseUrl={base}
              pageId={match.params.pageId || 'home'}
            />
            <Switch>
              <Route
                component={() => ChallengeListing({
                  challengesUrl: `${base}/challenges`,
                  ChallengeListingBanner,
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
                  communityId: meta.communityId,
                })}
                exact
                path={`${base}/challenges/:challengeId(\\d{8}|\\d{5})`}
              />
              <Route
                component={routeProps => Submission({
                  ...routeProps,
                  challengesUrl: `${base}/challenges`,
                })}
                exact
                path={`${base}/challenges/:challengeId(\\d{8}|\\d{5})/submit`}
              />
              <Route
                component={routeProps => SubmissionManagement({
                  ...routeProps,
                  challengesUrl: `${base}/challenges`,
                })}
                exact
                path={`${base}/challenges/:challengeId(\\d{8}|\\d{5})/my-submissions`}
              />
              <Route
                component={TermsDetail}
                exact
                path={`${base}/challenges/terms/detail/:termId`}
              />
              <Route
                component={FAQ}
                exact
                path={`${base}/faq`}
              />
              <Route
                component={() => (
                  <Leaderboard
                    HeadBanner={LeaderboardBanner}
                    meta={meta}
                  />
                )}
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
                path={`${base || '/'}`}
              />
              <ContentfulRoute
                baseUrl={base}
                id="1VXRAIxJdi6eCeeyKCmicK"
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

Wipro.defaultProps = {
  base: '',
};

Wipro.propTypes = {
  base: PT.string,
  meta: PT.shape().isRequired,
};
