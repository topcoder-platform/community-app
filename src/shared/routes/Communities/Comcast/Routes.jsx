/**
 * Routing of Wipro Community.
 */

import ChallengeDetails from 'routes/ChallengeDetails';
import ChallengeListing from 'routes/Communities/ChallengeListing';
import Error404 from 'components/Error404';
import Footer from 'components/TopcoderFooter';
import Header from 'containers/tc-communities/Header';
import PT from 'prop-types';
import React from 'react';
import Submission from 'routes/Submission';
import SubmissionManagement from 'routes/SubmissionManagement';
import TermsDetail from 'routes/TermsDetail';
import ProfileStats from 'routes/ProfileStats';
import theme from 'components/tc-communities/communities/comcast/theme';
import { ThemeProvider } from 'react-css-super-themr';
import { Route, Switch } from 'react-router-dom';
import ContentfulRoute from 'components/Contentful/Route';
import { config } from 'topcoder-react-utils';

export default function CS({ base, meta }) {
  return (
    <Route
      component={({ match }) => (
        <ThemeProvider theme={theme}>
          <div>
            <Header
              baseUrl={base}
              pageId={match.params.pageId || 'home'}
              logoutRedirect={config.URL.COMMUNITIES.COMCAST}
            />
            <Switch>
              <Route
                component={() => ChallengeListing({
                  challengesUrl: `${base}/work`,
                  listingOnly: true,
                  meta,
                  newChallengeDetails: true,
                })}
                exact
                path={`${base}/work`}
              />
              <Route
                component={routeProps => ChallengeDetails({
                  ...routeProps,
                  challengesUrl: `${base}/work`,
                  communityId: meta.communityId,
                })}
                exact
                path={`${base}/work/:challengeId([\\w]{8}-[\\w]{4}-[\\w]{4}-[\\w]{4}-[\\w]{12}|\\d{5,8})`}
              />
              <Route
                component={routeProps => Submission({
                  ...routeProps,
                  challengesUrl: `${base}/work`,
                })}
                exact
                path={`${base}/work/:challengeId([\\w]{8}-[\\w]{4}-[\\w]{4}-[\\w]{4}-[\\w]{12}|\\d{5,8})/submit`}
              />
              <Route
                component={routeProps => SubmissionManagement({
                  ...routeProps,
                  challengesUrl: `${base}/work`,
                })}
                exact
                path={`${base}/work/:challengeId([\\w]{8}-[\\w]{4}-[\\w]{4}-[\\w]{4}-[\\w]{12}|\\d{5,8})/my-submissions`}
              />
              <Route
                component={TermsDetail}
                exact
                path={`${base}/work/terms/detail/:termId`}
              />
              <Route
                render={props => <ProfileStats {...props} meta={meta} />}
                exact
                path={`${base}/members/:handle([\\w\\-\\[\\].{}]{2,15})/details`}
              />
              <ContentfulRoute
                baseUrl={base}
                error404={<Error404 />}
                id="4IwQmbAv9qgW4vEiIHjahD"
                spaceName="comcast"
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

CS.defaultProps = {
  base: '',
};

CS.propTypes = {
  base: PT.string,
  meta: PT.shape().isRequired,
};
