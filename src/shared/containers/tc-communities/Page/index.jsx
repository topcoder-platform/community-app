/**
 * A generic Topcoder Community page, which contains header, footer and content.
 *
 * It shows authentication request if user is not authorized.
 * It redirects to 404 page if community is not found by its id.

 * It renders community page content depend on the pageId
 * There are two kind of pages:
 *    - typical pages like leaderboard and challenges which has same relative url
 *      for all communities, these are kind of reserved pageId
 *    - also there could be pages created by a landing page editor with arbitrary pageId
 *      renderCustomPage() method has to return a page made in the editor
 * It redirects to 404 page if content cannot be rendered by its pageId.
 */

import _ from 'lodash';
import config from 'utils/config';
import PT from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import actions from 'actions/tc-communities/meta';
import { bindActionCreators } from 'redux';
import standardHeaderActions from 'actions/topcoder_header';
import Header from 'components/tc-communities/Header';
import Footer from 'components/tc-communities/Footer';
import LoadingIndicator from 'components/LoadingIndicator';

// page content components
import ChallengeListing from 'containers/ChallengeListing';
import Leaderboard from 'containers/Leaderboard';
import WiproHome from 'components/tc-communities/communities/wipro/Home';
import WiproLearn from 'components/tc-communities/communities/wipro/Learn';

import AccessDenied, {
  CAUSE as ACCESS_DENIED_CAUSE,
} from 'components/tc-communities/AccessDenied';

import './style.scss';

class Page extends Component {

  componentDidMount() {
    const communityId = this.props.communityId;
    if ((communityId !== this.props.meta.communityId)
    && !this.props.meta.loading) this.props.loadMetaData(communityId);

    if (this.props.meta.isMobileOpen) this.props.mobileToggle();
  }

  /**
   * Returns custom page content which is created by landing page editor
   *
   * TODO: as editor is not implemented yet, this method returns static
   *       mock pages. It has to be rewritten when landing page editor is available
   */
  renderCustomPage() {
    let pageContent;
    const communityId = this.props.meta.communityId;
    const pageId = this.props.pageId;

    // as for now landing page editor is not implemented yet
    // for Wipro and Wipro 2 communities we return static pages
    // TODO: this have to be removed when editor implemented
    if (communityId === 'wipro') {
      if (pageId === 'home') {
        pageContent = <WiproHome />;
      } else if (pageId === 'learn') {
        pageContent = <WiproLearn />;
      }
    } else if (communityId.match(/example-theme-\w/)) {
      pageContent = <div />;
    }

    // if page it not found redirect to 404
    if (!pageContent) {
      pageContent = <Redirect to={{ pathname: '/404' }} />;
    }

    return pageContent;
  }

  /**
   * Returns community page content depend on the pageId
   * There are two kind of pages:
   *   - typical pages like leaderboard and challenges which has same relative url
   *     for all challenges, these are kind of reserved pageId
   *   - also there could be pages created by a landing page editor with arbitrary pageId
   *     renderCustomPage() method has to return a page made in the editor
   */
  renderPageContent() {
    const pageId = this.props.pageId;
    let pageContent = <div />;
    switch (pageId) {
      case 'leaderboard':
        pageContent = (<Leaderboard
          apiUrl={this.props.meta.leaderboardApiUrl}
        />);
        break;
      case 'challenges':
        pageContent = (<ChallengeListing
          challengeGroupId={this.props.meta.challengeGroupId}
          tag={this.props.meta.challengeFilterTag}
          history={this.props.history}
          location={this.props.location}
        />);
        break;
      default:
        pageContent = this.renderCustomPage();
        break;
    }

    return pageContent;
  }

