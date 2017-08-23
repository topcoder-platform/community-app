/**
 * Container for Community header.
 */

import _ from 'lodash';
import actions from 'actions/topcoder_header';
import Header from 'components/tc-communities/Header';
import metaActions from 'actions/tc-communities/meta';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

function mapStateToProps(state, ownProps) {
  /* NOTE: Any community-related components are rendered as descendants
   * of Community Loader, which does not render its content until proper
   * meta data are loaded into Redux store. Thus, no need to make any checks
   * of "meta" object here, we can rely it exists and is properly loaded. */
  const meta = state.tcCommunities.meta;
  return {
    activeTrigger: state.topcoderHeader.activeTrigger,
    additionalLogos: meta.additionalLogos,
    chevronOverAvatar: meta.chevronOverAvatar,
    communityId: meta.communityId,
    communitySelector: meta.communitySelector,
    hideSearch: meta.hideSearch,
    isMobileOpen: meta.isMobileOpen,
    logos: meta.logos,
    menuItems: meta.menuItems,
    openedMenu: state.topcoderHeader.openedMenu,
    pageId: ownProps.pageId,
    profile: state.auth.profile,
  };
}

function mapDispatchToProps(dispatch) {
  return _.merge(bindActionCreators(actions.topcoderHeader, dispatch), {
    onMobileToggleClick: () =>
      dispatch(metaActions.tcCommunities.meta.mobileToggle()),
  });
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);
