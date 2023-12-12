/**
 * This container component load data into its state, and pass them to children via props.
 * Its should have in its state, and properly manage the showDetails set
 * (thus allowing to show/hide detail panels for different submissions),
 * and it should define all necessary handlers to pass to the children.
 */
/* global window */

import _ from 'lodash';
import communityActions from 'actions/tc-communities';
import { isMM as checkIsMM, isRDM as checkIsRDM } from 'utils/challenge';
import LoadingPagePlaceholder from 'components/LoadingPagePlaceholder';
import pageActions from 'actions/page';
import ChallengeHeader from 'components/challenge-detail/Header';
import challengeListingActions from 'actions/challenge-listing';
import challengeListingSidebarActions from 'actions/challenge-listing/sidebar';
import challengeListingFilterPanelActions from 'actions/challenge-listing/filter-panel';
import Registrants from 'components/challenge-detail/Registrants';
import shortId from 'shortid';
import Submissions from 'components/challenge-detail/Submissions';
import MySubmissions from 'components/challenge-detail/MySubmissions';
import Winners from 'components/challenge-detail/Winners';
import MMDashboardGraph from 'components/challenge-detail/MMDashboard/Graph';
import ChallengeDetailsView from 'components/challenge-detail/Specification';
import RecommendedThriveArticles from 'components/challenge-detail/ThriveArticles';
import LoadingIndicator from 'components/LoadingIndicator';
// eslint-disable-next-line max-len
// import RecommendedActiveChallenges from 'components/challenge-detail/RecommendedActiveChallenges';
import Terms from 'containers/Terms';
import SecurityReminder from 'components/SecurityReminder';
import termsActions from 'actions/terms';
import ChallengeCheckpoints from 'components/challenge-detail/Checkpoints';
import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import challengeDetailsActions, { TABS as DETAIL_TABS }
  from 'actions/page/challenge-details';
import { BUCKETS } from 'utils/challenge-listing/buckets';
import {
  CHALLENGE_PHASE_TYPES,
  COMPETITION_TRACKS,
  COMPETITION_TRACKS_V3,
  SUBTRACKS,
  CHALLENGE_STATUS,
} from 'utils/tc';
import { config } from 'topcoder-react-utils';
import MetaTags from 'components/MetaTags';
import { actions } from 'topcoder-react-lib';
import { getService } from 'services/contentful';
// import {
// getDisplayRecommendedChallenges,
// getRecommendedTags,
// } from 'utils/challenge-detail/helper';

import ogUiDesign from
  '../../../assets/images/open-graph/challenges/02-Design-Preview.png';
import ogFirst2FinishDEV from
  '../../../assets/images/open-graph/challenges/Development-First2Finish.png';
import ogFirst2FinishDESIGN from
  '../../../assets/images/open-graph/challenges/Design-First2Finish.png';
import ogFirst2FinishQA from
  '../../../assets/images/open-graph/challenges/QA-First2Finish.png';
import ogDEVTask from
  '../../../assets/images/open-graph/challenges/Development-Task.png';
import ogDESIGNTask from
  '../../../assets/images/open-graph/challenges/Design-Task.png';
import ogQATask from
  '../../../assets/images/open-graph/challenges/QA-Task.png';
import ogDevelopment from
  '../../../assets/images/open-graph/challenges/03-Development.png';
import ogBigPrizesChallenge from
  '../../../assets/images/open-graph/challenges/06-Big-Prize.png';
import ogQAChallenge from
  '../../../assets/images/open-graph/challenges/05-QA.png';
import ogDSChallenge from
  '../../../assets/images/open-graph/challenges/04-Data-Science.png';
import ogMMChallenge from
  '../../../assets/images/open-graph/challenges/MM-Challenge.png';

