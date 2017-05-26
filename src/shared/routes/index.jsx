/**
 * The top-level routing of the App.
 */

import Content from 'components/examples/Content';
import Error404 from 'components/Error404';
import SubmissionManagement from 'containers/SubmissionManagement';
import ChallengeListing from 'containers/ChallengeListing';
import Leaderboard from 'containers/Leaderboard';
import 'isomorphic-fetch';
import React from 'react';
import { Switch, Route } from 'react-router-dom';
import TopcoderFooter from 'components/TopcoderFooter';
import TopcoderHeader from 'containers/TopcoderHeader';
import CommunityHeader from 'containers/tc-communities/Header';

import TcCommunitiesPage from 'containers/tc-communities/Page';

import { connect } from 'react-redux';

/* TODO: As we move towards production deploy, we should add a guard which
 * will prevent addition of /examples routes into production build. */
import Examples from './examples';

function Routes(/* props */) {
  /*
  if (props.subdomains.indexOf('wipro') >= 0) {
    return (
      <TcCommunitiesPage />
    );
  }
  */

  return (
    <div>
      <Route path="/challenge" component={TopcoderHeader} />
      <Route path="/community-challenge-listing" component={TopcoderHeader} />
      <Route path="/community-page" component={TopcoderHeader} />
      <Route path="/leaderboard" component={TopcoderHeader} />
      <Switch>
        <Route exact path="/" component={Content} />
        <Route exact path="/examples" component={Content} />
        <Route path="/examples" component={Examples} />
        <Route path="/challenge/:challengeId/my-submissions" component={SubmissionManagement} />
        <Route path="/community-challenge-listing/:keyword" component={ChallengeListing} />
        <Route path="/leaderboard" component={Leaderboard} />
        <Route
          component={TcCommunitiesPage}
          path="/community/:communityId/:pageId"
        />
        <Route path="/mock/community/:communityId/:pageId" component={CommunityHeader} />
        <Route component={Error404} />
      </Switch>
      <Route path="/challenge" component={TopcoderFooter} />
      <Route path="/community-challenge-listing" component={TopcoderFooter} />
      <Route path="/community-page" component={TopcoderFooter} />
      <Route path="/leaderboard" component={TopcoderFooter} />
    </div>
  );
}

export default connect(
  state => ({
    subdomains: state.auth.subdomains,
  }),
)(Routes);
