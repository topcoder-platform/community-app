/**
 * Container for TCOLeaderboards.
 */

import TCOLeaderboards from 'components/Dashboard/TCOLeaderboards';
import PT from 'prop-types';
import React from 'react';
import actions from 'actions/tco/leaderboards';
import { connect } from 'react-redux';


class TCOLeaderboardsContainer extends React.Component {
  componentDidMount() {
    const {
      fetchLeaderboards,
      leaderboardsLoading,
      leaderboards,
      trackConfig,
      auth,
    } = this.props;
    if (!leaderboards || (leaderboards.length === 0 && !leaderboardsLoading)) {
      fetchLeaderboards(auth, trackConfig);
    }
  }

  render() {
    const {
      leaderboardsLoading,
      leaderboards,
      itemCount,
    } = this.props;

    return (
      <TCOLeaderboards
        leaderboards={leaderboards}
        leaderboardsLoading={leaderboardsLoading}
        itemCount={itemCount}
      />
    );
  }
}


TCOLeaderboardsContainer.defaultProps = {
  leaderboardsLoading: true,
  leaderboards: null,
  itemCount: 5,
  auth: null,
};

TCOLeaderboardsContainer.propTypes = {
  leaderboards: PT.arrayOf(PT.object),
  leaderboardsLoading: PT.bool,
  fetchLeaderboards: PT.func.isRequired,
  trackConfig: PT.object.isRequired,
  itemCount: PT.number,
  auth: PT.object,
};


function mapStateToProps(state) {
  return {
    leaderboards: state.tcoLeaderboards.leaderboards,
    leaderboardsLoading: state.tcoLeaderboards.loading,
    auth: state.auth,
  };
}

function mapDispatchToProps(dispatch) {
  const a = actions.tcoLeaderboards;
  return {
    fetchLeaderboards: async (auth, trackConfig) => {
      dispatch(a.fetchLeaderboardsInit(trackConfig));
      dispatch(a.fetchLeaderboardsDone(auth, trackConfig));
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TCOLeaderboardsContainer);
