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
    if (!(this.props.apiUrl === this.props.loadedApiUrl || this.props.isLoadingLeaderboard)) {
      this.props.loadLeaderboard(this.props.auth, this.props.apiUrl);
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
  loadedApiUrl: null,
  // this default url is used for demo page only
  // TODO: make it null, when we don't need a demo page
  apiUrl: 'http://www.mocky.io/v2/59098e60100000b60747c10b',
  auth: null,
};

LeaderboardPageContainer.propTypes = {
  leaderboardData: PT.arrayOf(PT.shape()),
  isLoadingLeaderboard: PT.bool,
  loadLeaderboard: PT.func.isRequired,
  loadedApiUrl: PT.string,
  apiUrl: PT.string,
  auth: PT.shape(),
};

const mapStateToProps = state => ({
  leaderboardData: state.leaderboard.data || [],
  isLoadingLeaderboard: state.leaderboard.loading,
  loadedApiUrl: state.leaderboard.loadedApiUrl,
  auth: state.auth,
});

const mapDispatchToProps = dispatch => ({
  loadLeaderboard: (auth, apiUrl) => {
    dispatch(actions.leaderboard.fetchLeaderboardInit());
    dispatch(actions.leaderboard.fetchLeaderboardDone(auth, apiUrl));
  },
});

const LeaderboardContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(LeaderboardPageContainer);

export default LeaderboardContainer;
