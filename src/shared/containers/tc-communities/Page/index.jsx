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
import WiproAbout from 'components/tc-communities/communities/wipro/About';
import Wipro2Home from 'components/tc-communities/communities/wipro2/Home';
import Wipro2Learn from 'components/tc-communities/communities/wipro2/Learn';

import TopcoderLogo from '../../../../assets/images/logo_topcoder.svg';
import './style.scss';

/* TODO: Bootstrap import should be moved to a more appropriate place, which
 * depends on whether we want it to be available globally, or only in specific
 * communities. */
require('bootstrap/dist/css/bootstrap.min.css');

class Page extends Component {
  componentDidMount() {
    // load data if data is loaded for other communityId or is not loaded yet
    if (!((this.props.loadedCommunityId === this.props.communityId) || this.props.isLoading)) {
      this.props.loadData(this.props.communityId);
    }

    if (this.props.isMobileOpen) {
      this.props.mobileToggle();
    }
  }

 /**
   * Returns custom page content which is created by landing page editor
   *
   * TODO: as editor is not implemented yet, this method returns static
   *       mock pages. It has to be rewritten when landing page editor is available
   */
  renderCustomPage() {
    let pageContent;

    // as for now landing page editor is not implemented yet
    // for Wipro and Wipro 2 communities we return static pages
    // TODO: this have to be removed when editor implemented
    if (this.props.loadedCommunityId === 'wipro') {
      if (this.props.pageId === 'home') {
        pageContent = <WiproHome />;
      } else if (this.props.pageId === 'about') {
        pageContent = <WiproAbout />;
      }
    } else if (this.props.loadedCommunityId === 'wipro2') {
      if (this.props.pageId === 'home') {
        pageContent = <Wipro2Home />;
      } else if (this.props.pageId === 'learn') {
        pageContent = <Wipro2Learn />;
      }
    } else if (this.props.loadedCommunityId.match(/example-theme-\w/)) {
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
    let pageContent = <div />;
    switch (this.props.pageId) {
      case 'leaderboard':
        pageContent = (<Leaderboard
          apiUrl={this.props.leaderboardApiUrl}
        />);
        break;
      case 'challenges':
        pageContent = (<ChallengeListing
          tag={this.props.challengeFilterTag}
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
    const returnUrl = encodeURIComponent(`${config.URL.MEMBER}/community/wipro/home`);
    const loginUrl = `${config.URL.AUTH}?retUrl=${returnUrl}`;
    const registerUrl = `${config.URL.AUTH}/registration`;

    // true, if currently requested community is not found
    const isNotFound = this.props.isCommunityNotFound
      && (this.props.loadedCommunityId === this.props.communityId);

    // true, if is loading now, or if not started loading yet
    const isNotLoaded = this.props.isLoading ||
      (this.props.loadedCommunityId !== this.props.communityId);

    if (this.props.profile) {
      if (isNotFound) {
        return <Redirect to={{ pathname: '/404' }} />;
      } else if (isNotLoaded) {
        return (
          <div styleName="loading">
            <LoadingIndicator />
          </div>
        );
      }
      return (
        <div>
          <Header
            activeTrigger={this.props.activeTrigger}
            closeMenu={this.props.closeMenu}
            logos={this.props.logos}
            profile={this.props.profile}
            menuItems={this.props.menuItems}
            openedMenu={this.props.openedMenu}
            openMenu={this.props.openMenu}
            isMobileOpen={this.props.isMobileOpen}
            communityId={this.props.loadedCommunityId}
            onMobileToggleClick={this.props.mobileToggle}
            cssUrl={this.props.cssUrl}
            registerUrl={registerUrl}
            loginUrl={loginUrl}
          />
          {this.renderPageContent()}
          <Footer
            menuItems={this.props.menuItems}
            communityId={this.props.loadedCommunityId}
            registerUrl={registerUrl}
            loginUrl={loginUrl}
            isAuthorized={!!this.props.profile}
          />
        </div>
      );
    } else if (this.props.authenticating) {
      return (
        <div styleName="auth-check">
          <LoadingIndicator />
        </div>
      );
    }
    return (
      <div styleName="auth-check">
        <TopcoderLogo />
        <div styleName="msg">You must be authenticated to access this page.</div>
        <div styleName="msg">
          <a
            className="btnButton"
            href={`${config.URL.AUTH}?retUrl=${returnUrl}`}
          >Log In Here</a>
        </div>
      </div>
    );
  }
}

Page.defaultProps = {
  activeTrigger: null,
  challengeFilterTag: '',
  leaderboardApiUrl: null,
  authenticating: false,
  isLoading: false,
  menuItems: [],
  openedMenu: null,
  profile: null,
  logos: [],
  loadedCommunityId: null,
  isCommunityNotFound: false,
  isMobileOpen: false,
  cssUrl: null,
};

Page.propTypes = {
  activeTrigger: PT.shape({}),
  closeMenu: PT.func.isRequired,
  challengeFilterTag: PT.string,
  leaderboardApiUrl: PT.string,
  isLoading: PT.bool,
  profile: PT.shape({}),
  menuItems: PT.arrayOf(PT.shape()),
  openedMenu: PT.shape({}),
  openMenu: PT.func.isRequired,
  logos: PT.arrayOf(PT.string),
  loadedCommunityId: PT.string,
  loadData: PT.func.isRequired,
  communityId: PT.string.isRequired,
  isCommunityNotFound: PT.bool,
  isMobileOpen: PT.bool,
  mobileToggle: PT.func.isRequired,
  cssUrl: PT.string,
  authenticating: PT.bool,
  pageId: PT.string.isRequired,
  history: PT.shape().isRequired,
  location: PT.shape().isRequired,
};

const mapStateToProps = (state, props) => ({
  ...state.topcoderHeader,
  challengeFilterTag: state.tcCommunities.meta.challengeFilterTag,
  leaderboardApiUrl: state.tcCommunities.meta.leaderboardApiUrl,
  profile: state.auth ? state.auth.profile : null,
  communityId: props.match.params.communityId,
  loadedCommunityId: state.tcCommunities.meta.communityId,
  isLoading: state.tcCommunities.meta.loading,
  menuItems: state.tcCommunities.meta.menuItems,
  logos: state.tcCommunities.meta.logos,
  cssUrl: state.tcCommunities.meta.cssUrl,
  isCommunityNotFound: state.tcCommunities.meta.failed === '404',
  isMobileOpen: state.tcCommunities.meta.isMobileOpen,
  pageId: props.match.params.pageId,
});

const mapDispatchToProps = dispatch => _.merge(
  bindActionCreators(standardHeaderActions.topcoderHeader, dispatch), {
    loadData: (communityId) => {
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
