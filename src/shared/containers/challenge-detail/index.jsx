/**
 * This container component load data into its state, and pass them to children via props.
 * Its should have in its state, and properly manage the showDetails set
 * (thus allowing to show/hide detail panels for different submissions),
 * and it should define all necessary handlers to pass to the children.
 */
/* global window */

import _ from 'lodash';
import communityActions from 'actions/tc-communities';
import { isMM as checkIsMM } from 'utils/challenge';
import LoadingPagePlaceholder from 'components/LoadingPagePlaceholder';
import pageActions from 'actions/page';
import ChallengeHeader from 'components/challenge-detail/Header';
import challengeListingActions from 'actions/challenge-listing';
import challengeListingSidebarActions from 'actions/challenge-listing/sidebar';
import Registrants from 'components/challenge-detail/Registrants';
import shortId from 'shortid';
import Submissions from 'components/challenge-detail/Submissions';
import MySubmissions from 'components/challenge-detail/MySubmissions';
import Winners from 'components/challenge-detail/Winners';
import ChallengeDetailsView from 'components/challenge-detail/Specification';
import RecommendedThriveArticles from 'components/challenge-detail/ThriveArticles';
import RecommendedActiveChallenges from 'components/challenge-detail/RecommendedActiveChallenges';
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
import {
  CHALLENGE_PHASE_TYPES,
  COMPETITION_TRACKS,
  COMPETITION_TRACKS_V3,
  SUBTRACKS,
} from 'utils/tc';
import { config, MetaTags } from 'topcoder-react-utils';
import { actions } from 'topcoder-react-lib';
import { getService } from 'services/contentful';
import {
  getDisplayRecommendedChallenges,
  getRecommendedTags,
} from 'utils/challenge-detail/helper';

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
  const { legacy } = challenge;
  const { track, subTrack } = legacy;
  if (challenge.name.startsWith('LUX -')) return ogLuxChallenge;
  if (challenge.name.startsWith('RUX -')) return ogRuxChallenge;
  if (challenge.prizes) {
    const totalPrize = challenge.prizes.reduce((p, sum) => p + sum, 0);
    if (totalPrize > 2500) return ogBigPrizesChallenge;
  }

  switch (subTrack) {
    case SUBTRACKS.FIRST_2_FINISH: return ogFirst2Finish;
    case SUBTRACKS.UI_PROTOTYPE_COMPETITION: {
      const submission = (challenge.phases || [])
        .find(p => p.name === CHALLENGE_PHASE_TYPES.SUBMISSION);
      if (submission) {
        if (submission.duration < 1.1 * DAY) return og24hUiPrototype;
        if (submission.duration < 2.1 * DAY) return og48hUiPrototype;
      }
      return ogUiPrototype;
    }
    case SUBTRACKS.WIREFRAMES: return ogWireframe;
    default:
  }
  switch (track) {
    case COMPETITION_TRACKS_V3.DEVELOP: return ogDevelopment;
    case COMPETITION_TRACKS_V3.DESIGN: return ogUiDesign;
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
      getAllRecommendedChallenges,
      recommendedChallenges,
      auth,
      challenge,
      loadingRecommendedChallengesUUID,
      history,
    } = this.props;

    if (challenge.isLegacyChallenge && !history.location.pathname.includes(challenge.id)) {
      history.location.pathname = `/challenges/${challenge.id}`; // eslint-disable-line no-param-reassign
      history.push(history.location.pathname, history.state);
    }

    const recommendedTechnology = getRecommendedTags(challenge);
    if (
      challenge
      && challenge.id === challengeId
      && !loadingRecommendedChallengesUUID
      && (
        !recommendedChallenges[recommendedTechnology]
        || (
          Date.now() - recommendedChallenges[recommendedTechnology].lastUpdateOfActiveChallenges
          > 10 * MIN
        )
      )
    ) {
      getAllRecommendedChallenges(auth.tokenV3, recommendedTechnology);
    }

    const { thriveArticles } = this.state;
    const userId = _.get(this, 'props.auth.user.userId');
    const nextUserId = _.get(nextProps, 'auth.user.userId');

    if (userId !== nextUserId) {
      nextProps.getCommunitiesList(nextProps.auth);
      reloadChallengeDetails(nextProps.auth, challengeId);
    }

    const { track } = nextProps.challenge;
    if (track !== COMPETITION_TRACKS.DESIGN && thriveArticles.length === 0) {
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
            const asset = _.find(content.Article.includes.Asset,
              a => a.sys.id === item.fields.featuredImage.sys.id);
            _.assign(item.fields.featuredImage, { file: asset.fields.file });
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
      selectChallengeDetailsTab,
      prizeMode,
      recommendedChallenges,
      expandedTags,
      expandTag,
      mySubmissions,
      reviewTypes,
    } = this.props;

    const displayRecommendedChallenges = getDisplayRecommendedChallenges(
      challenge,
      recommendedChallenges,
      auth,
    );

    const {
      thriveArticles,
      showDeadlineDetail,
      registrantsSort,
      submissionsSort,
      notFoundCountryFlagUrl,
      mySubmissionsSort,
    } = this.state;

    const {
      legacy,
      legacyId,
      status,
      phases,
      metadata,
    } = challenge;

    const { track } = legacy || {};

    const submissionsViewable = _.find(metadata, { type: 'submissionsViewable' });

    const isLoggedIn = !_.isEmpty(auth.tokenV3);

    /* Generation of data for SEO meta-tags. */
    let prizesStr;
    if (challenge.prizes && challenge.prizes.length) {
      prizesStr = challenge.prizes.map(p => `$${p}`).join('/');
      prizesStr = `[${prizesStr}] - `;
    }
    const title = challenge.name;

    let description = challenge.description || challenge.detailedRequirements;
    description = description ? description.slice(0, 256) : '';
    description = htmlToText.fromString(description, {
      singleNewLineParagraphs: true,
      wordwrap: false,
    });
    description = description.replace(/\n/g, ' ');

    const results2 = resultsLoadedForChallengeId === _.toString(challengeId)
      ? results : null;

    const isEmpty = _.isEmpty(challenge);
    const isMM = checkIsMM(challenge);
    const isLegacyMM = isMM && Boolean(challenge.roundId);

    if (isLoadingChallenge || isLoadingTerms) {
      return <LoadingPagePlaceholder />;
    }

    let winners = challenge.winners || [];
    winners = winners.filter(w => !w.type || w.type === 'final');

    let hasFirstPlacement = false;
    if (!_.isEmpty(winners)) {
      const userHandle = (auth.user || {}).handle;
      hasFirstPlacement = _.some(winners, { placement: 1, handle: userHandle });
    }


    const submissionEnded = status === 'COMPLETED'
    || (!_.some(phases, { name: 'Submission', isOpen: true })
      && !_.some(phases, { name: 'Checkpoint Submission', isOpen: true }));

    const { prizeSets } = challenge;
    let challengePrizes = [];
    if (prizeSets && prizeSets[0] && prizeSets[0].type === 'placement') {
      challengePrizes = prizeSets[0].prizes;
    }

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
              hasRecommendedChallenges={displayRecommendedChallenges.length > 0}
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
                onSortChange={sort => this.setState({ submissionsSort: sort })}
                hasRegistered={challenge.isRegistered}
                unregistering={unregistering}
                isLegacyMM={isLegacyMM}
                submissionEnded={submissionEnded}
                challengesUrl={challengesUrl}
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
            !isEmpty && !isLegacyMM && selectedTab === DETAIL_TABS.WINNERS
            && (
              <Winners
                winners={winners}
                prizes={challengePrizes}
                viewable={submissionsViewable ? submissionsViewable.value === 'true' : false}
                submissions={challenge.submissions}
                isDesign={track.toLowerCase() === 'design'}
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
        {
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
        }
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
  prizeMode: 'money-usd',
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
  recommendedChallenges: PT.shape().isRequired,
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
  selectChallengeDetailsTab: PT.func.isRequired,
  getAllRecommendedChallenges: PT.func.isRequired,
  prizeMode: PT.string,
  expandedTags: PT.arrayOf(PT.number).isRequired,
  expandTag: PT.func.isRequired,
  loadingRecommendedChallengesUUID: PT.string.isRequired,
  history: PT.shape().isRequired,
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
  return {
    auth: state.auth,
    challenge,
    challengeTypes: cl.challengeTypes,
    recommendedChallenges: cl.recommendedChallenges,
    loadingRecommendedChallengesUUID: cl.loadingRecommendedChallengesUUID,
    expandedTags: cl.expandedTags,
    challengeId: String(props.match.params.challengeId),
    challengesUrl: props.challengesUrl,
    challengeTypesMap: state.challengeListing.challengeTypesMap,
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
    isMenuOpened: !!state.topcoderHeader.openedMenu,
    loadingMMSubmissionsForChallengeId: state.challenge.loadingMMSubmissionsForChallengeId,
    isLoadingSubmissionInformation:
      Boolean(state.challenge.loadingSubmissionInformationForSubmissionId),
    submissionInformation: state.challenge.submissionInformation,
    mmSubmissions,
    allCountries: state.lookup.allCountries,
    mySubmissions,
    reviewTypes,
  };
}