/* A fallback image, just in case we missed some corner case. */
import ogImage from
  '../../../assets/images/social.png';

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
  const { legacy } = challenge;
  const { subTrack } = legacy;
  if (challenge.name.startsWith('LUX -')) return ogBigPrizesChallenge;
  if (challenge.name.startsWith('RUX -')) return ogBigPrizesChallenge;
  if (challenge.prizes) {
    const totalPrize = challenge.prizes.reduce((p, sum) => p + sum, 0);
    if (totalPrize > 2500) return ogBigPrizesChallenge;
  }

  switch (subTrack) {
    case SUBTRACKS.FIRST_2_FINISH:
      switch (challenge.track) {
        case COMPETITION_TRACKS_V3.DEVELOP: return challenge.type === 'Task' ? ogDEVTask : ogFirst2FinishDEV;
        case COMPETITION_TRACKS_V3.QA: return challenge.type === 'Task' ? ogQATask : ogFirst2FinishQA;
        default: return ogFirst2FinishDEV;
      }

    case SUBTRACKS.DESIGN_FIRST_2_FINISH:
      switch (challenge.track) {
        case COMPETITION_TRACKS_V3.DESIGN: return challenge.type === 'Task' ? ogDESIGNTask : ogFirst2FinishDESIGN;
        default: return ogUiDesign;
      }

    case SUBTRACKS.UI_PROTOTYPE_COMPETITION: {
      const submission = (challenge.phases || [])
        .find(p => p.name === CHALLENGE_PHASE_TYPES.SUBMISSION);
      if (submission) {
        if (submission.duration < 1.1 * DAY) return ogDevelopment;
        if (submission.duration < 2.1 * DAY) return ogDevelopment;
      }
      return ogDevelopment;
    }
    case SUBTRACKS.WIREFRAMES: return ogUiDesign;
    case SUBTRACKS.QA:
    case SUBTRACKS.TEST_SUITES:
      return ogQAChallenge;
    case SUBTRACKS.MM:
      if (challenge.tags && challenge.tags.indexOf(COMPETITION_TRACKS_V3.DS) !== -1) {
        return ogDSChallenge;
      }
      return ogMMChallenge;
    default:
  }

  switch (challenge.track) {
    case COMPETITION_TRACKS_V3.DEVELOP: return ogDevelopment;
    case COMPETITION_TRACKS_V3.DESIGN: return challenge.type === 'Task' ? ogDESIGNTask : ogUiDesign;
    case COMPETITION_TRACKS_V3.DS: return ogDSChallenge;
    case COMPETITION_TRACKS_V3.QA: return challenge.type === 'Task' ? ogQATask : ogQAChallenge;
    default: return ogImage;
  }
}

// The container component
class ChallengeDetailPageContainer extends React.Component {
  constructor(props, context) {
    super(props, context);

    // create a service to work with Contentful
    this.apiService = getService({ spaceName: 'EDU' });
    this.state = {
      thriveArticles: [],
      showDeadlineDetail: false,
      registrantsSort: {
        field: '',
        sort: '',
      },
      submissionsSort: {
        field: '',
        sort: '',
      },
      mySubmissionsSort: {
        field: '',
        sort: '',
      },
      notFoundCountryFlagUrl: {},
      viewAsTable: false,
      showSecurityReminder: false,
    };

    this.instanceId = shortId();

    this.onToggleDeadlines = this.onToggleDeadlines.bind(this);
    this.registerForChallenge = this.registerForChallenge.bind(this);
  }

