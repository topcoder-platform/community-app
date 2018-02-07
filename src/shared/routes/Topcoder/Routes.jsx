/**
 * Groups together all routes related to the main Topcoder website.
 * As we do not use any special prefix for such routes, this group of routes
 * always matches, renders the standard Topcoder header and footer, and the
 * content of the route, or the HTTP 404 page.
 */

import ChallengeDetails from 'routes/ChallengeDetails';
import TermsDetail from 'routes/TermsDetail';
import Error404 from 'components/Error404';
import Footer from 'components/TopcoderFooter';
import Header from 'containers/TopcoderHeader';
import React from 'react';
import ReviewOpportunityDetails from 'routes/ReviewOpportunityDetails';
import Submission from 'routes/Submission';
import SubmissionManagement from 'routes/SubmissionManagement';
import { Route, Switch } from 'react-router-dom';

import ChallengeListing from './ChallengeListing';
import Dashboard from './Dashboard';
import Scoreboard from '../tco/scoreboard';

import './styles.scss';

export default function Topcoder() {
  return (
    <div styleName="container">
      <Header />
      <Switch>
        <Route
          component={TermsDetail}
          exact
          path="/challenges/terms/detail/:termId"
        />
        <Route
          component={ChallengeDetails}
          exact
          path="/challenges/:challengeId(\d{8})"
        />
        <Route component={ChallengeListing} exact path="/challenges" />
        <Route component={Dashboard} exact path="/my-dashboard" />
        <Route
          component={ReviewOpportunityDetails}
          exact
          path="/challenges/:challengeId(\d{8})/review-opportunities"
        />
        <Route component={Scoreboard} exact path="/scoreboard/:challengeId(\d+)" />
        <Route
          component={SubmissionManagement}
          exact
          path="/challenges/:challengeId(\d{8})/my-submissions"
        />
        <Route
          component={Submission}
          exact
          path="/challenges/:challengeId(\d{8})/submit"
        />
        <Error404 />
      </Switch>
      <Footer />
    </div>
  );
}
