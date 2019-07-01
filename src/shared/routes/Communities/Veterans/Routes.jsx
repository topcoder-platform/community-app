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
import PreListingMsg from 'components/tc-communities/communities/veterans/PreListingMsg';
import Learn from 'components/tc-communities/communities/veterans/Learn';
import PT from 'prop-types';
import React from 'react';
import Submission from 'routes/Submission';
import SubmissionManagement from 'routes/SubmissionManagement';
import TermsDetail from 'routes/TermsDetail';
import { ThemeProvider } from 'react-css-super-themr';
import { Route, Switch } from 'react-router-dom';
import { challenge as challengeUtil } from 'topcoder-react-lib';
import Leaderboard from '../Leaderboard';

const { BUCKETS, registerBucket } = challengeUtil.buckets;
const { SORTS } = challengeUtil.sort;

export default function Veterans({ base, member, meta }) {
  const ID = 'ACTIVE_VETERANS_CHALLENGES';
  if (!BUCKETS[ID]) {
    registerBucket(ID, {
      filter: {
        ...meta.challengeFilter,
        status: 'ACTIVE',
      },
      hideCount: false,
      name: 'Active Veterans Challenges',
      sorts: [
        SORTS.MOST_RECENT,
        SORTS.TIME_TO_SUBMIT,
        SORTS.NUM_REGISTRANTS,
        SORTS.NUM_SUBMISSIONS,
        SORTS.PRIZE_HIGH_TO_LOW,
        SORTS.TITLE_A_TO_Z,
      ],
    });
  }

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
                  extraBucket: member ? ID : null,
                  hideSrm: true,
                  listingOnly: true,
                  preListingMsg: member ? null : <PreListingMsg />,
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

Veterans.defaultProps = {
  base: '',
};

Veterans.propTypes = {
  base: PT.string,
  member: PT.bool.isRequired,
  meta: PT.shape().isRequired,
};