  componentDidMount() {
    const {
      auth,
      challenge,
      getCommunitiesList,
      loadChallengeDetails,
      fetchChallengeStatistics,
      challengeId,
      challengeTypesMap,
      getTypes,
      allCountries,
      reviewTypes,
      getAllCountries,
      getReviewTypes,
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

    fetchChallengeStatistics(auth, challengeId);

    if (!allCountries.length) {
      getAllCountries(auth.tokenV3);
    }

    getCommunitiesList(auth);

    if (_.isEmpty(challengeTypesMap)) {
      getTypes();
    }

    if (!reviewTypes.length) {
      getReviewTypes(auth.tokenV3);
    }
  }

  componentWillReceiveProps(nextProps) {
    const {
      challengeId,
      reloadChallengeDetails,
      // getAllRecommendedChallenges,
      // recommendedChallenges,
      // auth,
      challenge,
      // loadingRecommendedChallengesUUID,
      history,
      selectedTab,
      onSelectorClicked,
    } = this.props;

    if (challenge.isLegacyChallenge && !history.location.pathname.includes(challenge.id)) {
      history.location.pathname = `/challenges/${challenge.id}`; // eslint-disable-line no-param-reassign
      history.push(history.location.pathname, history.state);
    }

    if (!checkIsMM(challenge) && COMPETITION_TRACKS_V3.DS !== challenge.track
      && selectedTab === DETAIL_TABS.MM_DASHBOARD) {
      onSelectorClicked(DETAIL_TABS.DETAILS);
    }

    // const recommendedTechnology = getRecommendedTags(challenge);
    // if (
    //   challenge
    //   && challenge.id === challengeId
    //   && !loadingRecommendedChallengesUUID
    //   && (
    //     !recommendedChallenges[recommendedTechnology]
    //     || (
    //       Date.now() - recommendedChallenges[recommendedTechnology].lastUpdateOfActiveChallenges
    //       > 10 * MIN
    //     )
    //   )
    // ) {
    //   getAllRecommendedChallenges(auth.tokenV3, recommendedTechnology);
    // }

    const { thriveArticles } = this.state;
    const userId = _.get(this, 'props.auth.user.userId');
    const nextUserId = _.get(nextProps, 'auth.user.userId');

    if (userId !== nextUserId) {
      nextProps.getCommunitiesList(nextProps.auth);
      reloadChallengeDetails(nextProps.auth, challengeId);
    }

    const { track } = nextProps.challenge;
    if (track !== COMPETITION_TRACKS.DES && thriveArticles.length === 0) {
      // filter all tags with value 'Other'
      const tags = _.filter(nextProps.challenge.tags, tag => tag !== 'Other');
      if (tags.length > 0) {
        this.apiService.getEDUContent({
          limit: 3,
          phrase: tags[0],
          types: ['Article'],
        }).then((content) => {
        // format image file data
          _.forEach(content.Article.items, (item) => {
            // eslint-disable-next-line max-len
            const asset = _.find(content.Article.includes.Asset, a => item.fields.featuredImage !== null && a.sys.id === item.fields.featuredImage.sys.id);
            if (asset) _.assign(item.fields.featuredImage, { file: asset.fields.file });
          });
          this.setState({
            thriveArticles: content.Article.items,
          });
        });
      }
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
      communityId,
    } = this.props;
    if (!auth.tokenV3) {
      const utmSource = communityId || 'community-app-main';
      window.location.href = `${config.URL.AUTH}/member?retUrl=${encodeURIComponent(window.location.href)}&utm_source=${utmSource}&regSource=challenges`;
    } else {
      // Show security reminder to all registrants
      this.setState({
        showSecurityReminder: true,
      });
    }
  }

  render() {
    const {
      auth,
      challenge,
      challengeTypes,
      challengeId,
      challengeTypesMap,
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
      isMenuOpened,
      loadMMSubmissions,
      mmSubmissions,
      loadingMMSubmissionsForChallengeId,
      isLoadingSubmissionInformation,
      submissionInformation,
      loadSubmissionInformation,
      // selectChallengeDetailsTab,
      // prizeMode,
      // recommendedChallenges,
      // expandedTags,
      // expandTag,
      mySubmissions,
      reviewTypes,
      openForRegistrationChallenges,
      statisticsData,
      openTermsModal,
    } = this.props;

    // const displayRecommendedChallenges = getDisplayRecommendedChallenges(
    //   challenge,
    //   recommendedChallenges,
    //   auth,
    // );

    const {
      thriveArticles,
      showDeadlineDetail,
      registrantsSort,
      submissionsSort,
      notFoundCountryFlagUrl,
      mySubmissionsSort,
      viewAsTable,
      showSecurityReminder,
    } = this.state;

    const {
      legacy,
      legacyId,
      status,
      phases,
      metadata,
    } = challenge;

    let { track } = legacy || {};

    if (!track) {
      /* eslint-disable prefer-destructuring */
      track = challenge.track || '';
    }
    const submissionsViewable = _.find(metadata, { type: 'submissionsViewable' });

    const isLoggedIn = !_.isEmpty(auth.tokenV3);

    const { prizeSets } = challenge;
    let challengePrizes = [];
    const placementPrizes = _.find(prizeSets, { type: 'placement' });
    if (placementPrizes) {
      challengePrizes = _.filter(placementPrizes.prizes, p => p.value > 0);
    }

    /* Generation of data for SEO meta-tags. Default to use $ if no prizes are accessible */
    let prizesStr = '';
    if (!_.isEmpty(challengePrizes) && challengePrizes[0].type && challengePrizes[0].type === 'USD') {
      prizesStr = challengePrizes.map(p => `$${p.value}`).join('/');
      prizesStr = `[${prizesStr}] - `;
    } else if (!_.isEmpty(challengePrizes) && challengePrizes[0].type && challengePrizes[0].type === 'POINT') {
      prizesStr = challengePrizes.map(p => `${p.value}pts`).join('/');
      prizesStr = `[${prizesStr}] - `;
    } else {
      prizesStr = challengePrizes.map(p => `$${p.value}`).join('/');
      prizesStr = `[${prizesStr}] - `;
    }

    const title = 'Topcoder Challenge | Topcoder Community | Topcoder';
    const description = 'Browse the challenges currently available on Topcoder. Search by type of challenge, then find those of interest to register for and compete in today.';

    const results2 = resultsLoadedForChallengeId === _.toString(challengeId)
      ? results : null;

    const isEmpty = _.isEmpty(challenge);
    const isMM = checkIsMM(challenge);
    const isRDM = checkIsRDM(challenge);
    const isLegacyMM = isMM && Boolean(challenge.roundId);

    if (isLoadingChallenge || isLoadingTerms) {
      return <LoadingPagePlaceholder />;
    }

    let winners = challenge.winners || [];
    if (challenge.type !== 'Task') {
      winners = winners.filter(w => !w.type || w.type === 'final');
    }

    let hasFirstPlacement = false;
    if (!_.isEmpty(winners)) {
      const userHandle = (auth.user || {}).handle;
      hasFirstPlacement = _.some(winners, { placement: 1, handle: userHandle });
    }

    const submissionEnded = status === CHALLENGE_STATUS.COMPLETED
    || (!_.some(phases, { name: 'Submission', isOpen: true })
      && !_.some(phases, { name: 'Checkpoint Submission', isOpen: true }));

    return (
      <div styleName="outer-container">
        <div styleName="challenge-detail-container" role="main">
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
                description={description}
                image={getOgImage(challenge)}
                siteName="Topcoder"
                socialDescription={description}
                socialTitle={`${prizesStr}${challenge.name}`}
                title={title}
              />
            )
          }
          {
            !isEmpty
            && (
            <ChallengeHeader
              isLoggedIn={isLoggedIn}
              challenge={challenge}
              challengeId={challengeId}
              challengeTypes={challengeTypes}
              challengesUrl={challengesUrl}
              numWinners={isLegacyMM ? 0 : winners.length}
              showDeadlineDetail={showDeadlineDetail}
              onToggleDeadlines={this.onToggleDeadlines}
              onSelectorClicked={onSelectorClicked}
              registerForChallenge={this.registerForChallenge}
              registering={registering}
              selectedView={selectedTab}
              // hasRecommendedChallenges={displayRecommendedChallenges.length > 0}
              hasThriveArticles={thriveArticles.length > 0}
              setChallengeListingFilter={setChallengeListingFilter}
              unregisterFromChallenge={() => unregisterFromChallenge(auth, challengeId)
              }
              unregistering={unregistering}
              checkpoints={checkpoints}
              hasRegistered={challenge.isRegistered}
              hasFirstPlacement={hasFirstPlacement}
              challengeTypesMap={challengeTypesMap}
              isMenuOpened={isMenuOpened}
              submissionEnded={submissionEnded}
              mySubmissions={challenge.isRegistered ? mySubmissions : []}
              openForRegistrationChallenges={openForRegistrationChallenges}
              viewAsTable={viewAsTable && isMM}
              onSort={(currenctSelected, sort) => {
                if (currenctSelected === 'submissions') {
                  this.setState({ submissionsSort: sort });
                } else {
                  this.setState({ registrantsSort: sort });
                }
              }}
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
                description={challenge.name}
                detailedRequirements={challenge.description}
                terms={terms}
                hasRegistered={challenge.isRegistered}
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
                registrants={challenge.registrants}
                checkpointResults={
                  _.merge(
                    checkpointResults,
                    checkpointResultsUi,
                  )
                }
                results={results2}
                registrantsSort={registrantsSort}
                notFoundCountryFlagUrl={notFoundCountryFlagUrl}
                onGetFlagImageFail={(countryInfo) => {
                  notFoundCountryFlagUrl[countryInfo.countryCode] = true;
                  this.setState({ notFoundCountryFlagUrl });
                }}
                onSortChange={sort => this.setState({ registrantsSort: sort })}
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
            !isEmpty && isLoggedIn && selectedTab === DETAIL_TABS.SUBMISSIONS
            && (
              <Submissions
                challenge={challenge}
                submissions={challenge.submissions}
                loadingMMSubmissionsForChallengeId={loadingMMSubmissionsForChallengeId}
                mmSubmissions={mmSubmissions}
                loadMMSubmissions={loadMMSubmissions}
                auth={auth}
                isLoadingSubmissionInformation={isLoadingSubmissionInformation}
                submssionInformation={submissionInformation}
                loadSubmissionInformation={loadSubmissionInformation}
                submissionsSort={submissionsSort}
                notFoundCountryFlagUrl={notFoundCountryFlagUrl}
                onGetFlagImageFail={(countryInfo) => {
                  notFoundCountryFlagUrl[countryInfo.countryCode] = true;
                  this.setState({ notFoundCountryFlagUrl });
                }}
                onSortChange={(sort) => {
                  this.setState({ submissionsSort: sort });
                }}
                hasRegistered={challenge.isRegistered}
                unregistering={unregistering}
                isLegacyMM={isLegacyMM}
                submissionEnded={submissionEnded}
                challengesUrl={challengesUrl}
                viewAsTable={viewAsTable && isMM}
                setViewAsTable={value => this.setState({ viewAsTable: value })}
                numWinners={isLegacyMM ? 0 : winners.length}
              />
            )
          }
          {
            isMM && !isEmpty && selectedTab === DETAIL_TABS.MY_SUBMISSIONS
            && (
              <MySubmissions
                challengesUrl={challengesUrl}
                challenge={challenge}
                hasRegistered={challenge.isRegistered}
                unregistering={unregistering}
                submissionEnded={submissionEnded}
                isMM={isMM}
                isLegacyMM={isLegacyMM}
                loadingMMSubmissionsForChallengeId={loadingMMSubmissionsForChallengeId}
                auth={auth}
                loadMMSubmissions={loadMMSubmissions}
                mySubmissions={challenge.isRegistered ? mySubmissions : []}
                reviewTypes={reviewTypes}
                submissionsSort={mySubmissionsSort}
                onSortChange={sort => this.setState({ mySubmissionsSort: sort })}
              />
            )
          }
          {
            !isEmpty && selectedTab === DETAIL_TABS.MM_DASHBOARD
            && (!statisticsData || statisticsData.length === 0)
            && (
              <div styleName="page">
                {
                  !statisticsData ? <LoadingIndicator /> : 'Dashboard data is not available!'
                }
              </div>
            )
          }
          {
            !isEmpty && selectedTab === DETAIL_TABS.MM_DASHBOARD
            && statisticsData && statisticsData.length > 0
            && (
              <MMDashboardGraph
                statisticsData={statisticsData}
                baseline={_.get(_.find(_.get(challenge, 'metadata', []), meta => meta.name === 'baseline'), 'value', 0)}
                awardLine={_.get(_.find(_.get(challenge, 'metadata', []), meta => meta.name === 'awardLine'), 'value', 0)}
              />
            )
          }
          {
            !isEmpty && !isLegacyMM && selectedTab === DETAIL_TABS.WINNERS
            && (
              <Winners
                winners={winners}
                prizes={challengePrizes}
                viewable={submissionsViewable ? submissionsViewable.value === 'true' : false}
                submissions={challenge.submissions}
                isDesign={track.toLowerCase() === 'design'}
                isMM={isMM}
                isRDM={isRDM}
                isLoggedIn={isLoggedIn}
                auth={auth}
              />
            )
          }
        </div>
        {legacyId && (
          <Terms
            defaultTitle="Challenge Prerequisites"
            entity={{ type: 'challenge', id: challengeId.toString(), terms: challenge.terms }}
            instanceId={this.instanceId}
            description="You are seeing these Terms & Conditions because you have registered to a challenge and you have to respect the terms below in order to be able to submit."
            register={() => {
              registerForChallenge(auth, challengeId);
            }}
          />
        )}
        {showSecurityReminder && (
          <SecurityReminder
            onCancel={() => this.setState({ showSecurityReminder: false })}
            onOk={() => {
              this.setState({ showSecurityReminder: false });
              if (_.every(terms, 'agreed')) {
                registerForChallenge(auth, challengeId);
              } else {
                openTermsModal();
              }
            }}
          />
        )}
        {/* {
        !isEmpty && displayRecommendedChallenges.length ? (
          <RecommendedActiveChallenges
            challenges={displayRecommendedChallenges}
            challengeTypes={challengeTypes}
            prizeMode={prizeMode}
            challengesUrl={challengesUrl}
            selectChallengeDetailsTab={selectChallengeDetailsTab}
            auth={auth}
            expandedTags={expandedTags}
            expandTag={expandTag}
            isLoggedIn={isLoggedIn}
          />
        ) : null
        } */}
        {
        !isEmpty && thriveArticles.length ? (
          <RecommendedThriveArticles articles={thriveArticles} />
        ) : null
        }
      </div>

    );
  }
}