  render() {
    const returnUrl = encodeURIComponent(`${config.URL.WIPRO}/community/wipro/home`);
    const loginUrl = `${config.URL.AUTH}?retUrl=${returnUrl}`;
    const registerUrl = `${config.URL.AUTH}/registration`;

    const communityId = this.props.communityId;

    // true, if is loading now, or if not started loading yet
    const isNotLoaded = communityId !== this.props.meta.communityId;

    if (this.props.profile && !isNotLoaded) {
      const userGroupIds = this.props.profile.groups.map(item => item.id);
      if (_.intersection(userGroupIds, this.props.meta.authorizedGroupIds || []).length) {
        return (
          <div>
            <Header
              activeTrigger={this.props.activeTrigger}
              closeMenu={this.props.closeMenu}
              logos={this.props.meta.logos}
              pageId={this.props.pageId}
              profile={this.props.profile}
              menuItems={this.props.meta.menuItems}
              openedMenu={this.props.openedMenu}
              openMenu={this.props.openMenu}
              isMobileOpen={this.props.meta.isMobileOpen}
              communityId={communityId}
              onMobileToggleClick={this.props.mobileToggle}
              cssUrl={this.props.meta.cssUrl}
              registerUrl={registerUrl}
              loginUrl={loginUrl}
            />
            {this.renderPageContent()}
            <Footer
              menuItems={this.props.meta.menuItems}
              communityId={communityId}
              registerUrl={registerUrl}
              loginUrl={loginUrl}
              isAuthorized={!!this.props.profile}
            />
          </div>
        );
      }
      return <AccessDenied cause={ACCESS_DENIED_CAUSE.NOT_AUTHORIZED} />;
    } else if (this.props.authenticating || isNotLoaded) {
      return (
        <div styleName="loading">
          <LoadingIndicator />
        </div>
      );
    }
    return <AccessDenied cause={ACCESS_DENIED_CAUSE.NOT_AUTHENTICATED} />;
  }
}

Page.defaultProps = {
  activeTrigger: null,
  openedMenu: null,
  profile: null,
  isMobileOpen: false,
};

Page.propTypes = {
  authenticating: PT.bool.isRequired,
  activeTrigger: PT.shape({}),
  closeMenu: PT.func.isRequired,
  communityId: PT.string.isRequired,
  profile: PT.shape({
    groups: PT.arrayOf(PT.shape({
      id: PT.string.isRequired,
    })),
  }),
  meta: PT.shape({
    authorizedGroupIds: PT.arrayOf(PT.string),
    challengeFilterTag: PT.string,
    challengeGroupId: PT.string,
    communityId: PT.string,
    cssUrl: PT.string,

    // TODO: isMobileOpen does not belong to community meta data, should be
    // moved to a proper place!
    isMobileOpen: PT.bool,

    leaderboardApiUrl: PT.string,
    loading: PT.bool,
    logos: PT.arrayOf(PT.string).isRequired,
    menuItems: PT.arrayOf(PT.shape({})).isRequired,
  }).isRequired,
  openedMenu: PT.shape({}),
  openMenu: PT.func.isRequired,
  loadMetaData: PT.func.isRequired,
  mobileToggle: PT.func.isRequired,
  pageId: PT.string.isRequired,
  history: PT.shape().isRequired,
  location: PT.shape().isRequired,
};

const mapStateToProps = (state, props) => ({
  ...state.auth,
  ...state.topcoderHeader,
  meta: state.tcCommunities.meta,
  profile: state.auth ? state.auth.profile : null,
  communityId: props.communityId || props.match.params.communityId,
  pageId: props.pageId || props.match.params.pageId,
});

const mapDispatchToProps = dispatch => _.merge(
  bindActionCreators(standardHeaderActions.topcoderHeader, dispatch), {
    loadMetaData: (communityId) => {
      dispatch(actions.tcCommunities.meta.fetchDataInit());
      dispatch(actions.tcCommunities.meta.fetchDataDone(communityId));
    },
    mobileToggle: () => {
      dispatch(actions.tcCommunities.meta.mobileToggle());
    },
  });

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Page);
