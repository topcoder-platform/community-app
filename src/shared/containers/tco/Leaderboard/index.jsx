/**
 * Container component for the TCO Leaderboard
 *
 */

import _ from 'lodash';
import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import actions from 'actions/leaderboard';
import LeaderboardTable from 'components/Leaderboard/LeaderboardTable';
import Podium from 'components/Leaderboard/Podium';
import { themr } from 'react-css-super-themr';
import LoadingIndicator from 'components/LoadingIndicator';
import ChallengeHistoryModalContainer from './ChallengeHistoryModal';

import defaultTheme from './styles.scss';

// The container component
class LeaderboardPageContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      competitor: null,
    };

    this.onUsernameClick = this.onUsernameClick.bind(this);
    this.onChallengeHistoryClose = this.onChallengeHistoryClose.bind(this);
  }

  componentDidMount() {
    const {
      id,
      apiUrl,
      auth,
      isLoadingLeaderboard,
      loadLeaderboard,
      loadedApiUrl,
    } = this.props;
    if (!(apiUrl === loadedApiUrl || isLoadingLeaderboard)) {
      loadLeaderboard(auth, apiUrl, id);
    }
  }

  onUsernameClick(competitor) {
    this.setState({
      competitor,
    });
  }

  onChallengeHistoryClose() {
    const { resetTcoHistoryChallenges } = this.props;
    resetTcoHistoryChallenges();
    this.setState({
      competitor: null,
    });
  }

  render() {
    const {
      leaderboardData, title, podiumSpots, isCopilot, hasChallengeHistory,
      tcoPointsApiUrl, memberLimit, isAlgo, isLoadingLeaderboard,
    } = this.props;
    const { competitor } = this.state;
    let ld = leaderboardData || [];
    if (memberLimit > 0 && ld.length > memberLimit) {
      ld = ld.slice(0, memberLimit);
    }
    const member = _.find(ld, {
      userid: competitor ? competitor.userid : null,
    }) || {};
    return isLoadingLeaderboard
      ? (<LoadingIndicator />) : (
        <div>
          <div styleName="Leaderboard">
            <h2 styleName="section-title">{title}</h2>
            <Podium
              competitors={ld.slice(0, podiumSpots)}
              isCopilot={isCopilot}
              isAlgo={isAlgo}
              onUsernameClick={hasChallengeHistory ? this.onUsernameClick : null}
            />
            <LeaderboardTable
              competitors={ld.slice(podiumSpots)}
              isCopilot={isCopilot}
              isAlgo={isAlgo}
              onUsernameClick={hasChallengeHistory ? this.onUsernameClick : null}
            />
            {
              hasChallengeHistory && competitor ? (
                <ChallengeHistoryModalContainer
                  competitor={competitor}
                  challenges={member.challenges}
                  onCancel={this.onChallengeHistoryClose}
                  dataUrl={tcoPointsApiUrl}
                  isCopilot={isCopilot}
                  isAlgo={isAlgo}
                />
              ) : null
            }
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
  hasChallengeHistory: true,
  tcoPointsApiUrl: null,
  memberLimit: null,
  isAlgo: false,
};

LeaderboardPageContainer.propTypes = {
  id: PT.string.isRequired,
  leaderboardData: PT.arrayOf(PT.shape()),
  isLoadingLeaderboard: PT.bool,
  loadLeaderboard: PT.func.isRequired,
  loadedApiUrl: PT.string,
  apiUrl: PT.string,
  auth: PT.shape(),
  title: PT.string,
  podiumSpots: PT.number,
  isCopilot: PT.bool,
  hasChallengeHistory: PT.bool,
  resetTcoHistoryChallenges: PT.func.isRequired,
  tcoPointsApiUrl: PT.string,
  memberLimit: PT.number,
  isAlgo: PT.bool,
};

function mapStateToProps(state, props) {
  return state.leaderboard[props.id] ? {
    leaderboardData: state.leaderboard[props.id].data,
    isLoadingLeaderboard: state.leaderboard[props.id].loading,
    loadedApiUrl: state.leaderboard[props.id].loadedApiUrl,
    auth: state.auth,
  } : {
    leaderboardData: null,
    isLoadingLeaderboard: false,
    loadedApiUrl: null,
    auth: state.auth,
  };
}

const mapDispatchToProps = dispatch => ({
  loadLeaderboard: (auth, apiUrl, id) => {
    dispatch(actions.leaderboard.fetchLeaderboardInit({ id }));
    dispatch(actions.leaderboard.fetchLeaderboardDone(auth, apiUrl, id));
  },
  resetTcoHistoryChallenges: () => {
    dispatch(actions.leaderboard.resetTcoHistoryChallenges());
  },
});

const LeaderboardContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(LeaderboardPageContainer);

export default themr('LeaderboardContainer', defaultTheme)(LeaderboardContainer);
