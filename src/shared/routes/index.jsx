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
import { getCommunityId } from './subdomains';

function Routes({ subdomains }) {
  const communityId = getCommunityId(subdomains);
  if (communityId) {
    return (
      <CommunityLoader
        communityComponent={({ member, meta }) => (
          <Communities
            communityId={communityId}
            member={member}
            meta={meta}
          />
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
            communityComponent={({ member, meta }) => {
              let base = match.url;
              while (base.endsWith('/')) base = base.slice(0, -1);
              return (
                <Communities
                  base={base}
                  communityId={match.params.communityId}
                  member={member}
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
