/**
 * The top-level routing of the App.
 */

import CommunityLoader from 'containers/tc-communities/Loader';
import ContentfulRoute from 'components/Contentful/Route';
import Content from 'components/Content';
import Footer from 'components/TopcoderFooter';
import Header from 'containers/TopcoderHeader';
import React from 'react';

import {
  Switch, Route, withRouter, Redirect,
} from 'react-router-dom';
import { config } from 'topcoder-react-utils';
import MetaTags from 'components/MetaTags';

import PT from 'prop-types';

import { connect } from 'react-redux';

import socialImage from 'assets/images/social.png';

import Communities from './Communities';
import Examples from './Examples';
import Sandbox from './Sandbox';
import Topcoder from './Topcoder';
import TrackHomePages from './TrackHomePages';
import PolicyPages from './PolicyPages';
import GigsPages from './GigsPages';

import './Topcoder/styles.scss';

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
        {Examples()}
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
        {/* <Route
          component={() => <TrackHomePages base="/track" />}
          path="/track"
        /> */}
        <Redirect
          from="/community/data-science/data-science-tutorials/*"
          to="/community/competitive-programming/tutorials/*"
        />
        <Route
          component={() => <TrackHomePages base="/community" />}
          path="/community/(competitive-programming|data-science|design|development|qa)/how-to-compete"
        />
        <Redirect
          exact
          from="/community/gigs"
          to="/gigs"
        />
        <Route
          component={PolicyPages}
          exact
          path={`${config.POLICY_PAGES_PATH}/:slug?`}
        />
        <Route
          render={() => (
            <div styleName="container">
              <Header />
              <ContentfulRoute
                baseUrl={`${config.GIGS_PAGES_PATH}/roles`}
                id="2UgfR6GJvIO2tmLdo9ITVt"
              />
              <Footer />
            </div>
          )}
          path={`${config.GIGS_PAGES_PATH}/roles`}
        />
        <Route
          component={GigsPages}
          exact
          path={`${config.GIGS_PAGES_PATH}/:id?`}
        />
        <Route
          component={GigsPages}
          exact
          path={`${config.GIGS_PAGES_PATH}/:id/apply`}
        />
        <Route
          render={() => (
            <div styleName="container">
              <Header />
              <ContentfulRoute
                baseUrl={config.START_PAGE_PATH}
                id="vpcfRkUPoTtxXoEIBvCRl"
              />
              <Footer />
            </div>
          )}
          exact
          path={config.START_PAGE_PATH}
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
