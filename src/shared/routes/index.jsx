/**
 * The top-level routing of the App.
 */

import CommunityLoader from 'containers/tc-communities/Loader';
import Content from 'components/Content';
import React from 'react';

import { Switch, Route, withRouter } from 'react-router-dom';

import PT from 'prop-types';

import { connect } from 'react-redux';

import Communities from './Communities';
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
      <CommunityLoader
        communityComponent={({ meta }) => (
          <Communities communityId={communityId} meta={meta} />
        )}
        communityId={communityId}
      />
    );
  }
  return (
    <Switch>
      <Route exact path="/" component={Content} />
      { Examples() }
      <Route
        render={({ match }) => (
          <CommunityLoader
            communityComponent={({ meta }) => {
              let base = match.url;
              while (base.endsWith('/')) base = base.slice(0, -1);
              return (
                <Communities
                  base={base}
                  communityId={match.params.communityId}
                  meta={meta}
                />
              );
            }}
            communityId={match.params.communityId}
          />
        )}
        path="/community/:communityId"
      />
      <Topcoder />
    </Switch>
  );
}

Routes.propTypes = {
  subdomains: PT.arrayOf(PT.string).isRequired,
};

export default withRouter(connect(state => ({
  subdomains: state.subdomains,
}))(Routes));
