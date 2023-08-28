/**
 * Routing of Wipro Community.
 */

import ChallengeDetails from 'routes/ChallengeDetails';
import ChallengeListing from 'routes/Communities/ChallengeListing';
import ChallengeListingBanner from 'components/tc-communities/communities/wipro/ChallengeListingBanner';
// import ContentfulRoute from 'components/Contentful/Route';
import Header from 'containers/tc-communities/Header';
import LeaderboardBanner from 'components/tc-communities/communities/wipro/LeaderboardBanner';
import PT from 'prop-types';
import React from 'react';
import Submission from 'routes/Submission';
import SubmissionManagement from 'routes/SubmissionManagement';
import TermsDetail from 'routes/TermsDetail';
import ProfileStats from 'routes/ProfileStats';
import Viewport from 'components/Contentful/Viewport';
import theme from 'components/tc-communities/communities/wipro/theme';
import { ThemeProvider } from 'react-css-super-themr';
import { Route, Switch } from 'react-router-dom';
import { config } from 'topcoder-react-utils';

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
              logoutRedirect={config.URL.TOPGEAR}
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
                path={`${base}/challenges/:challengeId([\\w]{8}-[\\w]{4}-[\\w]{4}-[\\w]{4}-[\\w]{12}|\\d{5,8})`}
              />
              <Route
                component={routeProps => Submission({
                  ...routeProps,
                  challengesUrl: `${base}/challenges`,
                })}
                exact
                path={`${base}/challenges/:challengeId([\\w]{8}-[\\w]{4}-[\\w]{4}-[\\w]{4}-[\\w]{12}|\\d{5,8})/submit`}
              />
              <Route
                component={routeProps => SubmissionManagement({
                  ...routeProps,
                  challengesUrl: `${base}/challenges`,
                })}
                exact
                path={`${base}/challenges/:challengeId([\\w]{8}-[\\w]{4}-[\\w]{4}-[\\w]{4}-[\\w]{12}|\\d{5,8})/my-submissions`}
              />
              <Route
                render={props => <ProfileStats {...props} meta={meta} />}
                exact
                path={`${base}/members/:handle([\\w\\-\\[\\].{}]{2,15})/details`}
              />
              <Route
                component={TermsDetail}
                exact
                path={`${base}/challenges/terms/detail/:termId`}
              />
              <Route
                component={() => (
                  <Leaderboard
                    HeadBanner={LeaderboardBanner}
                    meta={meta}
                    isTopGear
                  />
                )}
                exact
                path={`${base}/leaderboard`}
              />
              {/*
              <ContentfulRoute
                baseUrl={base}
                id="1VXRAIxJdi6eCeeyKCmicK"
                spaceName="topgear"
              />
              */}
            </Switch>
            <Viewport
              id="2rJCDsGCHTDygyx4dqxlNq"
              baseUrl={base}
              spaceName="topgear"
            />
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
