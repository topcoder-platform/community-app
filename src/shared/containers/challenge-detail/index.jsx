/**
 * This container component load data into its state, and pass them to children via props.
 * Its should have in its state, and properly manage the showDetails set
 * (thus allowing to show/hide detail panels for different submissions),
 * and it should define all necessary handlers to pass to the children.
 */
/* global window */

import _ from 'lodash';
import communityActions from 'actions/tc-communities';
import LoadingPagePlaceholder from 'components/LoadingPagePlaceholder';
import pageActions from 'actions/page';
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
import challengeDetailsActions, { TABS as DETAIL_TABS }
  from 'actions/page/challenge-details';
import { BUCKETS } from 'utils/challenge-listing/buckets';
import { CHALLENGE_PHASE_TYPES, COMPETITION_TRACKS_V3, SUBTRACKS } from 'utils/tc';
import { config, MetaTags } from 'topcoder-react-utils';
import { actions } from 'topcoder-react-lib';

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
import ogImage from '../../../assets/images/og_image.jpg';

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
    if (totalPrize > 2500) return ogBigPrizesChallenge;
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

/**
 * Normalize name convention for subtrack
 * @param subTrack
 * @returns {*} new subtrack
 */
function normalizeNameConventionForSubtrack(subTrack) {
  switch (subTrack) {
    case 'Copilot Posting':
      return 'COPILOT_POSTING';
    case 'Web Design':
      return 'WEB_DESIGNS';
    case 'Logo Design':
      return 'LOGO_DESIGN';
    case 'Banners/Icons':
      return 'BANNERS_OR_ICONS';
    case 'Application Front-End Design':
      return 'APPLICATION_FRONT_END_DESIGN';
    case 'Widget or Mobile Screen Design':
      return 'WIDGET_OR_MOBILE_SCREEN_DESIGN';
    case 'Front-End Flash':
      return 'FRONT_END_FLASH';
    case 'Print/Presentation':
      return 'PRINT_OR_PRESENTATION';
    case 'Wireframes':
      return 'WIREFRAMES';
    case 'Idea Generation':
      return 'IDEA_GENERATION';
    case 'Studio Other':
      return 'STUDIO_OTHER';
    case 'Conceptualization':
      return 'CONCEPTUALIZATION';
    case 'Specification':
      return 'SPECIFICATION';
    case 'Architecture':
      return 'ARCHITECTURE';
    case 'Design':
      return 'DESIGN';
    case 'Development':
      return 'DEVELOPMENT';
    case 'RIA Build Competition':
      return 'RIA_BUILD_COMPETITION';
    case 'UI Prototype Competition':
      return 'UI_PROTOTYPE_COMPETITION';
    case 'Assembly Competition':
      return 'ASSEMBLY_COMPETITION';
    case 'Test Suites':
      return 'TEST_SUITES';
    case 'Test Scenarios':
      return 'TEST_SCENARIOS';
    case 'Content Creation':
      return 'CONTENT_CREATION';
    case 'Bug Hunt':
      return 'BUG_HUNT';
    case 'Design First2Finish':
      return 'DESIGN_FIRST_2_FINISH';
    case 'Code':
      return 'CODE';
    case 'First2Finish':
      return 'FIRST_2_FINISH';
    case 'Marathon Match':
    case 'DEVELOP_MARATHON_MATCH':
      return 'MARATHON_MATCH';
    default:
      return subTrack;
  }
}

/**
 * normalize challenge from server render
 * @param challenge
 */
function normalizeChallenge(challenge) {
  _.set(challenge, 'subTrack', normalizeNameConventionForSubtrack(challenge.subTrack));
  _.set(challenge, 'track', challenge.subTrack === 'MARATHON_MATCH' ? 'DATA_SCIENCE' : challenge.track);
}

