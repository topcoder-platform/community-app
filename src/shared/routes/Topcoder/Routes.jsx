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
import { Route, Switch, Redirect } from 'react-router-dom';
import { config } from 'topcoder-react-utils';
import Viewport from 'components/Contentful/Viewport';

import EDUHome from '../EDUHome';
import EDUTracks from '../EDUTracks';
import EDUSearch from '../EDUSearch';
import ChallengeListing from './ChallengeListing';
import EngagementListing from './EngagementListing';
import Dashboard from './Dashboard';
import Notifications from './Notifications';
import HallOfFame from '../HallOfFame';
import ProfileBadges from '../ProfileBadges';
import Scoreboard from '../tco/scoreboard';
import ThriveArticleRoute from './ThriveArticleRoute';

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

        {/* Application-owned routes must not wait for the root CMS lookup. */}
        <Route
          component={TermsDetail}
          exact
          path="/challenges/terms/detail/:termId"
        />
        <Route
          component={ChallengeDetails}
          exact
          path="/challenges/:challengeId([\w]{8}-[\w]{4}-[\w]{4}-[\w]{4}-[\w]{12}|\d{5,8})"
        />
        <Route component={ChallengeListing} exact path="/challenges" />
        <Route component={EngagementListing} exact path="/engagements" />
        <Route component={Notifications} exact path="/notifications" />
        <Redirect exact from="/my-dashboard" to="/home" />
        <Route component={Dashboard} exact path="/home" />
        <Route
          component={ReviewOpportunityDetails}
          exact
          path="/challenges/:challengeId([\w]{8}-[\w]{4}-[\w]{4}-[\w]{4}-[\w]{12}|\d{5,8})/review-opportunities"
        />
        <Route component={Scoreboard} exact path="/scoreboard/:challengeId([\w]{8}-[\w]{4}-[\w]{4}-[\w]{4}-[\w]{12}|\d{5,8})" />
        <Route
          component={SubmissionManagement}
          exact
          path="/challenges/:challengeId([\w]{8}-[\w]{4}-[\w]{4}-[\w]{4}-[\w]{12}|\d{5,8})/my-submissions"
        />
        <Route
          component={Submission}
          exact
          path="/challenges/:challengeId([\w]{8}-[\w]{4}-[\w]{4}-[\w]{4}-[\w]{12}|\d{5,8})/submit"
        />
        {
          config.GAMIFICATION.ENABLE_BADGE_UI && (
            <Route
              component={ProfileBadges}
              exact
              path="/members/:handle([^/]{2,})/badges"
            />
          )
        }
        <Route
          path="/changelog/"
          component={() => <Viewport preview id={`${config.CONTENTFUL.CHANGELOG_ID}`} />}
        />

        {/* Keep Thrive routes ahead of the generic root CMS route as well. */}
        <Route
          component={EDUHome}
          exact
          path={`${config.TC_EDU_BASE_PATH}`}
        />
        <Route
          component={EDUTracks}
          exact
          path={`${config.TC_EDU_BASE_PATH}${config.TC_EDU_TRACKS_PATH}`}
        />
        <Route
          component={EDUSearch}
          exact
          path={`${config.TC_EDU_BASE_PATH}${config.TC_EDU_SEARCH_PATH}`}
        />
        <Route
          component={ThriveArticleRoute}
          exact
          path={`${config.TC_EDU_BASE_PATH}${config.TC_EDU_ARTICLES_PATH}/:articleTitle`}
        />
        <ContentfulRoute
          baseUrl="/"
          error404={<Error404 />}
          id="2z6DvIzyhKQ0YusYGsaQc6"
        />
      </Switch>
      <Footer />
    </div>
  );
}
