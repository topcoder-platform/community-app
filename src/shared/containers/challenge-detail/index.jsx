/**
 * This container component load data into its state, and pass them to children via props.
 * Its should have in its state, and properly manage the showDetails set
 * (thus allowing to show/hide detail panels for different submissions),
 * and it should define all necessary handlers to pass to the children.
 */
/* global location, window */

import _ from 'lodash';
import LoadingPagePlaceholder from 'components/LoadingPagePlaceholder';
import ChallengeHeader from 'components/challenge-detail/Header';
import challengeListingActions from 'actions/challenge-listing';
import challengeListingSidebarActions from 'actions/challenge-listing/sidebar';
import Registrants from 'components/challenge-detail/Registrants';
import Submissions from 'components/challenge-detail/Submissions';
import Winners from 'components/challenge-detail/Winners';
import ChallengeDetailsView from 'components/challenge-detail/Specification';
import TermsModal from 'components/challenge-detail/Specification/TermsModal';
import ChallengeCheckpoints from 'components/challenge-detail/Checkpoints';
import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import challengeActions from 'actions/challenge';
import termsActions from 'actions/terms';
import config from 'utils/config';
import { BUCKETS } from 'utils/challenge-listing/buckets';

import './styles.scss';

function isRegistered(details, registrants, handle) {
  if (details && details.roles && details.roles.includes('Submitter')) {
    return true;
  }
  if (_.find(registrants, r => r.handle === handle)) {
    return true;
  }
  return false;
}

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
    this.registerForChallenge = this.registerForChallenge.bind(this);
  }

  componentDidMount() {
    const { challenge, loadChallengeDetails, loadTerms,
      openTermsModal, authTokens, challengeId } = this.props;

    if (challenge.id !== challengeId) {
      loadChallengeDetails(authTokens, challengeId);
    }

    loadTerms(authTokens, challengeId);

    if (authTokens.tokenV2 && location.search.indexOf('showTerms=true') > 0) {
      openTermsModal();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.tokenV3 !== nextProps.tokenV3) {
      this.props.reloadChallengeDetails(nextProps.authTokens, this.props.challengeId);
    }

    const checkpoints = nextProps.challenge.checkpoints;
    if (checkpoints && checkpoints.length > 0
      && !nextProps.loadingCheckpointResults
      && !nextProps.checkpointResults) {
      this.props.fetchCheckpoints(this.props.authTokens, this.props.challengeId);
    }
    if (nextProps.challenge.status === 'COMPLETED' &&
      !nextProps.loadingResults &&
      !nextProps.results) {
      this.props.loadResults(this.props.authTokens, this.props.challengeId,
        nextProps.challenge.track.toLowerCase());
    }

    const userDetails = this.props.challenge.userDetails;
    const hasRegistered = isRegistered(userDetails, this.props.challenge.registrants,
      (this.props.authTokens.user || {}).handle);

    if (location.search.indexOf('showTerms=true') > 0 && hasRegistered) {
      location.href = location.href.replace(location.search, '');
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

  registerForChallenge() {
    if (!this.props.authTokens.tokenV2) {
      location.href = `${config.URL.AUTH}/member?retUrl=${encodeURIComponent(location.href)}`;
    } else if (_.every(this.props.terms, 'agreed')) {
      this.props.registerForChallenge(this.props.authTokens, this.props.challengeId);
    } else {
      this.props.openTermsModal();
    }
  }

  render() {
    const isEmpty = _.isEmpty(this.props.challenge);

    const hasRegistered = isRegistered(this.props.challenge.userDetails,
      this.props.challenge.registrants,
      (this.props.authTokens.user || {}).handle);

    if (this.props.isLoadingChallenge) return <LoadingPagePlaceholder />;

    return (
      <div styleName="outer-container">
        <div styleName="challenge-detail-container">
          {
            !isEmpty &&
            <ChallengeHeader
              challenge={this.props.challenge}
              challengeId={this.props.challengeId}
              showDeadlineDetail={this.state.showDeadlineDetail}
              onToggleDeadlines={this.onToggleDeadlines}
              onSelectorClicked={this.onSelectorClicked}
              registerForChallenge={this.registerForChallenge}
              registering={this.props.registering}
              selectedView={this.state.selectedView}
              setChallengeListingFilter={this.props.setChallengeListingFilter}
              unregisterFromChallenge={() =>
                this.props.unregisterFromChallenge(this.props.authTokens, this.props.challengeId)
              }
              unregistering={this.props.unregistering}
              checkpoints={this.props.checkpoints}
              hasRegistered={hasRegistered}
            />
          }
          {
            !isEmpty && this.state.selectedView === 'DETAILS' &&
            <ChallengeDetailsView
              challenge={this.props.challenge}
              introduction={this.props.challenge.introduction}
              detailedRequirements={this.props.challenge.detailedRequirements}
              terms={this.props.terms}
              hasRegistered={hasRegistered}
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
            !isEmpty && this.state.selectedView === 'CHECKPOINTS' &&
            <ChallengeCheckpoints
              checkpoints={this.props.checkpoints}
              toggleCheckpointFeedback={this.props.toggleCheckpointFeedback}
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
        {
          this.props.showTermsModal &&
          <TermsModal
            onCancel={this.props.closeTermsModal}
            title={this.props.challenge.name}
            isLoadingTerms={this.props.isLoadingTerms}
            terms={this.props.terms}
            loadTerms={() => this.props.loadTerms(this.props.authTokens, this.props.challengeId)}
            loadDetails={termId => this.props.loadTermDetails(this.props.authTokens, termId)}
            details={this.props.termDetails}
            loadingTermId={this.props.loadingTermId}
            docuSignUrl={this.props.docuSignUrl}
            getDocuSignUrl={(templateId) => {
              const base = window ? window.location.href.match('.*://[^/]*')[0] : '';
              return this.props.getDocuSignUrl(this.props.authTokens,
                templateId, `${base}/iframe-break/?dest=${base}`
                + `${location.pathname}?showTerms=true`);
            }}
            register={() => this.props.registerForChallenge(this.props.authTokens,
              this.props.challengeId)}
            agreeingTerm={this.props.agreeingTerm}
            agreeTerm={termId => this.props.agreeTerm(this.props.authTokens, termId)}
            agreedTerms={this.props.agreedTerms}
            registering={this.props.registering}
            loadingDocuSignUrl={this.props.loadingDocuSignUrl}
          />
        }
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
  checkpoints: {},
  terms: [],
  showTermsModal: false,
  isLoadingTerms: false,
  termDetails: {},
  docuSignUrl: '',
  loadingTermId: '',
  agreeingTerm: '',
  agreedTerms: {},
  loadingDocuSignUrl: '',
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
  toggleCheckpointFeedback: PT.func.isRequired,
  loadingResults: PT.bool,
  results: PT.arrayOf(PT.shape()),
  fetchCheckpoints: PT.func.isRequired,
  loadResults: PT.func.isRequired,
  checkpoints: PT.shape(),
  terms: PT.arrayOf(PT.shape()),
  openTermsModal: PT.func.isRequired,
  closeTermsModal: PT.func.isRequired,
  showTermsModal: PT.bool,
  loadTerms: PT.func.isRequired,
  isLoadingTerms: PT.bool,
  loadTermDetails: PT.func.isRequired,
  termDetails: PT.shape(),
  docuSignUrl: PT.string,
  getDocuSignUrl: PT.func.isRequired,
  loadingTermId: PT.string,
  agreeingTerm: PT.string,
  agreeTerm: PT.func.isRequired,
  agreedTerms: PT.shape(),
  loadingDocuSignUrl: PT.string,
  setChallengeListingFilter: PT.func.isRequired,
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
      challenge.registrants = v2.registrants;
      challenge.checkpoints = v2.checkpoints;
      challenge.submissions = v2.submissions;
      challenge.submissionsViewable = v2.submissionsViewable;
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
      if (v2.event) {
        challenge.mainEvent = {
          eventName: v2.event.shortDescription,
          eventId: v2.event.id,
          description: v2.event.description,
        };
      }
    }
  } else if (!_.isEmpty(v2)) {
    challenge = {
      id: challengeId,
      status: v2.currentStatus,
      name: v2.challengeName,
      track: v2.challengeCommunity,
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
      registrants: v2.registrants,
      checkpoints: v2.checkpoints,
      submissions: v2.submissions,
      submissionsViewable: v2.submissionsViewable,
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
  checkpointResults: (state.challenge.checkpoints || {}).checkpointResults,
  loadingCheckpointResults: state.challenge.loadingCheckpoints,
  results: state.challenge.results,
  loadingResults: state.challenge.loadingResults,
  checkpoints: state.challenge.checkpoints,
  terms: state.terms.terms,
  showTermsModal: state.challenge.showTermsModal,
  loadingTermId: state.terms.loadingDetailsForTermId,
  termDetails: state.terms.details,
  docuSignUrl: state.terms.docuSignUrl,
  loadingDocuSignUrl: state.terms.loadingDocuSignUrl,
  agreeingTerm: state.terms.agreeingTerm,
  agreedTerms: state.terms.agreedTerms,
  isLoadingTerms: state.terms.loadingTermsForChallengeId === props.match.params.challengeId,
});

const mapDispatchToProps = (dispatch) => {
  const a = challengeActions.challenge;
  const t = termsActions.terms;
  return {
    loadChallengeDetails: (tokens, challengeId) => {
      dispatch(a.getDetailsInit(challengeId));
      dispatch(a.getDetailsDone(challengeId, tokens.tokenV3, tokens.tokenV2))
        .then((res) => {
          if (res.payload[0].track === 'DESIGN') {
            dispatch(a.fetchCheckpointsInit());
            dispatch(a.fetchCheckpointsDone(tokens.tokenV2, challengeId));
          }
          return res;
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
    setChallengeListingFilter: (filter) => {
      const cl = challengeListingActions.challengeListing;
      const cls = challengeListingSidebarActions.challengeListing.sidebar;
      dispatch(cl.setFilter(filter));
      dispatch(cls.selectBucket(BUCKETS.ALL));
    },
    unregisterFromChallenge: (auth, challengeId) => {
      dispatch(a.unregisterInit());
      dispatch(a.unregisterDone(auth, challengeId));
    },
    loadResults: (auth, challengeId, type) => {
      dispatch(a.loadResultsInit());
      dispatch(a.loadResultsDone(auth, challengeId, type));
    },
    fetchCheckpoints: (tokens, challengeId) => {
      dispatch(a.fetchCheckpointsInit());
      dispatch(a.fetchCheckpointsDone(tokens.tokenV2, challengeId));
    },
    toggleCheckpointFeedback: (id) => {
      dispatch(a.toggleCheckpointFeedback(id));
    },
    loadTerms: (tokens, challengeId) => {
      dispatch(t.getTermsInit(challengeId));
      dispatch(t.getTermsDone(challengeId, tokens.tokenV2));
    },
    openTermsModal: () => {
      dispatch(a.openTermsModal());
    },
    closeTermsModal: () => {
      dispatch(a.closeTermsModal());
    },
    loadTermDetails: (tokens, termId) => {
      dispatch(t.getTermDetailsInit(termId));
      dispatch(t.getTermDetailsDone(termId, tokens.tokenV2));
    },
    getDocuSignUrl: (tokens, templateId, returnUrl) => {
      dispatch(t.getDocuSignUrlInit(templateId));
      dispatch(t.getDocuSignUrlDone(templateId, returnUrl, tokens.tokenV2));
    },
    agreeTerm: (tokens, termId) => {
      dispatch(t.agreeTermInit(termId));
      dispatch(t.agreeTermDone(termId, tokens.tokenV2));
    },
  };
};

const ChallengeDetailContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ChallengeDetailPageContainer);

export default ChallengeDetailContainer;
