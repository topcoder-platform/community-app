/**
 * The top-level routing of the App.
 */

import Content from 'components/examples/Content';
import React from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';

import PT from 'prop-types';

import TcCommunitiesPage from 'containers/tc-communities/Page';

import { connect } from 'react-redux';

/* TODO: As we move towards production deploy, we should add a guard which
 * will prevent addition of /examples routes into production build. */
import Examples from './examples';

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
    <Switch>
      <Route exact path="/" component={Content} />
      <Route exact path="/examples" component={Content} />
      <Route path="/examples" component={Examples} />
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