// The container component
class ChallengeDetailPageContainer extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      showDeadlineDetail: false,
    };

    this.instanceId = shortId();

    this.onToggleDeadlines = this.onToggleDeadlines.bind(this);
    this.registerForChallenge = this.registerForChallenge.bind(this);
  }

  componentDidMount() {
    const {
      auth,
      challenge,
      communitiesList,
      getCommunitiesList,
      loadChallengeDetails,
      challengeId,
      challengeSubtracksMap,
      getSubtracks,
    } = this.props;

    if (
      (challenge.id !== challengeId)

      /* This extra condition allows to avoid the following subtle problem:
       * if a user, logged in previously, access the challenge details page
       * via a direct URL, the request to the server goes with an expired
       * auth token, which is ignored, but server-side rendering still pulls
       * the public details of the challenge from the API and they are
       * injected into the served page. At the frontend side, due to the
       * async loading of the JS chunk, the token can be refreshed before
       * creation of this container, thus the container will be created
       * with the new auth token, not able to detect that the token was
       * updated, and thus the challenge details injected into the page
       * during the server side rendering were fetched without it and
       * should be reloaded to get protected portion of challenge details.
       * This condition forces front-end reloading of the challenge details
       * if auth tokens are known at the moment of container creation, but
       * currently available challenge details have been fetched without
       * authentication. */
      || (auth.tokenV2 && auth.tokenV3
        && !challenge.fetchedWithAuth)

    ) {
      loadChallengeDetails(auth, challengeId);
    }

    if (!communitiesList.loadingUuid
      && (Date.now() - communitiesList.timestamp > 10 * MIN)) {
      getCommunitiesList(auth);
    }

    if (_.isEmpty(challengeSubtracksMap)) {
      getSubtracks();
    }
  }

  componentWillReceiveProps(nextProps) {
    const {
      challengeId,
      reloadChallengeDetails,
    } = this.props;
    const userId = _.get(this, 'props.auth.user.userId');
    const nextUserId = _.get(nextProps, 'auth.user.userId');
    if (userId !== nextUserId) {
      nextProps.getCommunitiesList(nextProps.auth);
      reloadChallengeDetails(nextProps.auth, challengeId);
    }
  }

  onToggleDeadlines(event) {
    event.preventDefault();
    const { showDeadlineDetail } = this.state;
    this.setState({
      showDeadlineDetail: !showDeadlineDetail,
    });
  }

  registerForChallenge() {
    const {
      auth,
      challengeId,
      communityId,
      openTermsModal,
      registerForChallenge,
      terms,
    } = this.props;
    if (!auth.tokenV3) {
      const utmSource = communityId || 'community-app-main';
      window.location.href = `${config.URL.AUTH}/member?retUrl=${encodeURIComponent(window.location.href)}&utm_source=${utmSource}`;
    } else if (_.every(terms, 'agreed')) {
      registerForChallenge(auth, challengeId);
    } else {
      openTermsModal();
    }
  }

  render() {
    const {
      auth,
      challenge,
      challengeId,
      challengeSubtracksMap,
      challengesUrl,
      checkpointResults,
      checkpointResultsUi,
      checkpoints,
      communitiesList,
      isLoadingChallenge,
      isLoadingTerms,
      onSelectorClicked,
      registerForChallenge,
      registering,
      results,
      resultsLoadedForChallengeId,
      savingChallenge,
      selectedTab,
      setChallengeListingFilter,
      setSpecsTabState,
      specsTabState,
      terms,
      toggleCheckpointFeedback,
      unregisterFromChallenge,
      unregistering,
      updateChallenge,
    } = this.props;

    const {
      showDeadlineDetail,
    } = this.state;

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

    const results2 = resultsLoadedForChallengeId === _.toString(challengeId)
      ? results : null;

    const isEmpty = _.isEmpty(challenge);
    const isLegacyMM = challenge.subTrack === 'MARATHON_MATCH' && Boolean(challenge.roundId);

    const hasRegistered = isRegistered(
      challenge.userDetails,
      challenge.registrants,
      (auth.user || {}).handle,
    );

    if (isLoadingChallenge || isLoadingTerms) {
      return <LoadingPagePlaceholder />;
    }

    let winners = challenge.winners || [];
    winners = winners.filter(w => !w.type || w.type === 'final');

    /* normalize challenge from server render */
    normalizeChallenge(challenge);
    return (
      <div styleName="outer-container">
        <div styleName="challenge-detail-container">
          { Boolean(isEmpty) && (
            <div styleName="page">
              Challenge #
              {challengeId}
              {' '}
does not exist!
            </div>
          )}
          {
            !isEmpty
            && (
            <MetaTags
              description={description.slice(0, 155)}
              image={getOgImage(challenge)}
              siteName="Topcoder"
              socialDescription={description.slice(0, 200)}
              socialTitle={`${prizesStr}${title}`}
              title={title}
            />
            )
          }
          {
            !isEmpty
            && (
            <ChallengeHeader
              challenge={challenge}
              challengeId={challengeId}
              challengesUrl={challengesUrl}
              numWinners={!isLegacyMM && winners.length}
              showDeadlineDetail={showDeadlineDetail}
              onToggleDeadlines={this.onToggleDeadlines}
              onSelectorClicked={onSelectorClicked}
              registerForChallenge={this.registerForChallenge}
              registering={registering}
              selectedView={selectedTab}
              setChallengeListingFilter={setChallengeListingFilter}
              unregisterFromChallenge={() => unregisterFromChallenge(auth, challengeId)
              }
              unregistering={unregistering}
              checkpoints={checkpoints}
              hasRegistered={hasRegistered}
              challengeSubtracksMap={challengeSubtracksMap}
            />
            )
          }
          {
            !isEmpty && selectedTab === DETAIL_TABS.DETAILS
            && (
            <ChallengeDetailsView
              challenge={challenge}
              challengesUrl={challengesUrl}
              communitiesList={communitiesList.data}
              introduction={challenge.introduction}
              detailedRequirements={challenge.detailedRequirements}
              terms={terms}
              hasRegistered={hasRegistered}
              savingChallenge={savingChallenge}
              setSpecsTabState={setSpecsTabState}
              specsTabState={specsTabState}
              updateChallenge={x => updateChallenge(x, auth.tokenV3)}
            />
            )
          }
          {
            !isEmpty && selectedTab === DETAIL_TABS.REGISTRANTS
            && (
            <Registrants
              challenge={challenge}
              checkpointResults={
                _.merge(
                  checkpointResults,
                  checkpointResultsUi,
                )
              }
              results={results2}
            />
            )
          }
          {
            !isEmpty && selectedTab === DETAIL_TABS.CHECKPOINTS
            && (
            <ChallengeCheckpoints
              checkpoints={checkpoints}
              toggleCheckpointFeedback={toggleCheckpointFeedback}
            />
            )
          }
          {
            !isEmpty && selectedTab === DETAIL_TABS.SUBMISSIONS
            && <Submissions challenge={challenge} />
          }
          {
            !isEmpty && !isLegacyMM && selectedTab === DETAIL_TABS.WINNERS
            && (
            <Winners
              winners={winners}
              pointPrizes={challenge.pointPrizes}
              prizes={challenge.prizes}
              submissions={challenge.submissions}
              viewable={challenge.submissionsViewable === 'true'}
              isDesign={challenge.track.toLowerCase() === 'design'}
            />
            )
          }
        </div>
        <Terms
          defaultTitle="Challenge Prerequisites"
          entity={{ type: 'challenge', id: challengeId.toString() }}
          instanceId={this.instanceId}
          description="You are seeing these Terms & Conditions because you have registered to a challenge and you have to respect the terms below in order to be able to submit."
          register={() => {
            registerForChallenge(auth, challengeId);
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
  communityId: null,
  isLoadingChallenge: false,
  isLoadingTerms: false,
  // loadingCheckpointResults: false,
  results: null,
  terms: [],
};

ChallengeDetailPageContainer.propTypes = {
  auth: PT.shape().isRequired,
  challenge: PT.shape().isRequired,
  challengeId: PT.number.isRequired,
  challengeSubtracksMap: PT.shape().isRequired,
  challengesUrl: PT.string,
  checkpointResults: PT.arrayOf(PT.shape()),
  checkpointResultsUi: PT.shape().isRequired,
  checkpoints: PT.shape(),
  communityId: PT.string,
  communitiesList: PT.shape({
    data: PT.arrayOf(PT.object).isRequired,
    loadingUuid: PT.string.isRequired,
    timestamp: PT.number.isRequired,
  }).isRequired,
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
  savingChallenge: PT.bool.isRequired,
  selectedTab: PT.string.isRequired,
  setChallengeListingFilter: PT.func.isRequired,
  setSpecsTabState: PT.func.isRequired,
  specsTabState: PT.string.isRequired,
  terms: PT.arrayOf(PT.shape()),
  toggleCheckpointFeedback: PT.func.isRequired,
  unregisterFromChallenge: PT.func.isRequired,
  unregistering: PT.bool.isRequired,
  updateChallenge: PT.func.isRequired,
};

function mapStateToProps(state, props) {
  return {
    auth: state.auth,
    challenge: state.challenge.details || {},
    challengeId: Number(props.match.params.challengeId),
    challengesUrl: props.challengesUrl,
    challengeSubtracksMap: state.challengeListing.challengeSubtracksMap,
    checkpointResults: (state.challenge.checkpoints || {}).checkpointResults,
    checkpointResultsUi: state.page.challengeDetails.checkpoints,
    checkpoints: state.challenge.checkpoints || {},
    communityId: props.communityId,
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
    savingChallenge: Boolean(state.challenge.updatingChallengeUuid),

    /* TODO: Carefully move default value to defaultProps. */
    selectedTab: state.page.challengeDetails.selectedTab || 'details',

    specsTabState: state.page.challengeDetails.specsTabState,
    terms: state.terms.terms,
    unregistering: state.challenge.unregistering,
  };
}

const mapDispatchToProps = (dispatch) => {
  const ca = communityActions.tcCommunity;
  return {
    getCommunitiesList: (auth) => {
      const uuid = shortId();
      dispatch(ca.getListInit(uuid));
      dispatch(ca.getListDone(uuid, auth));
    },
    loadChallengeDetails: (tokens, challengeId) => {
      const a = actions.challenge;
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
      const a = actions.challenge;
      dispatch(a.registerInit());
      dispatch(a.registerDone(auth, challengeId));
    },
    reloadChallengeDetails: (tokens, challengeId) => {
      const a = actions.challenge;
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
    setSpecsTabState: state => dispatch(pageActions.page.challengeDetails.setSpecsTabState(state)),
    unregisterFromChallenge: (auth, challengeId) => {
      const a = actions.challenge;
      dispatch(a.unregisterInit());
      dispatch(a.unregisterDone(auth, challengeId));
    },
    loadResults: (auth, challengeId, type) => {
      const a = actions.challenge;
      dispatch(a.loadResultsInit(challengeId));
      dispatch(a.loadResultsDone(auth, challengeId, type));
    },
    fetchCheckpoints: (tokens, challengeId) => {
      const a = actions.challenge;
      dispatch(a.fetchCheckpointsInit());
      dispatch(a.fetchCheckpointsDone(tokens.tokenV2, challengeId));
    },
    toggleCheckpointFeedback: (id, open) => {
      const {
        toggleCheckpointFeedback,
      } = challengeDetailsActions.page.challengeDetails;
      dispatch(toggleCheckpointFeedback(id, open));
    },
    onSelectorClicked: (tab) => {
      const { selectTab } = challengeDetailsActions.page.challengeDetails;
      dispatch(selectTab(tab));
    },
    getSubtracks: () => {
      const cl = challengeListingActions.challengeListing;
      dispatch(cl.getChallengeSubtracksInit());
      dispatch(cl.getChallengeSubtracksDone());
    },
    openTermsModal: (term) => {
      dispatch(termsActions.terms.openTermsModal('ANY', term));
    },
    updateChallenge: (challenge, tokenV3) => {
      const uuid = shortId();
      const a = actions.challenge;
      dispatch(a.updateChallengeInit(uuid));
      dispatch(a.updateChallengeDone(uuid, challenge, tokenV3));
    },
  };
};

const ChallengeDetailContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ChallengeDetailPageContainer);

export default ChallengeDetailContainer;
