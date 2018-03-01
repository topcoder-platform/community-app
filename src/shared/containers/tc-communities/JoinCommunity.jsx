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
import Terms from 'containers/Terms';
import termsActions from 'actions/terms';
import JoinCommunity, {
  STATE as JOIN_COMMUNITY,
} from 'components/tc-communities/JoinCommunity';
import { connect } from 'react-redux';

const JoinCommunityContainer = (props) => {
  const { token, groupIds, userId, terms, openTermsModal,
    communityId, join, joinCommunityWrapper } = props;

  const hasNotAgreedTerms = terms && terms.length && !_.every(terms, 'agreed');
  const onJoinClick = hasNotAgreedTerms ? openTermsModal : join;

  return (
    <div className={joinCommunityWrapper}>
      <Terms
        entity={{ type: 'community', id: communityId }}
        description="You are seeing these Terms & Conditions because you are going to join a community and you have to respect the terms below in order to be able to be a member."
        register={() => join(token, groupIds[0], userId)}
      />
      <JoinCommunity {...props} join={onJoinClick} />
    </div>
  );
};

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
    const int = _.intersection(
      joinGroupId ? [joinGroupId] : state.tcCommunities.meta.data.groupIds,
      state.auth.profile.groups.map(g => g.id));
    canJoin = !int.length;
  }
  if (state.tcCommunities.hideJoinButton) canJoin = false;

  if (canJoin) canJoin = state.tcCommunities.joinCommunityButton;
  else canJoin = JOIN_COMMUNITY.HIDDEN;

  return {
    communityName: state.tcCommunities.meta.data.communityName,
    communityId: state.tcCommunities.meta.data.communityId,
    groupIds: state.tcCommunities.meta.data.groupIds,
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
  const t = termsActions.terms;
  return {
    hideJoinButton: () => dispatch(a.hideJoinButton()),
    join: (...args) => {
      dispatch(a.joinInit());
      dispatch(a.joinDone(...args));
    },
    resetJoinButton: () => dispatch(a.resetJoinButton()),
    showJoinConfirmModal: () => dispatch(a.showJoinConfirmModal()),
    openTermsModal: () => {
      dispatch(a.resetJoinButton());
      dispatch(t.openTermsModal());
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(JoinCommunityContainer);
