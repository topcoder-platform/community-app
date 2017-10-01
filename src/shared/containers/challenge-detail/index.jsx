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
import ChallengeTerms from 'components/challenge-detail/ChallengeTerms';
import ChallengeCheckpoints from 'components/challenge-detail/Checkpoints';
import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import challengeActions, { DETAIL_TABS } from 'actions/challenge';
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
    };

    this.onToggleDeadlines = this.onToggleDeadlines.bind(this);
    this.registerForChallenge = this.registerForChallenge.bind(this);
  }

  componentDidMount() {
    const { challenge, loadChallengeDetails, loadTerms,
      openTermsModal, authTokens, challengeId,
      challengeSubtracksMap, getSubtracks } = this.props;

    if (challenge.id !== challengeId) {
      loadChallengeDetails(authTokens, challengeId);
    }

    loadTerms(authTokens, challengeId);

    if (authTokens.tokenV2 && location.search.indexOf('showTerms=true') > 0) {
      openTermsModal();
    }

    if (_.isEmpty(challengeSubtracksMap)) {
      getSubtracks();
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

    if (nextProps.challenge.status === 'COMPLETED'
      && _.toString(nextProps.challengeId)
        !== nextProps.resultsLoadedForChallengeId
      && _.toString(nextProps.challengeId)
        !== nextProps.loadingResultsForChallengeId) {
      this.props.loadResults(
        this.props.authTokens,
        this.props.challengeId,
        nextProps.challenge.track.toLowerCase(),
      );
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
    const {
      challenge,
      challengeId,
      challengesUrl,
      resultsLoadedForChallengeId,
      openTermsModal,
    } = this.props;

    const results = resultsLoadedForChallengeId === _.toString(challengeId)
      ? this.props.results : null;

    const isEmpty = _.isEmpty(this.props.challenge);

    const hasRegistered = isRegistered(this.props.challenge.userDetails,
      this.props.challenge.registrants,
      (this.props.authTokens.user || {}).handle);

    if (this.props.isLoadingChallenge) return <LoadingPagePlaceholder />;

    const numWinners = (challenge.winners && challenge.winners.filter(winner =>
      winner.type === 'final').length) || 0;

    return (
      <div styleName="outer-container">
        <div styleName="challenge-detail-container">
          { Boolean(isEmpty) && (
            <div styleName="page">
              Challenge #{challengeId} does not exist!
            </div>
          )}
          {
            !isEmpty &&
            <ChallengeHeader
              challenge={challenge}
              challengeId={this.props.challengeId}
              challengesUrl={challengesUrl}
              numWinners={numWinners}
              showDeadlineDetail={this.state.showDeadlineDetail}
              onToggleDeadlines={this.onToggleDeadlines}
              onSelectorClicked={this.props.onSelectorClicked}
              registerForChallenge={this.registerForChallenge}
              registering={this.props.registering}
              selectedView={this.props.selectedTab}
              setChallengeListingFilter={this.props.setChallengeListingFilter}
              unregisterFromChallenge={() =>
                this.props.unregisterFromChallenge(this.props.authTokens, this.props.challengeId)
              }
              unregistering={this.props.unregistering}
              checkpoints={this.props.checkpoints}
              hasRegistered={hasRegistered}
              challengeSubtracksMap={this.props.challengeSubtracksMap}
            />
          }
          {
            !isEmpty && this.props.selectedTab === DETAIL_TABS.DETAILS &&
            <ChallengeDetailsView
              challenge={this.props.challenge}
              introduction={this.props.challenge.introduction}
              detailedRequirements={this.props.challenge.detailedRequirements}
              terms={this.props.terms}
              hasRegistered={hasRegistered}
              openTermsModal={openTermsModal}
            />
          }
          {
            !isEmpty && this.props.selectedTab === DETAIL_TABS.REGISTRANTS &&
            <Registrants
              registrants={this.props.challenge.registrants}
              isDesign={this.props.challenge.track.toLowerCase() === 'design'}
              winners={this.props.challenge.winners}
              checkpoints={this.props.challenge.checkpoints}
              submissions={this.props.challenge.submissions}
              checkpointResults={this.props.checkpointResults}
              results={results}
              places={this.props.challenge.prizes.length}
            />
          }
          {
            !isEmpty && this.props.selectedTab === DETAIL_TABS.CHECKPOINTS &&
            <ChallengeCheckpoints
              checkpoints={this.props.checkpoints}
              toggleCheckpointFeedback={this.props.toggleCheckpointFeedback}
            />
          }
          {
            !isEmpty && this.props.selectedTab === DETAIL_TABS.SUBMISSIONS &&
            <Submissions
              viewable={this.props.challenge.submissionsViewable === 'true'}
              submissions={this.props.challenge.submissions}
              checkpoints={this.props.challenge.checkpoints}
              isDesign={this.props.challenge.track.toLowerCase() === 'design'}
            />
          }
          {
            !isEmpty && this.props.selectedTab === DETAIL_TABS.WINNERS &&
            <Winners
              results={results}
              prizes={this.props.challenge.prizes}
              submissions={this.props.challenge.submissions}
              viewable={this.props.challenge.submissionsViewable === 'true'}
              isDesign={this.props.challenge.track.toLowerCase() === 'design'}
            />
          }
        </div>
        {
          this.props.showTermsModal &&
          <ChallengeTerms
            challengesUrl={challengesUrl}
            onCancel={this.props.closeTermsModal}
            title={this.props.challenge.name}
            isLoadingTerms={this.props.isLoadingTerms}
            terms={this.props.terms}
            selectedTerm={this.props.selectedTerm}
            viewOnly={this.props.viewOnly}
            selectTerm={this.props.selectTerm}
            loadTerms={() => this.props.loadTerms(this.props.authTokens, this.props.challengeId)}
            loadDetails={termId => this.props.loadTermDetails(this.props.authTokens, termId)}
            details={this.props.termDetails}
            loadingTermId={this.props.loadingTermId}
            docuSignUrl={this.props.docuSignUrl}
            getDocuSignUrl={(templateId) => {
              const base = window ? window.location.href.match('.*://[^/]*')[0] : '';
              return this.props.getDocuSignUrl(this.props.authTokens,
                templateId, `${base}/iframe-break`);
            }}
            register={() => this.props.registerForChallenge(this.props.authTokens,
              this.props.challengeId)}
            agreeingTerm={this.props.agreeingTerm}
            agreeTerm={termId => this.props.agreeTerm(this.props.authTokens, termId)}
            registering={this.props.registering}
            loadingDocuSignUrl={this.props.loadingDocuSignUrl}
            signDocu={this.props.signDocu}
            checkStatus={() => this.props.checkStatus(this.props.authTokens,
              this.props.challengeId)}
            canRegister={this.props.canRegister}
            checkingStatus={this.props.checkingStatus}
          />
        }
      </div>
    );
  }
}

ChallengeDetailPageContainer.defaultProps = {
  agreeingTerm: '',
  challengesUrl: '/challenges',
  checkpointResults: null,
  checkpoints: {},
  docuSignUrl: '',
  isLoadingChallenge: false,
  isLoadingTerms: false,
  loadingCheckpointResults: false,
  loadingDocuSignUrl: '',
  loadingTermId: '',
  results: null,
  showTermsModal: false,
  selectedTerm: null,
  terms: [],
  termDetails: {},
  tokenV3: null,
  viewOnly: false,
  canRegister: false,
  checkingStatus: false,
};

ChallengeDetailPageContainer.propTypes = {
  agreeingTerm: PT.string,
  agreeTerm: PT.func.isRequired,
  authTokens: PT.shape().isRequired,
  challenge: PT.shape().isRequired,
  challengeId: PT.number.isRequired,
  challengeSubtracksMap: PT.shape().isRequired,
  challengesUrl: PT.string,
  checkpointResults: PT.arrayOf(PT.shape()),
  checkpoints: PT.shape(),
  closeTermsModal: PT.func.isRequired,
  docuSignUrl: PT.string,
  fetchCheckpoints: PT.func.isRequired,
  getDocuSignUrl: PT.func.isRequired,
  getSubtracks: PT.func.isRequired,
  isLoadingChallenge: PT.bool,
  isLoadingTerms: PT.bool,
  loadChallengeDetails: PT.func.isRequired,
  loadResults: PT.func.isRequired,
  loadTerms: PT.func.isRequired,
  loadTermDetails: PT.func.isRequired,
  loadingCheckpointResults: PT.bool,
  loadingDocuSignUrl: PT.string,
  loadingResultsForChallengeId: PT.string.isRequired,
  loadingTermId: PT.string,
  onSelectorClicked: PT.func.isRequired,
  openTermsModal: PT.func.isRequired,
  registerForChallenge: PT.func.isRequired,
  registering: PT.bool.isRequired,
  reloadChallengeDetails: PT.func.isRequired,
  results: PT.arrayOf(PT.shape()),
  resultsLoadedForChallengeId: PT.string.isRequired,
  selectedTab: PT.string.isRequired,
  setChallengeListingFilter: PT.func.isRequired,
  showTermsModal: PT.bool,
  selectedTerm: PT.shape(),
  viewOnly: PT.bool,
  signDocu: PT.func.isRequired,
  selectTerm: PT.func.isRequired,
  termDetails: PT.shape(),
  terms: PT.arrayOf(PT.shape()),
  toggleCheckpointFeedback: PT.func.isRequired,
  tokenV3: PT.string,
  unregisterFromChallenge: PT.func.isRequired,
  unregistering: PT.bool.isRequired,
  checkStatus: PT.func.isRequired,
  canRegister: PT.bool,
  checkingStatus: PT.bool,
};

/* TODO: This function is ugly. We should do all this logic within normalization
 * function inside the challenge service. */
function extractChallengeDetail(v3, v2, challengeId) {
  let challenge = {};
  if (!_.isEmpty(v3)) {
    challenge = _.defaults(_.clone(v3), { prizes: [] });
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
  agreeingTerm: state.terms.agreeingTerm,
  authTokens: state.auth,
  challenge: extractChallengeDetail(state.challenge.details,
    state.challenge.detailsV2,
    Number(props.match.params.challengeId)),
  challengeId: Number(props.match.params.challengeId),
  challengesUrl: props.challengesUrl,
  challengeSubtracksMap: state.challengeListing.challengeSubtracksMap,
  checkpointResults: (state.challenge.checkpoints || {}).checkpointResults,
  checkpoints: state.challenge.checkpoints,
  docuSignUrl: state.terms.docuSignUrl,
  isLoadingChallenge: Boolean(state.challenge.loadingDetailsForChallengeId),
  isLoadingTerms: state.terms.loadingTermsForChallengeId
    === props.match.params.challengeId,
  loadingCheckpointResults: state.challenge.loadingCheckpoints,
  loadingDocuSignUrl: state.terms.loadingDocuSignUrl,
  loadingResultsForChallengeId: state.challenge.loadingResultsForChallengeId,
  loadingTermId: state.terms.loadingDetailsForTermId,
  registering: state.challenge.registering,
  results: state.challenge.results,
  resultsLoadedForChallengeId: state.challenge.resultsLoadedForChallengeId,
  selectedTab: state.challenge.selectedTab || 'details',
  showTermsModal: state.terms.showTermsModal,
  selectedTerm: state.terms.selectedTerm,
  viewOnly: state.terms.viewOnly,
  termDetails: state.terms.details,
  terms: state.terms.terms,
  canRegister: state.terms.canRegister,
  checkingStatus: state.terms.checkingStatus,
  tokenV2: state.auth && state.auth.tokenV2,
  tokenV3: state.auth && state.auth.tokenV3,
  unregistering: state.challenge.unregistering,
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
      dispatch(a.loadResultsInit(challengeId));
      dispatch(a.loadResultsDone(auth, challengeId, type));
    },
    fetchCheckpoints: (tokens, challengeId) => {
      dispatch(a.fetchCheckpointsInit());
      dispatch(a.fetchCheckpointsDone(tokens.tokenV2, challengeId));
    },
    toggleCheckpointFeedback: (id, open) => {
      dispatch(a.toggleCheckpointFeedback(id, open));
    },
    loadTerms: (tokens, challengeId) => {
      dispatch(t.getTermsInit(challengeId));
      dispatch(t.getTermsDone(challengeId, tokens.tokenV2));
    },
    openTermsModal: (term) => {
      dispatch(t.openTermsModal(term));
    },
    closeTermsModal: () => {
      dispatch(t.closeTermsModal());
    },
    selectTerm: (term) => {
      dispatch(t.selectTerm(term));
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
    signDocu: (id) => {
      dispatch(t.signDocu(id));
    },
    checkStatus: (tokens, challengeId) => {
      dispatch(t.checkStatusInit());
      dispatch(t.checkStatusDone(challengeId, tokens.tokenV2));
    },
    onSelectorClicked: (tab) => {
      dispatch(a.selectTab(tab));
    },
    getSubtracks: () => {
      const cl = challengeListingActions.challengeListing;
      dispatch(cl.getChallengeSubtracksInit());
      dispatch(cl.getChallengeSubtracksDone());
    },
  };
};

const ChallengeDetailContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ChallengeDetailPageContainer);

export default ChallengeDetailContainer;
