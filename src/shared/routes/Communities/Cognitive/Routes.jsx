/**
 * Routing of Cognitive Community.
 */

import ChallengeDetails from 'routes/ChallengeDetails';
import ChallengeListing from 'routes/Communities/ChallengeListing';
import Error404 from 'components/Error404';
import Resources from 'containers/tc-communities/cognitive/resources';
import Footer from 'components/tc-communities/communities/cognitive/Footer';
import Header from 'containers/tc-communities/Header';
import Home from 'containers/tc-communities/cognitive/home';
import GetStarted from 'components/tc-communities/communities/cognitive/GetStarted';
import PT from 'prop-types';
import React from 'react';
import Submission from 'routes/Submission';
import SubmissionManagement from 'routes/SubmissionManagement';
import { Route, Switch } from 'react-router-dom';

export default function Cognitive({ base, member, meta }) {
  return (
    <Route
      component={({ match }) => (
        <div>
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
