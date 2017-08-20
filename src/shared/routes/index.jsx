/**
 * The top-level routing of the App.
 */

import CommunityLoader from 'containers/tc-communities/Loader';
import Content from 'components/Content';
import React from 'react';

import { Switch, Route, withRouter } from 'react-router-dom';

import PT from 'prop-types';

import TcCommunitiesPage from 'containers/tc-communities/Page';

import { connect } from 'react-redux';

import Examples from './Examples';
import Topcoder from './Topcoder';

function Routes({ subdomains }) {
  let communityId;
  if (subdomains.includes('community-2')) communityId = 'community-2';
  else if (subdomains.includes('demo-expert')) communityId = 'demo-expert';
  else if (subdomains.includes('wipro')
    || subdomains.includes('topgear')) communityId = 'wipro';
  else if (subdomains.includes('taskforce')) communityId = 'taskforce';
  else if (subdomains.includes('qa')) communityId = 'qa';
  else if (subdomains.includes('srmx')) communityId = 'srmx';
  else if (subdomains.includes('tc-prod-dev')) communityId = 'tc-prod-dev';
  else if (subdomains.includes('veterans')) communityId = 'veterans';
  if (communityId) {
    return (
      <div>
        <Route
          component={routeProps => (
            <CommunityLoader
              communityComponent={props => (
                <TcCommunitiesPage {...props} {...routeProps} pageId="home" />
              )}
              communityId={communityId}
            />
          )}
          exact
          path="/"
        />
        <Route
          component={routeProps => (
            <CommunityLoader
              communityComponent={props => (
                <TcCommunitiesPage {...props} {...routeProps} />
              )}
              communityId={communityId}
            />
          )}
          path="/:pageId"
        />
      </div>
    );
  }
  return (
    <Switch>
      <Route exact path="/" component={Content} />
      { Examples() }
      <Route
        component={routeProps => (
          <CommunityLoader
            communityComponent={props => (
              <TcCommunitiesPage {...props} {...routeProps} pageId="home" />
            )}
            communityId={routeProps.match.params.communityId}
          />
        )}
        exact
        path="/community/:communityId"
      />
      <Route
        component={routeProps => (
          <CommunityLoader
            communityComponent={props => (
              <TcCommunitiesPage {...props} {...routeProps} />
            )}
            communityId={routeProps.match.params.communityId}
          />
        )}
        path="/community/:communityId/:pageId"
      />
      <Topcoder />
    </Switch>
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
