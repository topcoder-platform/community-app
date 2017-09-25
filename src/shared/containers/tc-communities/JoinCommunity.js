import _ from 'lodash';
import actions from 'actions/tc-communities';
import JoinCommunity, {
  STATE as JOIN_COMMUNITY,
} from 'components/tc-communities/JoinCommunity';
import { connect } from 'react-redux';
import { isGroupMember } from 'utils/tc';

function mapStateToProps(state, ownProps) {
  /* We show Join Community button when a visitor is not authenticated, or when
   * he is authenticated and not a member of the community group. */
  let canJoin = !state.auth.profile || !state.auth.profile.groups;
  if (!canJoin) {
    canJoin = !isGroupMember(state.tcCommunities.meta.groupId,
      state.auth.profile.groups, state.groups.groups);
  }
  if (state.tcCommunities.hideJoinButton) canJoin = false;

  if (canJoin) canJoin = state.tcCommunities.joinCommunityButton;
  else canJoin = JOIN_COMMUNITY.HIDDEN;

  return {
    communityName: state.tcCommunities.meta.communityName,
    groupId: state.tcCommunities.meta.groupId,
    label: ownProps.label,
    theme: ownProps.theme,
    token: state.auth.tokenV3,
    state: canJoin,
    userId: _.get(state.auth.user, 'userId'),
  };
}

function mapDispatchToProps(dispatch) {
  const a = actions.tcCommunity;
  return {
    hideJoinButton: () => dispatch(a.hideJoinButton()),
    join: (...args) => {
      dispatch(a.joinInit());
      dispatch(a.joinDone(...args));
    },
    resetJoinButton: () => dispatch(a.resetJoinButton()),
    showJoinConfirmModal: () => dispatch(a.showJoinConfirmModal()),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(JoinCommunity);
