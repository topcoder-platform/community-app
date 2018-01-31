/**
 * Routing of Cognitive Community.
 */

import ChallengeDetails from 'routes/ChallengeDetails';
import ChallengeListing from 'routes/Communities/ChallengeListing';
import config from 'utils/config';
import Error404 from 'components/Error404';
import IbmCloudPage from
  'components/tc-communities/communities/cognitive/IbmCloudPage';
import MetaTags from 'utils/MetaTags';
import Resources from 'containers/tc-communities/cognitive/resources';
import Footer from 'components/tc-communities/Footer2';
import Header from 'containers/tc-communities/Header';
import Home from 'containers/tc-communities/cognitive/home';
import GetStarted from 'components/tc-communities/communities/cognitive/GetStarted';
import PT from 'prop-types';
import React from 'react';
import Submission from 'routes/Submission';
import SubmissionManagement from 'routes/SubmissionManagement';

import socialImage from 'assets/images/communities/cognitive/social.jpg';

import TermsDetail from 'routes/TermsDetail';
import { Route, Switch } from 'react-router-dom';

export default function Cognitive({ base, member, meta }) {
  return (
    <Route
      component={({ match }) => (
        <div>
          <MetaTags
            description="Join the world's premier Cognitive community and get hands-on experience with today's most cutting-edge technologies and business challenges."
            image={socialImage}
            siteName="Topcoder Cognitive Community"
            title="Topcoder Cognitive Community"
            url={config.URL.COMMUNITIES.COGNITIVE}
          />
          <Header
            baseUrl={base}
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
              component={() => <GetStarted baseUrl={base} />}
              exact
              path={`${base}/get-started`}
            />
            <Route
              component={() => <IbmCloudPage baseUrl={base} />}
              exact
              path={`${base}/ibm-cloud`}
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
              component={() => <Resources baseUrl={base} member={member} />}
              exact
              path={`${base}/resources`}
            />
            <Route
              component={() => <Home baseUrl={base} member={member} />}
              exact
              path={`${base}/home`}
            />
            <Route
              component={Error404}
              path={`${base}/:any`}
            />
            <Route
              component={() => <Home baseUrl={base} member={member} />}
              exact
              path={`${base}`}
            />
          </Switch>
          <Footer />
        </div>
      )}
      path={`${base}/:pageId?`}
    />
  );
}

Cognitive.defaultProps = {
  base: '',
};

Cognitive.propTypes = {
  base: PT.string,
  member: PT.bool.isRequired,
  meta: PT.shape().isRequired,
};