const mapDispatchToProps = (dispatch) => {
  const ca = communityActions.tcCommunity;
  const lookupActions = actions.lookup;
  return {
    getAllRecommendedChallenges: (tokenV3, recommendedTechnology) => {
      const uuid = shortId();
      const cl = challengeListingActions.challengeListing;
      dispatch(cl.getAllRecommendedChallengesInit(uuid));
      dispatch(
        cl.getAllRecommendedChallengesDone(
          uuid, tokenV3, recommendedTechnology,
        ),
      );
    },
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
          if (ch.track === COMPETITION_TRACKS.DESIGN) {
            const p = ch.phases || []
              .filter(x => x.name === 'Checkpoint Review');
            if (p.length && !p[0].isOpen) {
              dispatch(a.fetchCheckpointsInit());
              dispatch(a.fetchCheckpointsDone(tokens.tokenV2, ch.legacyId));
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
          if (challengeDetails.track === COMPETITION_TRACKS.DESIGN) {
            const p = challengeDetails.phases || []
              .filter(x => x.name === 'Checkpoint Review');
            if (p.length && !p[0].isOpen) {
              dispatch(a.fetchCheckpointsDone(tokens.tokenV2, challengeDetails.legacyId));
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
  };
};

const ChallengeDetailContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ChallengeDetailPageContainer);

export default ChallengeDetailContainer;
