/**
 * Container for CommunityStats component. It automatically loads and renders
 * stats for the currently loaded TC community.
 *
 * NOTE: Stats from Redux store can be overriden by providing own stats prop to
 * the container. It is useful for demo mock-ups of UI.
 */

import _ from 'lodash';
import PT from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import shortid from 'shortid';

import { actions, challenge as challengeUtil } from 'topcoder-react-lib';
import CommunityStats from 'components/tc-communities/CommunityStats';

const { BUCKETS } = challengeUtil.buckets;

/* Various time ranges in ms. */
const MIN = 60 * 1000;

class CommunityStatsContainer extends React.Component {
  /* When container mounts we get / update related stats. */
  componentDidMount() {
    const {
      challenges,
      community,
      getAllActiveChallenges,
      getCommunityStats,
      lastUpdateOfActiveChallenges,
      token,
    } = this.props;

    getCommunityStats(community, challenges, token);

    if (Date.now() - lastUpdateOfActiveChallenges > 10 * MIN) {
      getAllActiveChallenges(token);
    }
  }

  /* When group or auth token is changed we get / update related stats. */
  componentWillReceiveProps(nextProps) {
    const {
      challenges,
      community,
      getAllActiveChallenges,
      getCommunityStats,
      token,
      userId,
    } = this.props;

    if (nextProps.token
      && (nextProps.token !== token
        || !_.isEqual(nextProps.community, community)
        || !_.isEqual(nextProps.challenges, challenges))) {
      getCommunityStats(nextProps.community, nextProps.challenges, nextProps.token);
    }

    if (nextProps.userId !== userId) {
      getAllActiveChallenges(nextProps.token);
    }
  }

  render() {
    const {
      filter,
      icons,
      loadingChallenges,
      stats,
      theme,
      titles,
    } = this.props;

    return !loadingChallenges && (
      <CommunityStats
        stats={stats}
        theme={theme}
        titles={titles}
        icons={icons}
        filter={filter}
      />
    );
  }
}

CommunityStatsContainer.defaultProps = {
  community: {},
  stats: {},
  token: '',
  challenges: [],
  loadingChallenges: false,
  theme: {},
  titles: {},
  icons: {},
  filter: null,
  userId: null,
};

CommunityStatsContainer.propTypes = {
  getAllActiveChallenges: PT.func.isRequired,
  getCommunityStats: PT.func.isRequired,
  community: PT.shape(),
  stats: PT.shape(),
  token: PT.string,
  challenges: PT.arrayOf(PT.shape()),
  lastUpdateOfActiveChallenges: PT.number.isRequired,
  loadingChallenges: PT.bool,
  theme: PT.shape(),
  titles: PT.shape(),
  icons: PT.shape(),
  filter: PT.shape(),
  userId: PT.string,
};

function mapDispatchToProps(dispatch) {
  return {
    getCommunityStats: (community, challenges, token) => {
      const uuid = shortid();
      const a = actions.stats;
      dispatch(a.getCommunityStatsInit(community, uuid));
      dispatch(a.getCommunityStatsDone(community, uuid, challenges, token));
    },
    getAllActiveChallenges: (token) => {
      const uuid = shortid();
      dispatch(actions.challengeListing.getAllActiveChallengesInit(uuid));
      dispatch(actions.challengeListing.getAllActiveChallengesDone(uuid, token));
    },
  };
}

function mapStateToProps(state, ownProps) {
  const community = state.tcCommunities.meta.data;
  const { challenges, lastUpdateOfActiveChallenges } = state.challengeListing;
  return {
    community,
    challenges: _.has(challenges, BUCKETS.ALL) ? challenges[BUCKETS.ALL] : [],
    lastUpdateOfActiveChallenges,
    loadingChallenges: Boolean(state.challengeListing.loadingActiveChallengesUUID),
    stats: ownProps.stats || _.get(state.stats.communities[community.communityId], 'data'),
    token: state.auth.tokenV3,
    userId: _.get(state, 'auth.user.userId'),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CommunityStatsContainer);
