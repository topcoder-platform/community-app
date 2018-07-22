/**
 * Container component for the TCO Leaderboard
 *
 */

import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import actions from 'actions/leaderboard';
import LeaderboardTable from 'components/Leaderboard/LeaderboardTable';
import Podium from 'components/Leaderboard/Podium';
import { themr } from 'react-css-super-themr';

import defaultTheme from './styles.scss';

// The container component
class LeaderboardPageContainer extends React.Component {
  componentDidMount() {
    const {
      apiUrl,
      auth,
      isLoadingLeaderboard,
      loadLeaderboard,
      loadedApiUrl,
    } = this.props;
    if (!(apiUrl === loadedApiUrl || isLoadingLeaderboard)) {
      loadLeaderboard(auth, apiUrl);
    }
  }

  render() {
    const {
      leaderboardData, title, podiumSpots, isCopilot,
    } = this.props;
    const ld = leaderboardData || [];
    return (
      <div>
        <div styleName="Leaderboard">
          <h2 styleName="section-title">{title}</h2>
          <Podium competitors={ld.slice(0, podiumSpots)} />
          <LeaderboardTable competitors={ld.slice(podiumSpots)} isCopilot={isCopilot} />
        </div>
      </div>
    );
  }
}

LeaderboardPageContainer.defaultProps = {
  leaderboardData: [],
  isLoadingLeaderboard: false,
  loadedApiUrl: null,
  apiUrl: 'https://api.topcoder.com/v4/looks/1044/run/json',
  auth: null,
  title: 'Leaderboard',
  podiumSpots: 3,
  isCopilot: false,
};

LeaderboardPageContainer.propTypes = {
  leaderboardData: PT.arrayOf(PT.shape()),
  isLoadingLeaderboard: PT.bool,
  loadLeaderboard: PT.func.isRequired,
  loadedApiUrl: PT.string,
  apiUrl: PT.string,
  auth: PT.shape(),
  title: PT.string,
  podiumSpots: PT.number,
  isCopilot: PT.bool,
};

const mapStateToProps = state => ({
  leaderboardData: state.leaderboard.data,
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

export default themr('LeaderboardContainer', defaultTheme)(LeaderboardContainer);
