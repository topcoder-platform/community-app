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
              selectedView={this.state.selectedView}
            />
          }
          {
            !isEmpty && this.state.selectedView === 'DETAILS' &&
            <ChallengeDetailsView
              introduction={this.props.challenge.introduction}
              detailedRequirements={this.props.challenge.detailedRequirements}
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
};

ChallengeDetailPageContainer.propTypes = {
  tokenV3: PT.string,
  challenge: PT.shape().isRequired,
  isLoadingChallenge: PT.bool,
  loadChallengeDetails: PT.func.isRequired,
  authTokens: PT.shape().isRequired,
  challengeId: PT.number.isRequired,
  reloadChallengeDetails: PT.func.isRequired,
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
    }
  } else if (!_.isEmpty(v2)) {
    challenge = {
      name: v2.challengeName,
      track: v2.type,
      subTrack: v2.challengeType,
      events: v2.event ? [{ eventName: v2.event.shortDescription, eventId: v2.event.id }] : [],
      technologies: v2.technology ? v2.technology.join(', ') : '',
      platforms: v2.platforms ? v2.platforms.join(', ') : '',
      prizes: v2.prize,
      topCheckPointPrize: v2.topCheckPointPrize,
      numberOfCheckpointsPrizes: v2.numberOfCheckpointsPrizes,
      introduction: v2.introduction,
      detailedRequirements: v2.detailedRequirements,
    };
  }
  return challenge;
}

const mapStateToProps = (state, props) => ({
  challengeId: Number(props.match.params.challengeId),
  challenge: extractChallengeDetail(state.challenge.details, state.challenge.detailsV2),
  isLoadingChallenge: state.challenge.loadingDetails,
  authTokens: state.auth,
  tokenV3: (state.auth ? state.auth.tokenV3 : null),
});

const mapDispatchToProps = dispatch => ({
  loadChallengeDetails: (tokens, challengeId) => {
    dispatch(challengeActions.fetchChallengeInit());
    dispatch(challengeActions.fetchChallengeDone(tokens, challengeId));
  },
  reloadChallengeDetails: (tokens, challengeId) => {
    dispatch(challengeActions.fetchChallengeDone(tokens, challengeId));
  },
});

const ChallengeDetailContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ChallengeDetailPageContainer);

export default ChallengeDetailContainer;
