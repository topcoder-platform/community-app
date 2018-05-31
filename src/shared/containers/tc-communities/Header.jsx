/**
 * Container for Community header.
 */

import _ from 'lodash';
import PT from 'prop-types';
import React from 'react';
import shortId from 'shortid';
import actions from 'actions/topcoder_header';
import metaActions from 'actions/tc-communities/meta';
import communityActions from 'actions/tc-communities';
import Header from 'components/tc-communities/Header';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getSubCommunityBaseUrl } from 'utils/tc';
import { config } from 'topcoder-react-utils';

/* Holds one minute in milliseconds. */
const MIN = 60 * 1000;

class HeaderContainer extends React.Component {
  componentDidMount() {
    const {
      auth,
      communityList,
      getCommunityList,
    } = this.props;
    if (!communityList.loadingUuid
    && (Date.now() - communityList.timestamp > 5 * MIN)) {
      getCommunityList(auth);
    }
  }

  render() {
    const { communityId, communityList } = this.props;
    const communitySelector = [{
      label: 'Topcoder Public Community',
      value: '0',
      redirect: config.URL.BASE,
    }];
    communityList.data.forEach((item, index) => {
      if (!item.hidden) {
        const value = communityId === item.communityId
          ? '-1' : (1 + index).toString();
        communitySelector.push({
          value,
          label: item.communityName,
          redirect: getSubCommunityBaseUrl(item),
        });
      }
    });
    communitySelector.sort((a, b) => a.label.localeCompare(b.label));
    return <Header {...this.props} communitySelector={communitySelector} />;
  }
}

HeaderContainer.defaultProps = {
  auth: {},
};

HeaderContainer.propTypes = {
  auth: PT.shape(),
  getCommunityList: PT.func.isRequired,
  communityList: PT.shape({
    data: PT.arrayOf(PT.shape({
      communityId: PT.string.isRequired,
      communityName: PT.string.isRequired,
    })).isRequired,
    loadingUuid: PT.string.isRequired,
    timestamp: PT.number.isRequired,
  }).isRequired,
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
    getCommunityList: (auth) => {
      const uuid = shortId();
      dispatch(communityActions.tcCommunity.getListInit(uuid));
      dispatch(communityActions.tcCommunity.getListDone(uuid, auth));
    },
    onMobileToggleClick: () =>
      dispatch(metaActions.tcCommunities.meta.mobileToggle()),
  });
}

export default connect(mapStateToProps, mapDispatchToProps)(HeaderContainer);