ChallengeDetailPageContainer.defaultProps = {
  challengesUrl: '/challenges',
  challengeTypes: [],
  checkpointResults: null,
  checkpoints: {},
  communityId: null,
  isLoadingChallenge: false,
  isLoadingTerms: false,
  // loadingCheckpointResults: false,
  results: null,
  terms: [],
  allCountries: [],
  reviewTypes: [],
  isMenuOpened: false,
  loadingMMSubmissionsForChallengeId: '',
  mmSubmissions: [],
  mySubmissions: [],
  isLoadingSubmissionInformation: false,
  submissionInformation: null,
  // prizeMode: 'money-usd',
  statisticsData: null,
};

ChallengeDetailPageContainer.propTypes = {
  auth: PT.shape().isRequired,
  challenge: PT.shape().isRequired,
  challengeTypes: PT.arrayOf(PT.shape()),
  challengeId: PT.string.isRequired,
  challengeTypesMap: PT.shape().isRequired,
  challengesUrl: PT.string,
  checkpointResults: PT.arrayOf(PT.shape()),
  checkpointResultsUi: PT.shape().isRequired,
  checkpoints: PT.shape(),
  // recommendedChallenges: PT.shape().isRequired,
  communityId: PT.string,
  communitiesList: PT.shape({
    data: PT.arrayOf(PT.object).isRequired,
    loadingUuid: PT.string.isRequired,
    timestamp: PT.number.isRequired,
  }).isRequired,
  getCommunitiesList: PT.func.isRequired,
  getTypes: PT.func.isRequired,
  isLoadingChallenge: PT.bool,
  isLoadingTerms: PT.bool,
  loadChallengeDetails: PT.func.isRequired,
  fetchChallengeStatistics: PT.func.isRequired,
  getAllCountries: PT.func.isRequired,
  getReviewTypes: PT.func.isRequired,
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
  allCountries: PT.arrayOf(PT.shape()),
  reviewTypes: PT.arrayOf(PT.shape()),
  mySubmissions: PT.arrayOf(PT.shape()),
  toggleCheckpointFeedback: PT.func.isRequired,
  unregisterFromChallenge: PT.func.isRequired,
  unregistering: PT.bool.isRequired,
  updateChallenge: PT.func.isRequired,
  isMenuOpened: PT.bool,
  loadingMMSubmissionsForChallengeId: PT.string,
  mmSubmissions: PT.arrayOf(PT.shape()),
  loadMMSubmissions: PT.func.isRequired,
  isLoadingSubmissionInformation: PT.bool,
  submissionInformation: PT.shape(),
  loadSubmissionInformation: PT.func.isRequired,
  // selectChallengeDetailsTab: PT.func.isRequired,
  // getAllRecommendedChallenges: PT.func.isRequired,
  // prizeMode: PT.string,
  // expandedTags: PT.arrayOf(PT.number).isRequired,
  // expandTag: PT.func.isRequired,
  // loadingRecommendedChallengesUUID: PT.string.isRequired,
  history: PT.shape().isRequired,
  openForRegistrationChallenges: PT.shape().isRequired,
  statisticsData: PT.arrayOf(PT.shape()),
};

