/**
 * MMatch leaderboard container
 * Used v5/submissions API to fetch data
 */
import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import MMatchLeaderboard from 'components/MMatchLeaderboard';
import actions from 'actions/mmLeaderboard';
import LoadingIndicator from 'components/LoadingIndicator';

class MMLeaderboard extends React.Component {
  componentDidMount() {
    const {
      getMMLeaderboard,
      challengeId,
      leaderboard,
    } = this.props;
    if (!leaderboard || (!leaderboard.loading && !leaderboard.data)) {
      getMMLeaderboard(challengeId);
    }
  }

  render() {
    const { leaderboard } = this.props;
    return leaderboard && leaderboard.data ? (
      <MMatchLeaderboard
        {...this.props}
      />
    ) : <LoadingIndicator />;
  }
}

MMLeaderboard.propTypes = {
  challengeId: PT.string.isRequired,
  getMMLeaderboard: PT.func.isRequired,
  leaderboard: PT.shape().isRequired,
};

function mapStateToProps(state, ownProps) {
  const { challengeId } = ownProps;
  return {
    leaderboard: state.mmLeaderboard ? state.mmLeaderboard[challengeId] : {},
  };
}

function mapDispatchToProps(dispatch) {
  const a = actions.mmleaderboard;
  return {
    getMMLeaderboard: async (challengeId) => {
      dispatch(a.getMmlInit(challengeId));
      dispatch(a.getMmlDone(challengeId));
    },
  };
}

const Container = connect(
  mapStateToProps,
  mapDispatchToProps,
)(MMLeaderboard);

export default Container;
