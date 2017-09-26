/**
 * Groups together all routes related to the main Topcoder website.
 * As we do not use any special prefix for such routes, this group of routes
 * always matches, renders the standard Topcoder header and footer, and the
 * content of the route, or the HTTP 404 page.
 */

import Error404 from 'components/Error404';
import Footer from 'components/TopcoderFooter';
import Header from 'containers/TopcoderHeader';

import React from 'react';
import { Route, Switch } from 'react-router-dom';

import ChallengeDetails from 'routes/ChallengeDetails';
import ChallengeListing from './ChallengeListing';
import Dashboard from './Dashboard';
import SubmissionManagement from './SubmissionManagement';
import SubmissionsPage from './SubmissionsPage';

import './styles.scss';

export default function Topcoder() {
  return (
    <div styleName="container">
      <Header />
      <Switch>
        <Route
          component={ChallengeDetails}
          exact
          path="/challenges/:challengeId(\d{8})"
        />
        <Route component={ChallengeListing} exact path="/challenges" />
        <Route component={Dashboard} exact path="/my-dashboard" />
        <Route
          component={SubmissionManagement}
          exact
          path="/challenges/:challengeId(\d{8})/my-submissions"
        />
        <Route
          component={SubmissionsPage}
          exact
          path="/challenges/:challengeId(\d{8})/submit/file"
        />
        <Error404 />
      </Switch>
      <Footer />
    </div>
  );
}