function mapStateToProps(state, props) {
  const cl = state.challengeListing;
  const { lookup: { allCountries, reviewTypes } } = state;
  let { challenge: { mmSubmissions } } = state;
  const { auth } = state;
  const challenge = state.challenge.details || {};
  let mySubmissions = [];
  if (challenge.registrants) {
    challenge.registrants = challenge.registrants.map(registrant => ({
      ...registrant,
      countryInfo: _.find(allCountries, { countryCode: registrant.countryCode }),
    }));

    if (challenge.submissions) {
      challenge.submissions = challenge.submissions.map(submission => ({
        ...submission,
        registrant: _.find(challenge.registrants, r => (`${r.memberId}` === `${submission.memberId}`)),
      }));
    }

    if (!_.isEmpty(mmSubmissions)) {
      mmSubmissions = mmSubmissions.map((submission) => {
        let registrant;
        const { memberId } = submission;
        let member = memberId;
        if (`${auth.user.userId}` === `${memberId}`) {
          mySubmissions = submission.submissions || [];
          mySubmissions.forEach((mySubmission, index) => {
            mySubmissions[index].id = mySubmissions.length - index;
          });
        }
        const submissionDetail = _.find(challenge.submissions, s => (`${s.memberId}` === `${submission.memberId}`));

        if (submissionDetail) {
          member = submissionDetail.createdBy;
          ({ registrant } = submissionDetail);
        }

        if (!registrant) {
          registrant = _.find(challenge.registrants, r => `${r.memberId}` === `${memberId}`);
        }

        if (registrant) {
          member = registrant.memberHandle;
        }

        return ({
          ...submission,
          registrant,
          member,
        });
      });
    } else {
      mySubmissions = _.filter(challenge.submissions, s => (`${s.memberId}` === `${auth.user.userId}`));
    }
  }
  const { page: { challengeDetails: { feedbackOpen } } } = state;
  const checkpoints = state.challenge.checkpoints || {};
  if (feedbackOpen.id && checkpoints.checkpointResults) {
    checkpoints.checkpointResults = checkpoints.checkpointResults.map(result => ({
      ...result,
      expanded: result.submissionId === feedbackOpen.id ? feedbackOpen.open : result.expanded,
    }));
  }
  return {
    auth: state.auth,
    challenge,
    challengeTypes: cl.challengeTypes,
    // recommendedChallenges: cl.recommendedChallenges,
    // loadingRecommendedChallengesUUID: cl.loadingRecommendedChallengesUUID,
    expandedTags: cl.expandedTags,
    challengeId: String(props.match.params.challengeId),
    challengesUrl: props.challengesUrl,
    challengeTypesMap: state.challengeListing.challengeTypesMap,
    checkpointResults: checkpoints.checkpointResults,
    checkpointResultsUi: state.page.challengeDetails.checkpoints,
    checkpoints,
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
    isMenuOpened: !!state.topcoderHeader.openedMenu,
    loadingMMSubmissionsForChallengeId: state.challenge.loadingMMSubmissionsForChallengeId,
    isLoadingSubmissionInformation:
      Boolean(state.challenge.loadingSubmissionInformationForSubmissionId),
    submissionInformation: state.challenge.submissionInformation,
    mmSubmissions,
    allCountries: state.lookup.allCountries,
    mySubmissions,
    reviewTypes,
    openForRegistrationChallenges: state.challengeListing.openForRegistrationChallenges,
    statisticsData: state.challenge.statisticsData,
  };
}

