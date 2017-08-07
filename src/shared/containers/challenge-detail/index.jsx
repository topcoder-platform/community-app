/**
 * This container component load data into its state, and pass them to children via props.
 * Its should have in its state, and properly manage the showDetails set
 * (thus allowing to show/hide detail panels for different submissions),
 * and it should define all necessary handlers to pass to the children.
 */

import _ from 'lodash';
import LoadingIndicator from 'components/LoadingIndicator';
import ChallengeHeader from 'components/challenge-detail/Header';
import ChallengeDetailsView from 'components/challenge-detail/Specification';
import ChallengeCheckpoints from 'components/challenge-detail/Checkpoints';
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
              checkpoints={this.props.checkpoints}
            />
          }
          {
            !isEmpty && this.state.selectedView === 'DETAILS' &&
            <ChallengeDetailsView
              challenge={this.props.challenge}
              introduction={this.props.challenge.introduction}
              detailedRequirements={this.props.challenge.detailedRequirements}
            />
          }
          {
            !isEmpty && this.state.selectedView === 'CHECKPOINTS' &&
            <ChallengeCheckpoints checkpoints={this.props.checkpoints} />
          }
        </div>
      </div>
    );
  }
}

ChallengeDetailPageContainer.defaultProps = {
  tokenV3: null,
  isLoadingChallenge: false,
  checkpoints: {},
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
  checkpoints: PT.shape(),
};

function extractChallengeDetail(v3, v2, challengeId) {
  let challenge = {};
  if (!_.isEmpty(v3)) {
    challenge = _.clone(v3);
    if (!_.isEmpty(v2)) {
      challenge.numberOfCheckpointsPrizes = v2.numberOfCheckpointsPrizes;
      challenge.introduction = v2.introduction;
      challenge.detailedRequirements = v2.detailedRequirements;
      challenge.topCheckPointPrize = v2.topCheckPointPrize;
      if (v2.event) {
        challenge.mainEvent = {
          eventName: v2.event.shortDescription,
          eventId: v2.event.id,
          description: v2.event.description,
        };
      }
      challenge.forumLink = v2.forumLink;
      challenge.screeningScorecardId = Number(v2.screeningScorecardId);
      challenge.reviewScorecardId = Number(v2.reviewScorecardId);
      challenge.submissionLimit = Number(v2.submissionLimit);
      challenge.documents = v2.Documents;
      challenge.fileTypes = v2.filetypes;
      challenge.round1Introduction = v2.round1Introduction;
      challenge.round2Introduction = v2.round2Introduction;
      challenge.allowStockArt = v2.allowStockArt === 'true';
      challenge.finalSubmissionGuidelines = v2.finalSubmissionGuidelines;
      challenge.appealsEndDate = v2.appealsEndDate;
    }
  } else if (!_.isEmpty(v2)) {
    challenge = {
      id: challengeId,
      name: v2.challengeName,
      track: v2.type,
      subTrack: v2.challengeType,
      events: v2.event ? [
        {
          eventName: v2.event.shortDescription,
          eventId: v2.event.id,
          description: v2.event.description,
        }] : [],
      mainEvent: v2.event ? {
        eventName: v2.event.shortDescription,
        eventId: v2.event.id,
        description: v2.event.description,
      } : {},
      technologies: v2.technology ? v2.technology.join(', ') : '',
      platforms: v2.platforms ? v2.platforms.join(', ') : '',
      prizes: v2.prize,
      topCheckPointPrize: v2.topCheckPointPrize,
      numberOfCheckpointsPrizes: v2.numberOfCheckpointsPrizes,
      introduction: v2.introduction,
      detailedRequirements: v2.detailedRequirements,
      forumLink: v2.forumLink,
      screeningScorecardId: Number(v2.screeningScorecardId),
      reviewScorecardId: Number(v2.reviewScorecardId),
      submissionLimit: Number(v2.submissionLimit),
      documents: v2.Documents,
      reviewType: v2.reviewType,
      fileTypes: v2.filetypes,
      round1Introduction: v2.round1Introduction,
      round2Introduction: v2.round2Introduction,
      allowStockArt: v2.allowStockArt === 'true',
      finalSubmissionGuidelines: v2.finalSubmissionGuidelines,
      appealsEndDate: v2.appealsEndDate,
    };
  }
  return challenge;
}

const mapStateToProps = (state, props) => ({
  challengeId: Number(props.match.params.challengeId),
  challenge: extractChallengeDetail(state.challenge.details,
    state.challenge.detailsV2,
    Number(props.match.params.challengeId)),
  isLoadingChallenge: Boolean(state.challenge.loadingDetailsForChallengeId),
  authTokens: state.auth,
  tokenV2: state.auth && state.auth.tokenV2,
  tokenV3: state.auth && state.auth.tokenV3,
  registering: state.challenge.registering,
  unregistering: state.challenge.unregistering,
  checkpoints: state.challenge.checkpoints,
});

const mapDispatchToProps = (dispatch) => {
  const a = challengeActions.challenge;
  return {
    loadChallengeDetails: (tokens, challengeId) => {
      dispatch(a.getDetailsInit(challengeId));
      dispatch(a.getDetailsDone(challengeId, tokens.tokenV3, tokens.tokenV2))
        .then((challengeDetails) => {
          dispatch(a.fetchCheckpointsInit());
          dispatch(a.fetchCheckpointsDone(tokens.tokenV2, challengeId));
          return challengeDetails;
        });
    },
    registerForChallenge: (auth, challengeId) => {
      dispatch(a.registerInit());
      dispatch(a.registerDone(auth, challengeId));
    },
    reloadChallengeDetails: (tokens, challengeId) => {
      dispatch(a.getDetailsDone(challengeId, tokens.tokenV3, tokens.tokenV2))
        .then((challengeDetails) => {
          dispatch(a.fetchCheckpointsDone(tokens.tokenV2, challengeId));
          return challengeDetails;
        });
    },
    unregisterFromChallenge: (auth, challengeId) => {
      dispatch(a.unregisterInit());
      dispatch(a.unregisterDone(auth, challengeId));
    },
    fetchCheckpoints: (tokens, challengeId) => {
      dispatch(a.fetchCheckpointsInit());
      dispatch(a.fetchCheckpointsDone(tokens.tokenV2, challengeId));
    },
  };
};

const ChallengeDetailContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ChallengeDetailPageContainer);

export default ChallengeDetailContainer;
