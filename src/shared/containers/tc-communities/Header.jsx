/**
 * Container for Community header.
 */

import _ from 'lodash';
import config from 'utils/config';
import PT from 'prop-types';
import React from 'react';
import actions from 'actions/topcoder_header';
import metaActions from 'actions/tc-communities/meta';
import communityActions from 'actions/tc-communities';
import Header from 'components/tc-communities/Header';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

class HeaderContainer extends React.Component {
  componentWillMount() {
    this.props.getCommunityList(this.props.auth);
  }

  render() {
    const { communityId, communityList } = this.props;
    const communitySelector =
      [{
        label: 'Topcoder Public Community',
        value: '0',
        redirect: config.URL.BASE,
      }].concat(
        communityList.map(({
          communityId: id,
          communityName,
          mainSubdomain,
        },
        i,
        ) => ({
          value: communityId === id ? '-1' : (1 + i).toString(),
          label: communityName,
          redirect: mainSubdomain ? (
            config.URL.BASE.replace('www', mainSubdomain)
          ) : `/community/${id}`,
        }))).sort((a, b) => a.label.localeCompare(b.label));
    return <Header {...this.props} communitySelector={communitySelector} />;
  }
}

HeaderContainer.defaultProps = {
  auth: {},
  communityList: [],
};

HeaderContainer.propTypes = {
  auth: PT.shape(),
  getCommunityList: PT.func.isRequired,
  communityList: PT.arrayOf(PT.shape({
    communityId: PT.string.isRequired,
    communityName: PT.string.isRequired,
  })),
  communityId: PT.string.isRequired,
};

function mapStateToProps(state, ownProps) {
  /* NOTE: Any community-related components are rendered as descendants
   * of Community Loader, which does not render its content until proper
   * meta data are loaded into Redux store. Thus, no need to make any checks
   * of "meta" object here, we can rely it exists and is properly loaded. */
  const meta = state.tcCommunities.meta.data;
  return {
    auth: state.auth,
    activeTrigger: state.topcoderHeader.activeTrigger,
    additionalLogos: meta.additionalLogos,
    baseUrl: ownProps.baseUrl,
    chevronOverAvatar: meta.chevronOverAvatar,
    communityId: meta.communityId,
    communityList: state.tcCommunities.list,
    groupIds: meta.groupIds,
    hideJoinNow: ownProps.hideJoinNow,
    hideSearch: meta.hideSearch,
    isMobileOpen: state.tcCommunities.meta.isMobileOpen,
    logos: meta.logos,
    menuItems: meta.menuItems,
    openedMenu: state.topcoderHeader.openedMenu,
    pageId: ownProps.pageId,
    profile: state.auth.profile,
  };
}

function mapDispatchToProps(dispatch) {
  return _.merge(bindActionCreators(actions.topcoderHeader, dispatch), {
    getCommunityList: auth => dispatch(communityActions.tcCommunity.getList(auth)),
    onMobileToggleClick: () =>
      dispatch(metaActions.tcCommunities.meta.mobileToggle()),
  });
}

export default connect(mapStateToProps, mapDispatchToProps)(HeaderContainer);
