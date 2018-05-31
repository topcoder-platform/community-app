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

import { actions } from 'topcoder-react-lib';
import cActions from 'actions/challenge-listing';
import CommunityStats from 'components/tc-communities/CommunityStats';

/* Various time ranges in ms. */
const MIN = 60 * 1000;

class CommunityStatsContainer extends React.Component {
  /* When container mounts we get / update related stats. */
  componentDidMount() {
    const {
      lastUpdateOfActiveChallenges,
    } = this.props;

    this.props.getCommunityStats(this.props.community, this.props.challenges, this.props.token);

    if (Date.now() - lastUpdateOfActiveChallenges > 10 * MIN) {
      this.props.getAllActiveChallenges(this.props.token);
    }
  }

  /* When group or auth token is changed we get / update related stats. */
  componentWillReceiveProps(nextProps) {
    if (nextProps.token &&
      (nextProps.token !== this.props.token
        || nextProps.community !== this.props.community
        || nextProps.challenges !== this.props.challenges)) {
      this.props.getCommunityStats(nextProps.community, nextProps.challenges, nextProps.token);
    }

    if (nextProps.userId !== this.props.userId) {
      this.props.getAllActiveChallenges(nextProps.token);
    }
  }

  render() {
    return !this.props.loadingChallenges && (
      <CommunityStats
        stats={this.props.stats}
        theme={this.props.theme}
        titles={this.props.titles}
        icons={this.props.icons}
        filter={this.props.filter}
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
      dispatch(cActions.challengeListing.getAllActiveChallengesInit(uuid));
      dispatch(cActions.challengeListing.getAllActiveChallengesDone(uuid, token));
    },
  };
}

function mapStateToProps(state, ownProps) {
  const community = state.tcCommunities.meta.data;
  const { challenges, lastUpdateOfActiveChallenges } = state.challengeListing;
  return {
    community,
    challenges,
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
