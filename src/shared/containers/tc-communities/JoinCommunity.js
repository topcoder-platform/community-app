import _ from 'lodash';
import actions from 'actions/tc-communities';
import JoinCommunity from 'components/tc-communities/JoinCommunity';
import { connect } from 'react-redux';

function mapStateToProps(state) {
  /* We show Join Community button when a visitor is not authenticated, or when
   * he is authenticated and not a member of the community group. */
  let canJoin = (state.auth.profile && state.auth.profile.groups) || [];
  canJoin = !canJoin.find(item =>
    item.id === state.tcCommunities.meta.challengeGroupId);
  if (state.tcCommunities.hideJoinButton) canJoin = false;

  return {
    canJoin,
    communityName: state.tcCommunities.meta.communityName,
    groupId: state.tcCommunities.meta.challengeGroupId,
    joined: state.tcCommunities.joined,
    joining: state.tcCommunities.joining,
    token: state.auth.tokenV3,
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
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(JoinCommunity);