const mapDispatchToProps = (dispatch) => {
  const ca = communityActions.tcCommunity;
  const lookupActions = actions.lookup;
  return {
    // getAllRecommendedChallenges: (tokenV3, recommendedTechnology) => {
    //   const uuid = shortId();
    //   const cl = challengeListingActions.challengeListing;
    //   dispatch(cl.getAllRecommendedChallengesInit(uuid));
    //   dispatch(
    //     cl.getAllRecommendedChallengesDone(
    //       uuid, tokenV3, recommendedTechnology,
    //     ),
    //   );
    // },
    getCommunitiesList: (auth) => {
      const uuid = shortId();
      dispatch(ca.getListInit(uuid));
      dispatch(ca.getListDone(uuid, auth));
    },
    getAllCountries: (tokenV3) => {
      dispatch(lookupActions.getAllCountriesInit());
      dispatch(lookupActions.getAllCountriesDone(tokenV3));
    },
    getReviewTypes: (tokenV3) => {
      dispatch(lookupActions.getReviewTypesInit());
      dispatch(lookupActions.getReviewTypesDone(tokenV3));
    },
    loadChallengeDetails: (tokens, challengeId) => {
      const a = actions.challenge;
      dispatch(a.getDetailsInit(challengeId));
      dispatch(a.getDetailsDone(challengeId, tokens.tokenV3, tokens.tokenV2))
        .then((res) => {
          const ch = res.payload;
          if (ch.track === COMPETITION_TRACKS.DES) {
            const p = ch.phases || []
              .filter(x => x.name === 'Checkpoint Review');
            if (p.length && !p[0].isOpen) {
              dispatch(a.fetchCheckpointsInit());
              dispatch(a.fetchCheckpointsDone(tokens.tokenV2, ch.legacyId));
            } else dispatch(a.dropCheckpoints());
          } else dispatch(a.dropCheckpoints());
          if (ch.status === CHALLENGE_STATUS.COMPLETED) {
            dispatch(a.loadResultsInit(ch.legacyId));
            dispatch(a.loadResultsDone(tokens, ch.legacyId, ch.track.toLowerCase()));
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
          if (challengeDetails.track === COMPETITION_TRACKS.DES) {
            const p = challengeDetails.phases || []
              .filter(x => x.name === 'Checkpoint Review');
            if (p.length && !p[0].isOpen) {
              dispatch(a.fetchCheckpointsDone(tokens.tokenV2, challengeDetails.legacyId));
            }
          }
          return challengeDetails;
        });
    },
    setChallengeListingFilter: (filter, stateProps) => {
      const cl = challengeListingActions.challengeListing;
      const cls = challengeListingSidebarActions.challengeListing.sidebar;
      const fp = challengeListingFilterPanelActions.challengeListing.filterPanel;
      const newFilter = _.assign(
        {},
        { types: stateProps.challengeTypes.map(type => type.abbreviation), search: '' },
        filter,
      );
      dispatch(cls.selectBucket(BUCKETS.OPEN_FOR_REGISTRATION));
      dispatch(cl.setFilter(newFilter));
      dispatch(fp.setSearchText(newFilter.search));
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
    selectChallengeDetailsTab:
      tab => dispatch(challengeDetailsActions.page.challengeDetails.selectTab(tab)),
    getTypes: () => {
      const cl = challengeListingActions.challengeListing;
      dispatch(cl.getChallengeTypesInit());
      dispatch(cl.getChallengeTypesDone());
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
    loadMMSubmissions: (challengeId, tokenV3) => {
      const a = actions.challenge;
      dispatch(a.getMmSubmissionsInit(challengeId));
      dispatch(a.getMmSubmissionsDone(challengeId, tokenV3));
    },
    loadSubmissionInformation: (challengeId, submissionId, tokenV3) => {
      const a = actions.challenge;
      dispatch(a.getSubmissionInformationInit(challengeId, submissionId));
      dispatch(a.getSubmissionInformationDone(challengeId, submissionId, tokenV3));
    },
    expandTag: (id) => {
      const a = challengeListingActions.challengeListing;
      dispatch(a.expandTag(id));
    },
    fetchChallengeStatistics: (tokens, challengeId) => {
      const a = actions.challenge;
      dispatch(a.fetchChallengeStatisticsInit());
      dispatch(a.fetchChallengeStatisticsDone(challengeId, tokens.tokenV3));
    },
  };
};

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...ownProps,
  ...stateProps,
  ...dispatchProps,
  setChallengeListingFilter: filter => dispatchProps.setChallengeListingFilter(filter, stateProps),
});

const ChallengeDetailContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps,
)(ChallengeDetailPageContainer);

export default ChallengeDetailContainer;
