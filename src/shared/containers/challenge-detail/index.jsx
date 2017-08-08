/**
 * This container component load data into its state, and pass them to children via props.
 * Its should have in its state, and properly manage the showDetails set
 * (thus allowing to show/hide detail panels for different submissions),
 * and it should define all necessary handlers to pass to the children.
 */

import _ from 'lodash';
import LoadingIndicator from 'components/LoadingIndicator';
import ChallengeHeader from 'components/challenge-detail/Header';
import ChallengeDetailsView from 'components/challenge-detail/ChallengeDetailsView';
import Registrants from 'components/challenge-detail/Registrants';
import Submissions from 'components/challenge-detail/Submissions';
import Winners from 'components/challenge-detail/Winners';
import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import challengeActions from 'actions/challenge';
import './styles.scss';

// The container component
class ChallengeDetailPageContainer extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      showDeadlineDetail: false,
      selectedView: 'DETAILS',
    };

    this.onToggleDeadlines = this.onToggleDeadlines.bind(this);
    this.onSelectorClicked = this.onSelectorClicked.bind(this);
  }

  componentDidMount() {
    this.props.loadChallengeDetails(this.props.authTokens, this.props.challengeId);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.tokenV3 !== nextProps.tokenV3) {
      this.props.reloadChallengeDetails(nextProps.authTokens, this.props.challengeId);
    }

    const checkpoints = nextProps.challenge.checkpoints;
    if (checkpoints && checkpoints.length > 0
      && !nextProps.loadingCheckpointResults
      && !nextProps.checkpointResults) {
      this.props.loadCheckpointResults(this.props.authTokens, this.props.challengeId);
    }
    if (nextProps.challenge.status === 'COMPLETED' &&
      !nextProps.loadingResults &&
      !nextProps.results) {
      this.props.loadResults(this.props.authTokens, this.props.challengeId,
        nextProps.challenge.track.toLowerCase());
    }
  }

  onToggleDeadlines(event) {
    event.preventDefault();
    this.setState({
      showDeadlineDetail: !this.state.showDeadlineDetail,
    });
  }

  onSelectorClicked(view) {
    this.setState({
      selectedView: view,
    });
  }

  render() {
    const isEmpty = _.isEmpty(this.props.challenge);
    return (
      <div styleName="outer-container">
        <div styleName="challenge-detail-container">
          {this.props.isLoadingChallenge && <LoadingIndicator />}
          {
            !isEmpty &&
            <ChallengeHeader
              challenge={this.props.challenge}
              challengeId={this.props.challengeId}
              showDeadlineDetail={this.state.showDeadlineDetail}
              onToggleDeadlines={this.onToggleDeadlines}
              onSelectorClicked={this.onSelectorClicked}
              registerForChallenge={() =>
                this.props.registerForChallenge(this.props.authTokens, this.props.challengeId)
              }
              registering={this.props.registering}
              selectedView={this.state.selectedView}
              unregisterFromChallenge={() =>
                this.props.unregisterFromChallenge(this.props.authTokens, this.props.challengeId)
              }
              unregistering={this.props.unregistering}
            />
          }
          {
            !isEmpty && this.state.selectedView === 'DETAILS' &&
            <ChallengeDetailsView
              introduction={this.props.challenge.introduction}
              detailedRequirements={this.props.challenge.detailedRequirements}
            />
          }
          {
            !isEmpty && this.state.selectedView === 'REGISTRANTS' &&
            <Registrants
              registrants={this.props.challenge.registrants}
              isDesign={this.props.challenge.track.toLowerCase() === 'design'}
              winners={this.props.challenge.winners}
              checkpoints={this.props.challenge.checkpoints}
              submissions={this.props.challenge.submissions}
              checkpointResults={this.props.checkpointResults}
              results={this.props.results}
              places={this.props.challenge.prizes.length}
            />
          }
          {
            !isEmpty && this.state.selectedView === 'SUBMISSIONS' &&
            <Submissions
              viewable={this.props.challenge.submissionsViewable === 'true'}
              submissions={this.props.challenge.submissions}
              checkpoints={this.props.challenge.checkpoints}
              isDesign={this.props.challenge.track.toLowerCase() === 'design'}
            />
          }
          {
            !isEmpty && this.state.selectedView === 'WINNERS' &&
            <Winners
              results={this.props.results}
              prizes={this.props.challenge.prizes}
              submissions={this.props.challenge.submissions}
              viewable={this.props.challenge.submissionsViewable === 'true'}
              isDesign={this.props.challenge.track.toLowerCase() === 'design'}
            />
          }
        </div>
      </div>
    );
  }
}

