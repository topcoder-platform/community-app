/**
 * Routing of IoT Community.
 */

import ChallengeDetails from 'routes/ChallengeDetails';
import ChallengeListing from 'routes/Communities/ChallengeListing';

import Error404 from 'components/Error404';
import Footer from 'components/tc-communities/Footer2';
import Header from 'containers/tc-communities/Header';
import Home from 'containers/tc-communities/iot/Home';
import GetStarted from 'containers/tc-communities/iot/GetStarted';
import About from 'containers/tc-communities/iot/About';
import Assets from 'containers/tc-communities/iot/Assets';
import AssetDetail from 'containers/tc-communities/iot/AssetDetail';
import PT from 'prop-types';
import React from 'react';
import Submission from 'routes/Submission';
import SubmissionManagement from 'routes/SubmissionManagement';
import TermsDetail from 'routes/TermsDetail';
import ProfileStats from 'routes/ProfileStats';
import { Route, Switch } from 'react-router-dom';
import { ThemeProvider } from 'react-css-super-themr';

import primaryButtonStyle from 'components/buttons/outline/round/open-sans/blue-uppercase.scss';
import secondaryButtonStyle from 'components/buttons/outline/round/open-sans/default.scss';
import sectionStyle from 'components/tc-communities/communities/iot/themes/section.scss';

export default function IoT({ base, meta }) {
  return (
    <Route
      component={({ match }) => (
        <ThemeProvider theme={{
          PrimaryButton: primaryButtonStyle,
          SecondaryButton: secondaryButtonStyle,
          'tcCommunities-Section': sectionStyle,
        }}
        >
          <div>
            <Header
              baseUrl={base}
              hideJoinNow
              pageId={match.params.pageId || 'home'}
            />
            <Switch>
              <Route
                component={() => (
                  <div>
                    {
                      ChallengeListing({
                        challengesUrl: `${base}/challenges`,
                        meta,
                        listingOnly: true,
                        newChallengeDetails: true,
                      })
                   }
                  </div>
                )}
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
                component={TermsDetail}
                exact
                path={`${base}/challenges/terms/detail/:termId`}
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
                component={() => <Home baseUrl={base} />}
                exact
                path={`${base}/home`}
              />
              <Route
                component={() => <GetStarted baseUrl={base} />}
                exact
                path={`${base}/get-started`}
              />
              <Route
                component={() => <About baseUrl={base} />}
                exact
                path={`${base}/about`}
              />
              <Route
                component={() => (
                  <Assets
                    baseUrl={base}
                  />
                )}
                exact
                path={`${base}/assets`}
              />
              <Route
                component={
                  routeProps => (
                    <AssetDetail
                      baseUrl={base}
                      {...routeProps}
                    />
                  )
                }
                exact
                path={`${base}/assets/:assetId`}
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

IoT.defaultProps = {
  base: '',
  meta: {},
};

IoT.propTypes = {
  base: PT.string,
  meta: PT.shape({
    communityId: PT.any,
  }),
};
