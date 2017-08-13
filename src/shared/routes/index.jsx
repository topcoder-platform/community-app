/**
 * The top-level routing of the App.
 */

import _ from 'lodash';
import Content from 'components/examples/Content';
import Error404 from 'components/Error404';
import path from 'path';
import SubmissionManagement from 'containers/SubmissionManagement';
import ChallengeListing from 'containers/challenge-listing/Listing';
// import ChallengeDetail from 'containers/challenge-detail';
import Leaderboard from 'containers/Leaderboard';
import LoadingIndicator from 'components/LoadingIndicator';
// import Dashboard from 'containers/Dashboard';
import 'isomorphic-fetch';
import React from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import TopcoderFooter from 'components/TopcoderFooter';
import TopcoderHeader from 'containers/TopcoderHeader';
import qs from 'qs';

import PT from 'prop-types';

import TcCommunitiesPage from 'containers/tc-communities/Page';

import { connect } from 'react-redux';
import { requireWeak, resolveWeak, SplitRoute } from 'utils/router';

/* TODO: As we move towards production deploy, we should add a guard which
 * will prevent addition of /examples routes into production build. */
import Examples from './examples';

function Routes({ subdomains }) {
  let communityId;
  if (subdomains.includes('demo-expert')) communityId = 'demo-expert';
  else if (subdomains.includes('wipro')
    || subdomains.includes('topgear')) communityId = 'wipro';
  else if (subdomains.includes('taskforce')) communityId = 'taskforce';
  else if (subdomains.includes('qa')) communityId = 'qa';
  else if (subdomains.includes('srmx')) communityId = 'srmx';
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
        <SplitRoute
          chunkName="challenge-details"
          path="/challenges/:challengeId"
          renderClientAsync={props =>
            import(
              /* webpackChunkName: "challenge-details" */
              'containers/challenge-detail',
            ).then(({ default: ChallengeDetail }) => (
              <ChallengeDetail {...props} />
            ))
          }
          renderPlaceholder={() => <LoadingIndicator />}
          /*
          renderServer={(props) => {
            let modulePath = resolveWeak('containers/challenge-detail');
            modulePath = path.resolve(__dirname, modulePath);
            const ChallengeDetail = requireWeak(modulePath);
            return <ChallengeDetail {...props} />;
          }}
          */
        />
        <Route
          path="/challenges"
          render={(props) => {
            const query = props.location.search ?
              qs.parse(props.location.search.slice(1)) : null;
            const currencyFromUrl = _.get(query, 'currency');
            const prizeMode = currencyFromUrl && `money-${currencyFromUrl}`;
            return (
              <ChallengeListing
                {...props}
                listingOnly
                prizeMode={prizeMode}
              />
            );
          }}
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
        <SplitRoute
          chunkName="my-dashboard"
          path="/my-dashboard"
          renderClientAsync={props =>
            import(
              /* webpackChunkName: "my-dashboard" */
              'containers/Dashboard',
            ).then(({ default: Dashboard }) => <Dashboard {...props} />)
          }
          renderPlaceholder={() => <LoadingIndicator />}
          renderServer={(props) => {
            let modulePath = resolveWeak('containers/Dashboard');
            modulePath = path.resolve(__dirname, modulePath);
            const Dashboard = requireWeak(modulePath);
            return <Dashboard {...props} />;
          }}
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
  location: PT.shape({
    search: PT.string.isRequired,
  }).isRequired,
  subdomains: PT.arrayOf(PT.string).isRequired,
};

export default withRouter(connect(state => ({
  subdomains: state.subdomains,
}))(Routes));
