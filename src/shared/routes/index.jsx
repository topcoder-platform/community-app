/**
 * The top-level routing of the App.
 */

import Content from 'components/examples/Content';
import Error404 from 'components/Error404';
import SubmissionManagement from 'containers/SubmissionManagement';
import ChallengeListing from 'containers/challenge-listing/Listing';
import Leaderboard from 'containers/Leaderboard';
import Dashboard from 'containers/Dashboard';
import 'isomorphic-fetch';
import React from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import TopcoderFooter from 'components/TopcoderFooter';
import TopcoderHeader from 'containers/TopcoderHeader';

import PT from 'prop-types';

import TcCommunitiesPage from 'containers/tc-communities/Page';

import { connect } from 'react-redux';

/* TODO: As we move towards production deploy, we should add a guard which
 * will prevent addition of /examples routes into production build. */
import Examples from './examples';

function Routes({ subdomains }) {
  let communityId;
  if (subdomains.includes('demo-expert')) communityId = 'demo-expert';
  else if (subdomains.includes('wipro')
    || subdomains.includes('topgear')) communityId = 'wipro';
  else if (subdomains.includes('taskforce')) communityId = 'taskforce';
  else if (subdomains.includes('tc-prod-dev')) communityId = 'tc-prod-dev';
  else if (subdomains.includes('community-2')) communityId = 'community-2';
  if (communityId) {
    return (
      <div>
        <Route
          exact
          path="/"
          render={props => (
            <TcCommunitiesPage
              communityId={communityId}
              pageId="home"
              {...props}
            />
          )}
        />
        <Route
          path="/:pageId"
          render={props => (
            <TcCommunitiesPage
              communityId={communityId}
              {...props}
            />
          )}
        />
      </div>
    );
  }
  return (
    <div>
      <Route path="/challenge" component={TopcoderHeader} />
      <Route path="/community-challenge-listing" component={TopcoderHeader} />
      <Route path="/community-page" component={TopcoderHeader} />
      <Route path="/leaderboard" component={TopcoderHeader} />
      <Route path="/challenges" component={TopcoderHeader} />
      <Route path="/my-dashboard" component={TopcoderHeader} />
      <Switch>
        <Route exact path="/" component={Content} />
        <Route exact path="/examples" component={Content} />
        <Route path="/examples" component={Examples} />
        <Route path="/challenges/:challengeId/my-submissions" component={SubmissionManagement} />
        <Route
          path="/community-challenge-listing/:keyword"
          render={props => <ChallengeListing listingOnly {...props} />}
        />
        <Route
          path="/challenges"
          render={props => <ChallengeListing listingOnly {...props} />}
        />
        <Route path="/leaderboard" component={Leaderboard} />
        <Route
          exact
          path="/community/:communityId"
          render={props => (
            <TcCommunitiesPage
              pageId="home"
              {...props}
            />
          )}
        />
        <Route
          component={TcCommunitiesPage}
          path="/community/:communityId/:pageId"
        />
        <Route
          component={Dashboard}
          path="/my-dashboard"
        />
        <Route component={Error404} />
      </Switch>
      <Route path="/challenge" component={TopcoderFooter} />
      <Route path="/community-challenge-listing" component={TopcoderFooter} />
      <Route path="/community-page" component={TopcoderFooter} />
      <Route path="/leaderboard" component={TopcoderFooter} />
      <Route path="/challenges" component={TopcoderFooter} />
      <Route path="/my-dashboard" component={TopcoderFooter} />
    </div>
  );
}

Routes.propTypes = {
  subdomains: PT.arrayOf(PT.string).isRequired,
};

export default withRouter(connect(state => ({
  subdomains: state.subdomains,
}))(Routes));
