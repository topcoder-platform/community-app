/**
 * Header container component.
 * Loads data and passes it to children component via props.
 * Defines all necessary handlers to pass to the children.
 * It also redirects to 404 page if community is not found by its id.
 */

import _ from 'lodash';
import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';

import actions from 'actions/tc-communities/header';
import { bindActionCreators } from 'redux';
import standardHeaderActions from 'actions/topcoder_header';
import { Redirect } from 'react-router-dom';
import Header from 'components/tc-communities/Header';

// The container component
class HeaderContainer extends React.Component {
  componentDidMount() {
    // load data if data is loaded for other communityId or is not loaded yet
    if (!((this.props.loadedCommunityId === this.props.communityId) || this.props.isLoading)) {
      this.props.loadData(this.props.communityId);
    }

    if (this.props.isMobileOpen) {
      this.props.mobileToggle();
    }
  }

  render() {
    // true, if currently requested community is not found
    const isNotFound = this.props.isCommunityNotFound
      && (this.props.loadedCommunityId === this.props.communityId);

    return (
      isNotFound ? (
        <Redirect to={{ pathname: '/404' }} />
      ) : (
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
        />
      )
    );
  }
}

HeaderContainer.defaultProps = {
  activeTrigger: null,
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

HeaderContainer.propTypes = {
  activeTrigger: PT.shape({}),
  closeMenu: PT.func.isRequired,
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
};

const mapStateToProps = (state, props) => ({
  ...state.topcoderHeader,
  profile: state.auth ? state.auth.profile : null,
  communityId: props.match.params.communityId,
  loadedCommunityId: state.tcCommunities.meta.communityId,
  isLoading: state.tcCommunities.meta.loading,
  menuItems: state.tcCommunities.meta.menuItems,
  logos: state.tcCommunities.meta.logos,
  cssUrl: state.tcCommunities.meta.cssUrl,
  isCommunityNotFound: state.tcCommunities.meta.failed === '404',
  isMobileOpen: state.tcCommunities.meta.isMobileOpen,
});

const mapDispatchToProps = dispatch => _.merge(
  bindActionCreators(standardHeaderActions.topcoderHeader, dispatch), {
    loadData: (communityId) => {
      dispatch(actions.tcCommunities.header.fetchDataInit());
      dispatch(actions.tcCommunities.header.fetchDataDone(communityId));
    },
    mobileToggle: () => {
      dispatch(actions.tcCommunities.header.mobileToggle());
    },
  });

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(HeaderContainer);
