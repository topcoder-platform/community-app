/**
 * This container component load data into its state, and pass them to children via props.
 * Its should have in its state, and properly manage the showDetails set
 * (thus allowing to show/hide detail panels for different submissions),
 * and it should define all necessary handlers to pass to the children.
 */
/* global location */

import _ from 'lodash';
import communityActions from 'actions/tc-communities';
import LoadingPagePlaceholder from 'components/LoadingPagePlaceholder';
import ChallengeHeader from 'components/challenge-detail/Header';
import challengeListingActions from 'actions/challenge-listing';
import challengeListingSidebarActions from 'actions/challenge-listing/sidebar';
import Registrants from 'components/challenge-detail/Registrants';
import shortId from 'shortid';
import Submissions from 'components/challenge-detail/Submissions';
import Winners from 'components/challenge-detail/Winners';
import ChallengeDetailsView from 'components/challenge-detail/Specification';
import Terms from 'containers/Terms';
import termsActions from 'actions/terms';
import ChallengeCheckpoints from 'components/challenge-detail/Checkpoints';
import React from 'react';
import htmlToText from 'html-to-text';
import PT from 'prop-types';
import { connect } from 'react-redux';
import challengeActions, { DETAIL_TABS } from 'actions/challenge';
import config from 'utils/config';
import MetaTags from 'utils/MetaTags';
import { BUCKETS } from 'utils/challenge-listing/buckets';
import { CHALLENGE_PHASE_TYPES, COMPETITION_TRACKS_V3, SUBTRACKS } from 'utils/tc';

import ogWireframe from
  '../../../assets/images/open-graph/challenges/01-wireframe.jpg';
import ogUiDesign from
  '../../../assets/images/open-graph/challenges/02-ui-design.jpg';
import ogUiPrototype from
  '../../../assets/images/open-graph/challenges/03-ui-prototype.jpg';
import ogFirst2Finish from
  '../../../assets/images/open-graph/challenges/04-first-2-finish.jpg';
import ogDevelopment from
  '../../../assets/images/open-graph/challenges/05-development.jpg';
import ogBigPrizesChallenge from
  '../../../assets/images/open-graph/challenges/09-big-prizes-challenge.jpg';
import ogLuxChallenge from
  '../../../assets/images/open-graph/challenges/10-lux-challenge.jpg';
import ogRuxChallenge from
  '../../../assets/images/open-graph/challenges/11-rux-challenge.jpg';
import og24hUiPrototype from
  '../../../assets/images/open-graph/challenges/12-24h-ui-prototype-challenge.jpg';
import og48hUiPrototype from
  '../../../assets/images/open-graph/challenges/13-48h-ui-prototype-challenge.jpg';

/* A fallback image, just in case we missed some corner case. */
import ogImage from
  '../../../assets/images/og_image.jpg';

import './styles.scss';

/* Holds various time ranges in milliseconds. */
const MIN = 60 * 1000;
const DAY = 24 * 60 * MIN;

/**
 * Given challenge details object, it returns the URL of the image to be used in
 * OpenGraph (i.e. in social sharing posts).
 * @param {Object} challenge
 * @return {String}
 */
