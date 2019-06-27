/**
 * Groups together all routes related to the main Topcoder website.
 * As we do not use any special prefix for such routes, this group of routes
 * always matches, renders the standard Topcoder header and footer, and the
 * content of the route, or the HTTP 404 page.
 */

import ChallengeDetails from 'routes/ChallengeDetails';
import ContentfulRoute from 'components/Contentful/Route';
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
import Settings from '../Settings';
import HallOfFame from '../HallOfFame';
import Profile from '../Profile';
import Scoreboard from '../tco/scoreboard';
import ProfileStats from '../ProfileStats';
import './styles.scss';

export default function Topcoder() {
  return (
    <div styleName="container">
      <Header />
      <Switch>
        <Route
          component={HallOfFame}
          exact
          path="/community/hall-of-fame/:type/:eventId?"
        />
        <ContentfulRoute
          baseUrl="/"
          error404={(
            <Switch>
              <Route
                component={TermsDetail}
                exact
                path="/challenges/terms/detail/:termId"
              />
              <Route
                component={ChallengeDetails}
                exact
                path="/challenges/:challengeId(\d{8}|\d{5})"
              />
              <Route component={ChallengeListing} exact path="/challenges" />
              <Route component={Dashboard} exact path="/my-dashboard" />
              <Route
                component={ReviewOpportunityDetails}
                exact
                path="/challenges/:challengeId(\d{8}|\d{5})/review-opportunities"
              />
              <Route component={Scoreboard} exact path="/scoreboard/:challengeId(\d+)" />
              <Route
                component={SubmissionManagement}
                exact
                path="/challenges/:challengeId(\d{8}|\d{5})/my-submissions"
              />
              <Route
                component={Submission}
                exact
                path="/challenges/:challengeId(\d{8}|\d{5})/submit"
              />
              <Route
                component={Profile}
                exact
                path="/members/:handle([\w\-\[\].{}]{2,15})"
              />
              <Route
                component={() => <Settings base="/settings" />}
                path="/settings"
              />
              <Route
                component={ProfileStats}
                exact
                path="/members/:handle([\w\-\[\].{}]{2,15})/details"
              />
              <Error404 />
            </Switch>
          )}
          id="2z6DvIzyhKQ0YusYGsaQc6"
        />
      </Switch>
      <Footer />
    </div>
  );
}
