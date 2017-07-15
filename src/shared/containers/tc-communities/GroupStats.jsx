/**
 * Container for GroupStats component. It automatically loads and renders stats
 * for the currently loaded TC community.
 */

import PT from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import shortid from 'shortid';

import actions from 'actions/stats';
import cActions from 'actions/challenge-listing';
import GroupStats from 'components/tc-communities/GroupStats';

class GroupStatsContainer extends React.Component {

  /* When container mounts we get / update related stats. */
  componentDidMount() {
    this.props.getCommunityStats(this.props.community, this.props.challenges, this.props.token);
    this.props.getAllActiveChallenges(this.props.token);
  }

  /* When group or auth token is changed we get / update related stats. */
  componentWillReceiveProps(nextProps) {
    if (nextProps.token &&
      (nextProps.token !== this.props.token
        || nextProps.community !== this.props.community
        || nextProps.challenges !== this.props.challenges)) {
      this.props.getCommunityStats(nextProps.community, nextProps.challenges, nextProps.token);
    }

    if (nextProps.token && nextProps.token !== this.props.token) {
      this.props.getAllActiveChallenges(nextProps.token);
    }
  }

  render() {
    return !this.props.loadingChallenges && (
      <GroupStats stats={this.props.stats} />
    );
  }
}

GroupStatsContainer.defaultProps = {
  community: {},
  stats: {},
  token: '',
  challenges: [],
  loadingChallenges: false,
};

GroupStatsContainer.propTypes = {
  getAllActiveChallenges: PT.func.isRequired,
  getCommunityStats: PT.func.isRequired,
  community: PT.shape(),
  stats: PT.shape(),
  token: PT.string,
  challenges: PT.arrayOf(PT.shape()),
  loadingChallenges: PT.bool,
};

function mapDispatchToProps(dispatch) {
  return {
    getCommunityStats: (...args) => dispatch(actions.stats.getCommunityStats(...args)),
    getAllActiveChallenges: (token) => {
      const uuid = shortid();
      dispatch(cActions.challengeListing.getAllActiveChallengesInit(uuid));
      dispatch(cActions.challengeListing.getAllActiveChallengesDone(uuid, token));
    },
  };
}

function mapStateToProps(state) {
  const community = state.tcCommunities.meta;
  const challenges = state.challengeListing.challenges;
  return {
    community,
    challenges,
    loadingChallenges: Boolean(state.challengeListing.loadingActiveChallengesUUID),
    stats: state.stats.communities[community.communityId],
    token: state.auth.tokenV3,
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(GroupStatsContainer);