function getOgImage(challenge) {
  if (challenge.name.startsWith('LUX -')) return ogLuxChallenge;
  if (challenge.name.startsWith('RUX -')) return ogRuxChallenge;
  if (challenge.prizes) {
    const totalPrize = challenge.prizes.reduce((p, sum) => p + sum, 0);
    if (totalPrize > 3000) return ogBigPrizesChallenge;
  }
  switch (challenge.subTrack) {
    case SUBTRACKS.FIRST_2_FINISH: return ogFirst2Finish;
    case SUBTRACKS.UI_PROTOTYPE_COMPETITION: {
      const submission = challenge.allPhases
        .find(p => p.phaseType === CHALLENGE_PHASE_TYPES.SUBMISSION);
      if (submission) {
        if (submission.duration < 1.1 * DAY) return og24hUiPrototype;
        if (submission.duration < 2.1 * DAY) return og48hUiPrototype;
      }
      return ogUiPrototype;
    }
    case SUBTRACKS.WIREFRAMES: return ogWireframe;
    default:
  }
  switch (challenge.track) {
    case COMPETITION_TRACKS_V3.DEVELOP: return ogDevelopment;
    case COMPETITION_TRACKS_V3.DESIGN: return ogUiDesign;
    default: return ogImage;
  }
}

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
    const {
      authTokens,
      challenge,
      communitiesList,
      getCommunitiesList,
      loadChallengeDetails,
      challengeId,
      challengeSubtracksMap,
      getSubtracks,
    } = this.props;

    if (challenge.id !== challengeId) {
      loadChallengeDetails(authTokens, challengeId);
    }

    if (!communitiesList.loadingUuid
    && (Date.now() - communitiesList.timestamp > 10 * MIN)) {
      getCommunitiesList(authTokens);
    }

    if (_.isEmpty(challengeSubtracksMap)) {
      getSubtracks();
    }
  }

  componentWillReceiveProps(nextProps) {
    const userId = _.get(this, 'props.authTokens.user.userId');
    const nextUserId = _.get(nextProps, 'authTokens.user.userId');
    if (userId !== nextUserId) {
      nextProps.getCommunitiesList(nextProps.authTokens);
    }

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
      domain,
      resultsLoadedForChallengeId,
      openTermsModal,
    } = this.props;

    /* Generation of data for SEO meta-tags. */
    let prizesStr;
    if (challenge.prizes && challenge.prizes.length) {
      prizesStr = challenge.prizes.map(p => `$${p}`).join('/');
      prizesStr = `[${prizesStr}] - `;
    }
    const title = challenge.name;

    let description = challenge.introduction || challenge.detailedRequirements;
    description = description ? description.slice(0, 256) : '';
    description = htmlToText.fromString(description, {
      singleNewLineParagraphs: true,
      wordwrap: false,
    });
    description = description.replace(/\n/g, ' ');

    const results = resultsLoadedForChallengeId === _.toString(challengeId)
      ? this.props.results : null;

    const isEmpty = _.isEmpty(this.props.challenge);

    const hasRegistered = isRegistered(this.props.challenge.userDetails,
      this.props.challenge.registrants,
      (this.props.authTokens.user || {}).handle);

    if (this.props.isLoadingChallenge || this.props.isLoadingTerms) {
      return <LoadingPagePlaceholder />;
    }

    let winners = challenge.winners || [];
    winners = winners.filter(w => !w.type || w.type === 'final');

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
            <MetaTags
              description={description.slice(0, 155)}
              image={`${domain}${getOgImage(challenge)}`}
              siteName="Topcoder"
              socialDescription={description.slice(0, 200)}
              socialTitle={`${prizesStr}${title}`}
              title={title}
            />
          }
          {
            !isEmpty &&
            <ChallengeHeader
              challenge={challenge}
              challengeId={this.props.challengeId}
              challengesUrl={challengesUrl}
              numWinners={winners.length}
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
              communitiesList={this.props.communitiesList.data}
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
              winners={winners}
              prizes={this.props.challenge.prizes}
              submissions={this.props.challenge.submissions}
              viewable={this.props.challenge.submissionsViewable === 'true'}
              isDesign={this.props.challenge.track.toLowerCase() === 'design'}
            />
          }
        </div>
        <Terms
          entity={{ type: 'challenge', id: challengeId.toString() }}
          description="You are seeing these Terms & Conditions because you have registered to a challenge and you have to respect the terms below in order to be able to submit."
          register={() => {
            this.props.registerForChallenge(this.props.authTokens, this.props.challengeId);
          }}
        />
      </div>
    );
  }
}

ChallengeDetailPageContainer.defaultProps = {
  challengesUrl: '/challenges',
  checkpointResults: null,
  checkpoints: {},
  isLoadingChallenge: false,
  isLoadingTerms: false,
  loadingCheckpointResults: false,
  results: null,
  terms: [],
  tokenV3: null,
};

