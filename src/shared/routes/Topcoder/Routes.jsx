/**
 * Groups together all routes related to the main Topcoder website.
 * As we do not use any special prefix for such routes, this group of routes
 * always matches, renders the standard Topcoder header and footer, and the
 * content of the route, or the HTTP 404 page.
 */

import _ from 'lodash';
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
import { config, isomorphy } from 'topcoder-react-utils';
import ContentfulLoader from 'containers/ContentfulLoader';
import LoadingIndicator from 'components/LoadingIndicator';
import Article from 'components/Contentful/Article';
import Viewport from 'components/Contentful/Viewport';

import EDUHome from '../EDUHome';
import EDUTracks from '../EDUTracks';
import EDUSearch from '../EDUSearch';
import ChallengeListing from './ChallengeListing';
import Dashboard from './Dashboard';
import Notifications from './Notifications';
import HallOfFame from '../HallOfFame';
import ProfileBadges from '../ProfileBadges';
import Scoreboard from '../tco/scoreboard';

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
                path="/challenges/:challengeId([\w]{8}-[\w]{4}-[\w]{4}-[\w]{4}-[\w]{12}|\d{5,8})"
              />
              <Route component={ChallengeListing} exact path="/challenges" />
              <Route component={Notifications} exact path="/notifications" />
              <Redirect
                exact
                from="/my-dashboard"
                to="/home"
              />
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
                    path="/members/:handle([\w\-\[\].{} ]{2,15})/badges"
                  />
                )
              }
              <Route
                path="/changelog/"
                component={() => <Viewport preview id={`${config.CONTENTFUL.CHANGELOG_ID}`} />}
              />

              {/* EDU Portal */}
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
                component={(p) => {
                  const { articleTitle } = p.match.params;
                  return (
                    <ContentfulLoader
                      entryQueries={{
                        content_type: 'article',
                        'fields.slug': articleTitle,
                      }}
                      spaceName="EDU"
                      render={(data) => {
                        if (_.isEmpty(data.entries.items)) {
                          // try search by title match
                          // this legacy support should be deprecated when all
                          // Thrive links switched to hypens, someday
                          return (
                            <ContentfulLoader
                              entryQueries={{
                                content_type: 'article',
                                'fields.title[match]': articleTitle,
                              }}
                              spaceName="EDU"
                              render={(dataTitle) => {
                                if (_.isEmpty(dataTitle.entries.items)) return <Error404 />;
                                let id = dataTitle.entries.matches[0].items[0];
                                if (dataTitle.entries.matches[0].total !== 1) {
                                  // more than 1 match. we need to try find best
                                  const mId = _.findKey(
                                    dataTitle.entries.items,
                                    // eslint-disable-next-line max-len
                                    o => o.fields.title.toLocaleLowerCase() === articleTitle.toLocaleLowerCase(),
                                  );
                                  id = mId || id;
                                }
                                const {
                                  externalArticle,
                                  contentUrl,
                                } = dataTitle.entries.items[id].fields;
                                if (externalArticle && contentUrl && isomorphy.isClientSide()) {
                                  window.location.href = contentUrl;
                                  return null;
                                }
                                return (
                                  <Article
                                    id={id}
                                    spaceName="EDU"
                                  />
                                );
                              }}
                              renderPlaceholder={LoadingIndicator}
                            />
                          );
                        }
                        const id = data.entries.matches[0].items[0];
                        const { externalArticle, contentUrl } = data.entries.items[id].fields;
                        if (externalArticle && contentUrl && isomorphy.isClientSide()) {
                          window.location.href = contentUrl;
                          return null;
                        }
                        return (
                          <Article
                            id={id}
                            spaceName="EDU"
                          />
                        );
                      }}
                      renderPlaceholder={LoadingIndicator}
                    />
                  );
                }}
                exact
                path={`${config.TC_EDU_BASE_PATH}${config.TC_EDU_ARTICLES_PATH}/:articleTitle`}
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
