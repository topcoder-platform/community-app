/**
 * The top-level routing of the App.
 */

import CommunityLoader from 'containers/tc-communities/Loader';
import Content from 'components/Content';
import React from 'react';

import { Switch, Route, withRouter } from 'react-router-dom';
import { MetaTags } from 'topcoder-react-utils';

import PT from 'prop-types';

import { connect } from 'react-redux';

import socialImage from 'assets/images/social.jpg';

import Communities from './Communities';
import Examples from './Examples';
import Sandbox from './Sandbox';
import Topcoder from './Topcoder';
import TrackHomePages from './TrackHomePages';

function Routes({ communityId }) {
  const metaTags = (
    <MetaTags
      description="Topcoder is a crowdsourcing marketplace that connects businesses with hard-to-find expertise. The Topcoder Community includes more than one million of the world’s top designers, developers, data scientists, and algorithmists. Global enterprises and startups alike use Topcoder to accelerate innovation, solve challenging problems, and tap into specialized skills on demand."
      image={socialImage}
      siteName="Topcoder"
      title="Topcoder"
    />
  );
  if (communityId) {
    return (
      <div>
        {metaTags}
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
      </div>
    );
  }
  return (
    <div>
      {metaTags}
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
          path="/__community__/:communityId"
        />
        <Route
          component={() => <Sandbox base="/sandbox" />}
          path="/sandbox"
        />
        <Route
          component={() => <TrackHomePages base="/track" />}
          path="/track"
        />
        <Route
          component={() => <TrackHomePages base="/community" />}
          exact
          path="/community/(competitive-programming|data-science|design|development)"
        />
        <Route
          component={() => <TrackHomePages base="/community" />}
          exact
          path="/community/(competitive-programming|data-science|design|development)/how-to-compete"
        />
        <Topcoder />
      </Switch>
    </div>
  );
}

Routes.propTypes = {
  communityId: PT.string.isRequired,
};

export default withRouter(connect(state => ({
  communityId: state.subdomainCommunity,
}))(Routes));