ChallengeDetailPageContainer.propTypes = {
  authTokens: PT.shape().isRequired,
  challenge: PT.shape().isRequired,
  challengeId: PT.number.isRequired,
  challengeSubtracksMap: PT.shape().isRequired,
  challengesUrl: PT.string,
  checkpointResults: PT.arrayOf(PT.shape()),
  checkpoints: PT.shape(),
  communitiesList: PT.shape({
    data: PT.arrayOf(PT.object).isRequired,
    loadingUuid: PT.string.isRequired,
    timestamp: PT.number.isRequired,
  }).isRequired,
  domain: PT.string.isRequired,
  getCommunitiesList: PT.func.isRequired,
  getSubtracks: PT.func.isRequired,
  isLoadingChallenge: PT.bool,
  isLoadingTerms: PT.bool,
  loadChallengeDetails: PT.func.isRequired,
  // loadResults: PT.func.isRequired,
  // loadingCheckpointResults: PT.bool,
  // loadingResultsForChallengeId: PT.string.isRequired,
  openTermsModal: PT.func.isRequired,
  onSelectorClicked: PT.func.isRequired,
  registerForChallenge: PT.func.isRequired,
  registering: PT.bool.isRequired,
  reloadChallengeDetails: PT.func.isRequired,
  results: PT.arrayOf(PT.shape()),
  resultsLoadedForChallengeId: PT.string.isRequired,
  selectedTab: PT.string.isRequired,
  setChallengeListingFilter: PT.func.isRequired,
  terms: PT.arrayOf(PT.shape()),
  toggleCheckpointFeedback: PT.func.isRequired,
  tokenV3: PT.string,
  unregisterFromChallenge: PT.func.isRequired,
  unregistering: PT.bool.isRequired,
};

const mapStateToProps = (state, props) => ({
  authTokens: state.auth,
  challenge: state.challenge.details || {},
  challengeId: Number(props.match.params.challengeId),
  challengesUrl: props.challengesUrl,
  challengeSubtracksMap: state.challengeListing.challengeSubtracksMap,
  checkpointResults: (state.challenge.checkpoints || {}).checkpointResults,
  checkpoints: state.challenge.checkpoints || {},
  communitiesList: state.tcCommunities.list,
  domain: state.domain,
  isLoadingChallenge: Boolean(state.challenge.loadingDetailsForChallengeId),
  isLoadingTerms: _.isEqual(state.terms.loadingTermsForEntity, {
    type: 'challenge',
    id: props.match.params.challengeId,
  }),
  loadingCheckpointResults: state.challenge.loadingCheckpoints,
  loadingResultsForChallengeId: state.challenge.loadingResultsForChallengeId,
  registering: state.challenge.registering,
  results: state.challenge.results,
  resultsLoadedForChallengeId: state.challenge.resultsLoadedForChallengeId,
  selectedTab: state.challenge.selectedTab || 'details',
  terms: state.terms.terms,
  tokenV2: state.auth && state.auth.tokenV2,
  tokenV3: state.auth && state.auth.tokenV3,
  unregistering: state.challenge.unregistering,
});

const mapDispatchToProps = (dispatch) => {
  const ca = communityActions.tcCommunity;
  const a = challengeActions.challenge;
  const t = termsActions.terms;
  return {
    getCommunitiesList: (auth) => {
      const uuid = shortId();
      dispatch(ca.getListInit(uuid));
      dispatch(ca.getListDone(uuid, auth));
    },
    loadChallengeDetails: (tokens, challengeId) => {
      dispatch(a.getDetailsInit(challengeId));
      dispatch(a.getDetailsDone(challengeId, tokens.tokenV3, tokens.tokenV2))
        .then((res) => {
          const ch = res.payload;
          if (ch.track === 'DESIGN') {
            const p = ch.allPhases
              .filter(x => x.phaseType === 'Checkpoint Review');
            if (p.length && p[0].phaseStatus === 'Closed') {
              dispatch(a.fetchCheckpointsInit());
              dispatch(a.fetchCheckpointsDone(tokens.tokenV2, challengeId));
            } else dispatch(a.dropCheckpoints());
          } else dispatch(a.dropCheckpoints());
          if (ch.status === 'COMPLETED') {
            dispatch(a.loadResultsInit(challengeId));
            dispatch(a.loadResultsDone(tokens, challengeId, ch.track.toLowerCase()));
          } else dispatch(a.dropResults());
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
          if (challengeDetails.track === 'DESIGN') {
            const p = challengeDetails.allPhases
              .filter(x => x.phaseType === 'Checkpoint Review');
            if (p.length && p[0].phaseStatus === 'Closed') {
              dispatch(a.fetchCheckpointsDone(tokens.tokenV2, challengeId));
            }
          }
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
    onSelectorClicked: (tab) => {
      dispatch(a.selectTab(tab));
    },
    getSubtracks: () => {
      const cl = challengeListingActions.challengeListing;
      dispatch(cl.getChallengeSubtracksInit());
      dispatch(cl.getChallengeSubtracksDone());
    },
    openTermsModal: (term) => {
      dispatch(t.openTermsModal(term));
    },
  };
};

const ChallengeDetailContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ChallengeDetailPageContainer);

export default ChallengeDetailContainer;
