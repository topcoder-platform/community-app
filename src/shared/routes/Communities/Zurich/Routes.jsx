/**
 * Routing of Wipro Community.
 */

import _ from 'lodash';
import ChallengeDetails from 'routes/ChallengeDetails';
import ChallengeListing from 'routes/Communities/ChallengeListing';
import ChallengeListingBanner from 'components/tc-communities/communities/zurich/ChallengeListingBanner';
import Submission from 'routes/Submission';
import SubmissionManagement from 'routes/SubmissionManagement';
import ProfileStats from 'routes/ProfileStats';
import TermsDetail from 'routes/TermsDetail';
import { connect } from 'react-redux';
import Error404 from 'components/Error404';
import FAQ from 'components/tc-communities/communities/zurich/FAQ';
import Footer from 'components/tc-communities/communities/zurich/Footer';
import Header from 'containers/tc-communities/Header';
import Home from 'containers/tc-communities/zurich/Home';
import Learn from 'components/tc-communities/communities/zurich/Learn';
import ContentfulRoute from 'components/Contentful/Route';
import PT from 'prop-types';
import React from 'react';
import theme from 'components/tc-communities/communities/zurich/theme';
import { ThemeProvider } from 'react-css-super-themr';
import { Route, Switch, Redirect } from 'react-router-dom';
import { config } from 'topcoder-react-utils';
import Viewport from 'components/Contentful/Viewport';

function Zurich({ base, meta, userGroups }) {
  // Only members of `Requestor`|`Approver` gropus
  // should can see catalog with links to connect
  const isRequestorOrApprover = userGroups ? _.intersection(
    _.map(userGroups, 'id'),
    meta.authorizedGroupIdsCatalog,
  ) : [];
  // Visitors not in any zurich group see the custom error page
  // not logged in visitors see the "Public Site"
  // see: https://github.com/topcoder-platform/community-app/issues/1878
  const isAllowedGroupVisitor = userGroups ? _.intersection(
    _.map(userGroups, 'id'),
    meta.authorizedGroupIds,
  ) : [];
  return !isAllowedGroupVisitor.length && userGroups ? (
    <Switch>
      <Route
        component={() => Viewport({
          baseUrl: base,
          id: '64XzS4SHtuYqqkGq8goeyY',
          spaceName: 'zurich',
        })}
        path={`${base}/forbidden`}
      />
      <Redirect
        to={`${base}/forbidden`}
      />
    </Switch>
  ) : (
    // Allowed to see the site based on groups
    <Switch>
      <Route
        component={() => Viewport({
          baseUrl: base,
          id: '64XzS4SHtuYqqkGq8goeyY',
          spaceName: 'zurich',
        })}
        path={`${base}/forbidden`}
      />
      <Route
        component={({ match }) => (
          <ThemeProvider theme={theme}>
            <div>
              <Header
                baseUrl={base}
                pageId={match.params.pageId || 'home'}
                hideJoinNow
                logoutRedirect={config.URL.COMMUNITIES.ZURICH}
              />
              <Switch>
                <Route
                  component={() => ChallengeListing({
                    challengesUrl: `${base}/challenges`,
                    meta,
                    newChallengeDetails: true,
                    ChallengeListingBanner,
                    groupIds: meta.groupIds,
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
                  component={FAQ}
                  exact
                  path={`${base}/faq`}
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
                {
                  isRequestorOrApprover.length ? (
                    // Catalog with connect links
                    <ContentfulRoute
                      baseUrl={base}
                      error404={<Error404 />}
                      id="6UGl6F62ligIKMwGAySSEw"
                      spaceName="zurich"
                    />
                  ) : (
                    // Catalog with competitor links
                    <ContentfulRoute
                      baseUrl={base}
                      error404={<Error404 />}
                      id="40GWKfk1jaGqGMe4qymU0i"
                      spaceName="zurich"
                    />
                  )
                }
                <Route
                  component={Error404}
                  path={`${base}/:any`}
                />
              </Switch>
              <Footer />
            </div>
          </ThemeProvider>
        )}
        path={`${base}/:pageId?`}
      />
    </Switch>
  );
}

Zurich.defaultProps = {
  base: '',
  userGroups: [],
};

Zurich.propTypes = {
  base: PT.string,
  meta: PT.shape().isRequired,
  userGroups: PT.arrayOf(PT.shape()),
};

export default connect(state => ({
  userGroups: state.auth.profile ? state.auth.profile.groups : null,
}))(Zurich);
