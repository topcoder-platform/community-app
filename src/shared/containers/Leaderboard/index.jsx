/**
 * Container component for the leaderboard page
 *
 */

import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import actions from 'actions/leaderboard';
import LeaderboardTable from 'components/Leaderboard/LeaderboardTable';
import Podium from 'components/Leaderboard/Podium';

import './styles.scss';

// The container component
class LeaderboardPageContainer extends React.Component {

  componentDidMount() {
    if (!(this.props.leaderboardData.length || this.props.isLoadingLeaderboard)) {
      this.props.loadLeaderboard();
    }
  }

  render() {
    return (
      <div styleName="Leaderboard">
        <h2 styleName="section-title">Leaderboard</h2>
        <Podium competitors={this.props.leaderboardData.slice(0, 3)} />
        <LeaderboardTable competitors={this.props.leaderboardData.slice(3)} />
      </div>
    );
  }
}

LeaderboardPageContainer.defaultProps = {
  leaderboardData: [],
  isLoadingLeaderboard: false,
};

LeaderboardPageContainer.propTypes = {
  leaderboardData: PT.arrayOf(PT.shape()),
  isLoadingLeaderboard: PT.bool,
  loadLeaderboard: PT.func.isRequired,
};

const mapStateToProps = state => ({
  leaderboardData: state.leaderboard.data || [],
  isLoadingLeaderboard: state.leaderboard.loading,
});

const mapDispatchToProps = dispatch => ({
  loadLeaderboard: () => {
    dispatch(actions.leaderboard.fetchLeaderboardInit());
    dispatch(actions.leaderboard.fetchLeaderboardDone());
  },
});

const LeaderboardContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(LeaderboardPageContainer);

export default LeaderboardContainer;
