/**
 * Routing of Blockchain Community.
 */

/* TODO: This assembly of custom challenge listing page should be split out into
 * a separate component. But, it is good enough for now. */
import BsicHackathon from 'components/tc-communities/communities/blockchain/BsicHackathon';
import ChallengeListingTopBanner from
  'components/tc-communities/communities/blockchain/ChallengeListing/TopBanner';
import ChallengeListingRegisterToSee from
  'components/tc-communities/communities/blockchain/ChallengeListing/RegisterToSee';
import ChallengeDetails from 'routes/ChallengeDetails';
import ChallengeListing from 'routes/Communities/ChallengeListing';
import Error404 from 'components/Error404';
import Footer from 'components/tc-communities/Footer2';
import Header from 'containers/tc-communities/Header';
import Home from 'containers/tc-communities/blockchain/Home';
import Learn from 'containers/tc-communities/blockchain/Learn';
import PT from 'prop-types';
import React from 'react';
import Submission from 'routes/Submission';
import SubmissionManagement from 'routes/SubmissionManagement';
import TermsDetail from 'routes/TermsDetail';
import { Route, Switch } from 'react-router-dom';
import { ThemeProvider } from 'react-css-super-themr';
import { config, MetaTags } from 'topcoder-react-utils';

import primaryButtonStyle from 'components/buttons/outline/round/open-sans/green-uppercase.scss';
import secondaryButtonStyle from 'components/buttons/outline/round/open-sans/blue-uppercase.scss';

import socialImage from 'assets/images/communities/blockchain/social.jpg';

import Leaderboard from '../Leaderboard';

export default function Blockchain({ base, member, meta }) {
  return (
    <Route
      component={({ match }) => (
        <ThemeProvider theme={{
          PrimaryButton: primaryButtonStyle,
          SecondaryButton: secondaryButtonStyle,
        }}
        >
          <div>
            <MetaTags
              description="Learn about and build the next great decentralized application (DApp) on Ethereum platform"
              image={socialImage}
              siteName="Topcoder Blockchain Community"
              title="Topcoder Blockchain Community"
              url={config.URL.COMMUNITIES.BLOCKCHAIN}
            />
            <Header
              baseUrl={base}
              hideJoinNow
              pageId={match.params.pageId || 'home'}
            />
            <Switch>
              <Route
                component={BsicHackathon}
                exact
                path={`${base}/bsic-hackathon`}
              />
              <Route
                component={BsicHackathon}
                exact
                path={`${base}/bsic-incubator`}
              />
              <Route
                component={() => (
                  <div>
                    <ChallengeListingTopBanner />
                    { member ? (
                      ChallengeListing({
                        challengesUrl: `${base}/challenges`,
                        meta,
                        listingOnly: true,
                        newChallengeDetails: true,
                      })
                    ) : <ChallengeListingRegisterToSee /> }
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
                path={`${base}/challenges/:challengeId(\\d{8}|\\d{5})/my-submissions`}
              />
              <Route
                component={() => <Leaderboard meta={meta} />}
                exact
                path={`${base}/leaderboard`}
              />
              <Route
                component={() => <Learn baseUrl={base} />}
                exact
                path={`${base}/learn`}
              />
              <Route
                component={Home}
                exact
                path={`${base}/home`}
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

Blockchain.defaultProps = {
  base: '',
};

Blockchain.propTypes = {
  base: PT.string,
  member: PT.bool.isRequired,
  meta: PT.shape().isRequired,
};