ChallengeDetailPageContainer.defaultProps = {
  tokenV3: null,
  isLoadingChallenge: false,
  loadingCheckpointResults: false,
  checkpointResults: null,
  loadingResults: false,
  results: null,
};

ChallengeDetailPageContainer.propTypes = {
  tokenV3: PT.string,
  challenge: PT.shape().isRequired,
  isLoadingChallenge: PT.bool,
  loadChallengeDetails: PT.func.isRequired,
  authTokens: PT.shape().isRequired,
  challengeId: PT.number.isRequired,
  registerForChallenge: PT.func.isRequired,
  registering: PT.bool.isRequired,
  reloadChallengeDetails: PT.func.isRequired,
  unregisterFromChallenge: PT.func.isRequired,
  unregistering: PT.bool.isRequired,
  loadingCheckpointResults: PT.bool,
  checkpointResults: PT.arrayOf(PT.shape()),
  loadingResults: PT.bool,
  results: PT.arrayOf(PT.shape()),
  loadCheckpointResults: PT.func.isRequired,
  loadResults: PT.func.isRequired,
};

function extractChallengeDetail(v3, v2) {
  let challenge = {};
  if (!_.isEmpty(v3)) {
    challenge = _.clone(v3);
    if (!_.isEmpty(v2)) {
      challenge.numberOfCheckpointsPrizes = v2.numberOfCheckpointsPrizes;
      challenge.introduction = v2.introduction;
      challenge.detailedRequirements = v2.detailedRequirements;
      challenge.topCheckPointPrize = v2.topCheckPointPrize;
      challenge.registrants = v2.registrants;
      challenge.checkpoints = v2.checkpoints;
      challenge.submissions = v2.submissions;
      challenge.submissionsViewable = v2.submissionsViewable;
    }
  } else if (!_.isEmpty(v2)) {
    challenge = {
      id: v2.challengeId,
      status: v2.currentStatus,
      name: v2.challengeName,
      track: v2.challengeCommunity,
      subTrack: v2.challengeType,
      events: v2.event ? [{ eventName: v2.event.shortDescription, eventId: v2.event.id }] : [],
      technologies: v2.technology ? v2.technology.join(', ') : '',
      platforms: v2.platforms ? v2.platforms.join(', ') : '',
      prizes: v2.prize,
      topCheckPointPrize: v2.topCheckPointPrize,
      numberOfCheckpointsPrizes: v2.numberOfCheckpointsPrizes,
      introduction: v2.introduction,
      detailedRequirements: v2.detailedRequirements,
      registrants: v2.registrants,
      checkpoints: v2.checkpoints,
      submissions: v2.submissions,
      submissionsViewable: v2.submissionsViewable,
    };
  }
  return challenge;
}

const mapStateToProps = (state, props) => ({
  challengeId: Number(props.match.params.challengeId),
  challenge: extractChallengeDetail(state.challenge.details, state.challenge.detailsV2),
  isLoadingChallenge: state.challenge.loadingDetails,
  authTokens: state.auth,
  tokenV2: state.auth && state.auth.tokenV2,
  tokenV3: state.auth && state.auth.tokenV3,
  registering: state.challenge.registering,
  unregistering: state.challenge.unregistering,
  checkpointResults: state.challenge.checkpointResults,
  loadingCheckpointResults: state.challenge.loadingCheckpointResults,
  results: state.challenge.results,
  loadingResults: state.challenge.loadingResults,
});

const mapDispatchToProps = (dispatch) => {
  const a = challengeActions.challenge;
  return {
    loadChallengeDetails: (tokens, challengeId) => {
      dispatch(challengeActions.fetchChallengeInit());
      dispatch(challengeActions.fetchChallengeDone(tokens, challengeId));
    },
    registerForChallenge: (auth, challengeId) => {
      dispatch(a.registerInit());
      dispatch(a.registerDone(auth, challengeId));
    },
    reloadChallengeDetails: (tokens, challengeId) => {
      dispatch(challengeActions.fetchChallengeDone(tokens, challengeId));
    },
    unregisterFromChallenge: (auth, challengeId) => {
      dispatch(a.unregisterInit());
      dispatch(a.unregisterDone(auth, challengeId));
    },
    loadCheckpointResults: (auth, challengeId) => {
      dispatch(a.loadCheckpointResultsInit());
      dispatch(a.loadCheckpointResultsDone(auth, challengeId));
    },
    loadResults: (auth, challengeId, type) => {
      dispatch(a.loadResultsInit());
      dispatch(a.loadResultsDone(auth, challengeId, type));
    },
  };
};

const ChallengeDetailContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ChallengeDetailPageContainer);

export default ChallengeDetailContainer;
