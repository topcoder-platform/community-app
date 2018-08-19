/**
 * Container for JoinCommunity component
 *
 * Additionally adds Terms component which can be shown if community is protected with some terms
 * which user has to agree to join community.
 */
import React from 'react';
import PT from 'prop-types';
import _ from 'lodash';
import actions from 'actions/tc-communities';
import shortId from 'shortid';
import Terms from 'containers/Terms';
import termsActions from 'actions/terms';

import JoinCommunity, { STATE as JOIN_COMMUNITY }
  from 'components/tc-communities/JoinCommunity';
import { connect } from 'react-redux';

class JoinCommunityContainer extends React.Component {
  constructor(props) {
    super(props);
    this.instanceId = shortId();
  }

  render() {
    const {
      token, groupIds, userId, terms, openTermsModal,
      communityId, join, joinCommunityWrapper,
    } = this.props;

    const hasNotAgreedTerms = terms && terms.length && !_.every(terms, 'agreed');
    const onJoinClick = hasNotAgreedTerms
      ? () => openTermsModal(this.instanceId) : join;

    return (
      <div className={joinCommunityWrapper}>
        <Terms
          entity={{ type: 'community', id: communityId }}
          description="You are seeing these Terms & Conditions because you are going to join a community and you have to respect the terms below in order to be able to be a member."
          instanceId={this.instanceId}
          register={() => join(token, groupIds[0], userId)}
        />
        <JoinCommunity {...this.props} join={onJoinClick} />
      </div>
    );
  }
}

JoinCommunityContainer.defaultProps = {
  token: '',
  groupIds: [''],
  joinCommunityWrapper: '',
  userId: '',
  terms: [],
};

JoinCommunityContainer.propTypes = {
  token: PT.string,
  groupIds: PT.arrayOf(PT.string),
  terms: PT.arrayOf(PT.shape()),
  userId: PT.string,
  openTermsModal: PT.func.isRequired,
  communityId: PT.string.isRequired,
  join: PT.func.isRequired,
  joinCommunityWrapper: PT.string,
};

function mapStateToProps(state, ownProps) {
  /* We show Join Community button when a visitor is not authenticated, or when
   * he is authenticated and not a member of the community group. */
  const { joinGroupId } = ownProps;
  let canJoin = !state.auth.profile || !state.auth.profile.groups;
  if (!canJoin) {
    const communityGroupIds = _.get(state, 'tcCommunties.meta.data.groupIds');
    const int = _.intersection(
      joinGroupId ? [joinGroupId] : communityGroupIds,
      state.auth.profile.groups.map(g => g.id),
    );
    canJoin = !int.length;
  }
  if (state.tcCommunities.hideJoinButton) canJoin = false;

  if (canJoin) canJoin = state.tcCommunities.joinCommunityButton;
  else canJoin = JOIN_COMMUNITY.HIDDEN;

  return {
    communityName: _.get(state, 'tcCommunities.meta.data.communityName'),
    communityId: _.get(state, 'tcCommunities.meta.data.communityId'),
    groupIds: _.get(state, 'tcCommunities.meta.data.groupIds'),
    label: ownProps.label,
    theme: ownProps.theme,
    token: state.auth.tokenV3,
    state: canJoin,
    userId: _.get(state.auth.user, 'userId'),
    terms: state.terms.terms,
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
    openTermsModal: (uuid) => {
      dispatch(a.resetJoinButton());
      dispatch(termsActions.terms.openTermsModal(uuid));
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(JoinCommunityContainer);
