/**
 * Routing of Wipro Community.
 */

import Catalog from 'components/tc-communities/communities/zurich/Catalog';
import ChallengeDetails from 'routes/ChallengeDetails';
import ChallengeListing from 'routes/Communities/ChallengeListing';
import ChallengeListingBanner from 'components/tc-communities/communities/zurich/ChallengeListingBanner';
import Error404 from 'components/Error404';
import FAQ from 'components/tc-communities/communities/zurich/FAQ';
import Footer from 'components/tc-communities/communities/zurich/Footer';
import Header from 'containers/tc-communities/Header';
import Home from 'containers/tc-communities/zurich/Home';
import Learn from 'components/tc-communities/communities/zurich/Learn';
import ContentfulRoute from 'components/Contentful/Route';
import PT from 'prop-types';
import React from 'react';
import Submission from 'routes/Submission';
import SubmissionManagement from 'routes/SubmissionManagement';
import TermsDetail from 'routes/TermsDetail';
import theme from 'components/tc-communities/communities/zurich/theme';
import { ThemeProvider } from 'react-css-super-themr';
import { Route, Switch } from 'react-router-dom';

import Leaderboard from '../Leaderboard';

export default function Zurich({ base, meta }) {
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
                  listingOnly: true,
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
                path={`${base}/challenges/:challengeId(\\d{8})`}
              />
              <Route
                component={Catalog}
                exact
                path={`${base}/catalog`}
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
              <ContentfulRoute
                baseUrl={base}
                id="67BVaSm4CcSoSkA2QOAGuM"
                spaceName="zurich"
              />
              <Route
                component={Error404}
                path={`${base}/:any`}
              />
              <Route
                component={Home}
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

Zurich.defaultProps = {
  base: '',
};

Zurich.propTypes = {
  base: PT.string,
  meta: PT.shape().isRequired,
};
